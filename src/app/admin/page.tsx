"use client";

/**
 * Panel de administración local — /admin
 *
 * Solo funciona en localhost.
 * Pestañas:
 *  1. Añadir/editar producto individual
 *  2. Importar desde lista de Amazon (pegar HTML o subir fichero)
 *  3. Catálogo completo (editar/eliminar)
 *
 * Workflow:
 *  1. Gestiona productos aquí
 *  2. git add src/data/products.json && git commit && git push
 *  3. Vercel redespliega automáticamente (~1 min)
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { detectProductMeta, detectCondition } from "@/lib/detect-product-meta";

/* ─── Tipos ──────────────────────────────────────────────── */

type Category   = "consolas" | "videojuegos" | "accesorios" | "figuras";
type Platform   = "playstation" | "xbox" | "nintendo" | "multi";
type Condition  = "nuevo" | "segunda-mano" | "reacondicionado";

type ProductForm = {
  id: string;
  title: string;
  category: Category;
  platformFamily: Platform;
  generation: string;
  platformLabel: string;
  condition: Condition;
  price: string;
  oldPrice: string;
  imageUrl: string;
  amazonUrl: string;
  badge: string;
  featured: boolean;
};

type ExtractedItem = {
  selected: boolean;
  asin: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice: number;
  // Auto-detectados (editables por el usuario)
  category: Category;
  platformFamily: Platform;
  generation: string;
  condition: Condition;
};

/* ─── Constantes ──────────────────────────────────────────── */

const GENERATIONS: Record<Platform, string[]> = {
  playstation: ["ps3", "ps4", "ps5"],
  xbox:        ["xbox-360", "xbox-one", "xbox-series"],
  nintendo:    ["switch", "switch-oled"],
  multi:       [""],
};

const PLATFORM_LABELS: Record<string, string> = {
  ps3:          "PS3",
  ps4:          "PS4",
  ps5:          "PS5",
  "xbox-360":   "Xbox 360",
  "xbox-one":   "Xbox One",
  "xbox-series":"Xbox Series X/S",
  switch:       "Nintendo Switch",
  "switch-oled":"Nintendo Switch OLED",
  "":           "Multi",
};

const EMPTY_FORM: ProductForm = {
  id: "", title: "", category: "videojuegos", platformFamily: "playstation",
  generation: "ps5", platformLabel: "PS5", condition: "nuevo",
  price: "", oldPrice: "", imageUrl: "", amazonUrl: "", badge: "", featured: false,
};

/* ─── Helpers ──────────────────────────────────────────────── */

function asinFromUrl(url: string): string {
  return url.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? "";
}

function amazonImageUrl(asin: string) {
  // URL directa de imagen por ASIN — no requiere API ni autenticación
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL300_.jpg`;
}

function parsePrice(text: string): number {
  const n = parseFloat(text.replace(/[€$£\s]/g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}

/* ─────────────────────────────────────────────────────────── */
/* Parser de lista de Amazon (client-side con DOMParser)       */
/* ─────────────────────────────────────────────────────────── */

function parseAmazonWishlistHtml(html: string): ExtractedItem[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const results: ExtractedItem[] = [];
  const seen = new Set<string>();

  function addItem(
    asin: string,
    title: string,
    imageUrl: string,
    price: number,
    oldPrice: number,
    conditionText = "",
  ) {
    if (!asin || seen.has(asin)) return;
    seen.add(asin);

    // Preferir imagen real de Amazon CDN; fallback por ASIN
    const finalImage =
      imageUrl && imageUrl.includes("media-amazon.com") && !imageUrl.includes("widgets")
        ? imageUrl
        : imageUrl && imageUrl.includes("ssl-images-amazon.com") && !imageUrl.includes("widgets")
          ? imageUrl
          : amazonImageUrl(asin);

    // Auto-detección de metadatos
    const meta = detectProductMeta(title, conditionText);

    results.push({
      selected: true,
      asin,
      title: title.trim(),
      imageUrl: finalImage,
      price,
      oldPrice,
      category:       meta.category,
      platformFamily: meta.platformFamily as Platform,
      generation:     meta.generation,
      condition:      meta.condition,
    });
  }

  /* ── Estrategia 1: elementos con data-asin (listas de Amazon) ── */
  doc.querySelectorAll("[data-asin]").forEach((el) => {
    const asin = el.getAttribute("data-asin")?.trim() ?? "";
    if (!asin) return;

    const title =
      el.querySelector(".g-itemname, [id^='itemName_'], h2 a, .a-size-base-plus")
        ?.textContent?.trim() ??
      el.querySelector("a[title]")?.getAttribute("title")?.trim() ??
      "";

    const imgEl = el.querySelector("img[src*='amazon']") as HTMLImageElement | null;
    const imageUrl = imgEl?.src ?? amazonImageUrl(asin);

    const priceText =
      el.querySelector(".a-price .a-offscreen, [id^='itemPrice_'] .a-offscreen")
        ?.textContent?.trim() ?? "";
    const price = parsePrice(priceText);

    const oldPriceText = el.querySelector(".a-text-strike")?.textContent?.trim() ?? "";
    const oldPrice = parsePrice(oldPriceText);

    // Extraer texto de condición del HTML (Amazon lo incluye cerca del precio)
    const conditionText =
      el.querySelector(".a-color-secondary span, [id^='item-condition-']")
        ?.textContent?.trim() ?? "";

    addItem(asin, title, imageUrl, price, oldPrice, conditionText);
  });

  /* ── Estrategia 2: links /dp/ASIN (cualquier página de Amazon) ── */
  if (results.length === 0) {
    doc.querySelectorAll("a[href*='/dp/']").forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      const asin = href.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? "";
      if (!asin) return;

      const title = link.textContent?.trim() ?? link.getAttribute("title")?.trim() ?? "";
      const container =
        link.closest("li, div[id^='item-'], .s-result-item") ?? link.parentElement;
      const imgEl = container?.querySelector("img[src*='amazon']") as HTMLImageElement | null;
      const imageUrl = imgEl?.src ?? amazonImageUrl(asin);
      const priceText =
        container?.querySelector(".a-price .a-offscreen")?.textContent?.trim() ?? "";

      addItem(asin, title, imageUrl, parsePrice(priceText), 0);
    });
  }

  /* ── Estrategia 3: ASINs en atributos data-* ── */
  if (results.length === 0) {
    doc.querySelectorAll("[data-item-prime-info], [data-csa-c-item-id]").forEach((el) => {
      const raw =
        el.getAttribute("data-item-prime-info") ?? el.getAttribute("data-csa-c-item-id") ?? "";
      const asin = raw.match(/([A-Z0-9]{10})/)?.[1] ?? "";
      if (asin) addItem(asin, "", amazonImageUrl(asin), 0, 0);
    });
  }

  return results;
}

/* ─── Componente de selector de plataforma/generación ────── */

function PlatformSelectors({
  platform, generation, onChange,
}: {
  platform: Platform;
  generation: string;
  onChange: (p: Platform, g: string) => void;
}) {
  const selectCls = "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none";
  return (
    <div className="flex gap-2">
      <select
        className={selectCls}
        value={platform}
        onChange={(e) => {
          const p = e.target.value as Platform;
          const g = GENERATIONS[p][0];
          onChange(p, g);
        }}
      >
        <option value="playstation">PlayStation</option>
        <option value="xbox">Xbox</option>
        <option value="nintendo">Nintendo</option>
        <option value="multi">Multi</option>
      </select>
      <select
        className={selectCls}
        value={generation}
        onChange={(e) => onChange(platform, e.target.value)}
      >
        {GENERATIONS[platform].map((g) => (
          <option key={g} value={g}>{PLATFORM_LABELS[g] ?? g}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Estilos reutilizables ──────────────────────────────── */

const inputCls =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500";
const labelCls = "mb-1 block text-xs font-medium text-zinc-400 uppercase tracking-wide";

/* ═══════════════════════════════════════════════════════════ */
/*  PESTAÑA 1: Añadir / editar producto individual            */
/* ═══════════════════════════════════════════════════════════ */

function TabAddProduct({
  initial, onSaved,
}: {
  initial?: ProductForm;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProductForm>(initial ?? EMPTY_FORM);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const editing = Boolean(initial);

  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  function set<K extends keyof ProductForm>(key: K, val: ProductForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "generation") next.platformLabel = PLATFORM_LABELS[val as string] ?? String(val);
      if (key === "platformFamily") {
        const gens = GENERATIONS[val as Platform] ?? [];
        next.generation = gens[0] ?? "";
        next.platformLabel = PLATFORM_LABELS[gens[0] ?? ""] ?? String(val);
      }
      if (key === "amazonUrl") {
        const asin = asinFromUrl(String(val));
        if (asin && !editing) next.id = asin;
        if (asin && !next.imageUrl) next.imageUrl = amazonImageUrl(asin);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
      badge: form.badge || undefined,
      generation: form.generation || null,
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus({ ok: true, msg: data.action === "created" ? "✅ Producto añadido" : "✅ Actualizado" });
      if (!editing) setForm(EMPTY_FORM);
      onSaved();
    } else {
      setStatus({ ok: false, msg: `❌ ${data.error}` });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-5 text-base font-semibold text-white">
        {editing ? "✏️ Editar producto" : "➕ Añadir producto"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>URL Amazon (pega aquí primero)</label>
          <input className={inputCls} placeholder="https://www.amazon.es/dp/B0CLTBHX3P"
            value={form.amazonUrl} onChange={(e) => set("amazonUrl", e.target.value)} required />
          <p className="mt-1 text-xs text-zinc-500">El ASIN y la imagen se rellenan solos</p>
        </div>
        <div>
          <label className={labelCls}>ASIN / ID</label>
          <input className={inputCls} placeholder="B0CLTBHX3P" value={form.id}
            onChange={(e) => set("id", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Título</label>
          <input className={inputCls} placeholder="PlayStation 5…" value={form.title}
            onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Categoría</label>
          <select className={inputCls} value={form.category}
            onChange={(e) => set("category", e.target.value as Category)}>
            <option value="consolas">Consolas</option>
            <option value="videojuegos">Videojuegos</option>
            <option value="accesorios">Accesorios</option>
            <option value="figuras">Figuras</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Condición</label>
          <select className={inputCls} value={form.condition}
            onChange={(e) => set("condition", e.target.value as Condition)}>
            <option value="nuevo">Nuevo</option>
            <option value="reacondicionado">Reacondicionado</option>
            <option value="segunda-mano">Segunda mano</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Plataforma</label>
          <select className={inputCls} value={form.platformFamily}
            onChange={(e) => set("platformFamily", e.target.value as Platform)}>
            <option value="playstation">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="nintendo">Nintendo</option>
            <option value="multi">Multi</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Generación</label>
          <select className={inputCls} value={form.generation}
            onChange={(e) => set("generation", e.target.value)}>
            {GENERATIONS[form.platformFamily].map((g) => (
              <option key={g} value={g}>{PLATFORM_LABELS[g] ?? g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Precio actual (€)</label>
          <input className={inputCls} type="number" step="0.01" min="0" placeholder="39.99"
            value={form.price} onChange={(e) => set("price", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Precio anterior (€) — opcional</label>
          <input className={inputCls} type="number" step="0.01" min="0" placeholder="59.99"
            value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Badge — opcional (-50%)</label>
          <input className={inputCls} placeholder="-50%" value={form.badge}
            onChange={(e) => set("badge", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>URL imagen</label>
          <input className={inputCls} placeholder="Auto-rellenado desde ASIN" value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <input id="featured" type="checkbox" className="h-4 w-4 accent-orange-500"
            checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
          <label htmlFor="featured" className="text-sm text-zinc-300">Destacado (aparece en portada)</label>
        </div>
      </div>
      {form.imageUrl && (
        <div className="mt-4 flex items-center gap-3">
          <Image src={form.imageUrl} alt="preview" width={80} height={80}
            className="h-20 w-20 rounded-lg bg-white object-contain" unoptimized />
          <span className="text-xs text-zinc-500">Vista previa</span>
        </div>
      )}
      {status && (
        <p className={`mt-4 rounded-lg px-4 py-2 text-sm ${status.ok ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"}`}>
          {status.msg}
        </p>
      )}
      <div className="mt-5 flex gap-3">
        <button type="submit" disabled={loading}
          className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50">
          {loading ? "Guardando…" : editing ? "Actualizar" : "Añadir producto"}
        </button>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  PESTAÑA 2: Importar lista de Amazon                        */
/* ═══════════════════════════════════════════════════════════ */

const miniSelect = "rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-xs text-white focus:border-orange-500 focus:outline-none";

const CONDITION_COLORS: Record<Condition, string> = {
  "nuevo":          "bg-blue-900/60 text-blue-300",
  "reacondicionado":"bg-amber-900/60 text-amber-300",
  "segunda-mano":   "bg-zinc-700 text-zinc-300",
};

function TabImportList({ onImported }: { onImported: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [htmlInput, setHtmlInput]       = useState("");
  const [items, setItems]               = useState<ExtractedItem[]>([]);
  const [parsed, setParsed]             = useState(false);
  const [importing, setImporting]       = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setHtmlInput(String(ev.target?.result ?? ""));
    reader.readAsText(file, "utf-8");
  }

  function handleParse() {
    if (!htmlInput.trim()) return;
    const extracted = parseAmazonWishlistHtml(htmlInput);
    setItems(extracted);
    setParsed(true);
    setImportResult(null);
  }

  const toggleItem = useCallback((idx: number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, selected: !it.selected } : it)));
  }, []);

  function updateItem(idx: number, patch: Partial<ExtractedItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function handleImport() {
    const toImport = items.filter((it) => it.selected && it.asin);
    if (!toImport.length) return;
    setImporting(true);
    setImportResult(null);

    let ok = 0; let fail = 0;
    for (const item of toImport) {
      const platLabel = PLATFORM_LABELS[item.generation] ?? item.platformFamily;
      const payload = {
        id:             item.asin,
        title:          item.title || `Producto Amazon ${item.asin}`,
        category:       item.category,
        platformFamily: item.platformFamily,
        generation:     item.generation || null,
        platformLabel:  platLabel,
        condition:      item.condition,
        price:          item.price || 0,
        ...(item.oldPrice && item.oldPrice > item.price ? { oldPrice: item.oldPrice } : {}),
        imageUrl:       item.imageUrl || amazonImageUrl(item.asin),
        amazonUrl:      `https://www.amazon.es/dp/${item.asin}`,
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) ok++; else fail++;
    }
    setImportResult(`✅ ${ok} importados${fail ? ` · ❌ ${fail} errores` : ""}`);
    setImporting(false);
    if (ok > 0) onImported();
  }

  const selectedCount = items.filter((it) => it.selected).length;

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="rounded-xl border border-blue-800/50 bg-blue-900/20 p-4 text-sm text-blue-300">
        <p className="font-semibold mb-1">¿Cómo obtener el HTML de tu lista de Amazon?</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-200">
          <li>Ve a <strong>amazon.es → Listas → tu lista</strong> (PS5, PS4, Xbox…)</li>
          <li><kbd className="rounded bg-blue-900 px-1.5">Ctrl+A</kbd> → <kbd className="rounded bg-blue-900 px-1.5">Ctrl+C</kbd> y pega abajo</li>
          <li>O guarda la página: <kbd className="rounded bg-blue-900 px-1.5">Ctrl+S</kbd> → sube el .html</li>
        </ol>
        <p className="mt-2 text-blue-400 text-xs">
          ✨ La web detecta automáticamente la plataforma, categoría y condición de cada producto. Solo revisa y corrige si algo está mal.
        </p>
      </div>

      {/* Input HTML */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">HTML de la lista Amazon</h3>
          <label className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-orange-500 hover:text-orange-400">
            📂 Subir .html
            <input type="file" accept=".html,.htm" className="hidden" ref={fileRef} onChange={handleFile} />
          </label>
        </div>
        <textarea
          className={`${inputCls} h-32 resize-y font-mono text-xs`}
          placeholder="Pega aquí el HTML de tu lista de Amazon..."
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button" onClick={handleParse} disabled={!htmlInput.trim()}
            className="rounded-lg bg-zinc-700 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-600 disabled:opacity-40"
          >
            🔍 Analizar y auto-clasificar
          </button>
          {parsed && <span className="text-sm text-zinc-400">{items.length} productos encontrados</span>}
        </div>
      </div>

      {/* Tabla de productos extraídos con metadata auto-detectada */}
      {parsed && items.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Vista previa — {selectedCount}/{items.length} seleccionados
            </h3>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setItems((p) => p.map((it) => ({ ...it, selected: true })))}
                className="text-zinc-400 hover:text-white">Todos</button>
              <button onClick={() => setItems((p) => p.map((it) => ({ ...it, selected: false })))}
                className="text-zinc-400 hover:text-white">Ninguno</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-700 text-zinc-400 uppercase tracking-wide">
                <tr>
                  <th className="pb-2 pr-2 w-6">✓</th>
                  <th className="pb-2 pr-2 w-14">Img</th>
                  <th className="pb-2 pr-2 min-w-[180px]">Título</th>
                  <th className="pb-2 pr-2">Plataforma</th>
                  <th className="pb-2 pr-2">Categoría</th>
                  <th className="pb-2 pr-2">Condición</th>
                  <th className="pb-2 pr-2 w-20">Precio €</th>
                  <th className="pb-2 w-20">Antes €</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {items.map((item, idx) => (
                  <tr key={item.asin + idx} className={item.selected ? "" : "opacity-35"}>
                    <td className="py-2 pr-2">
                      <input type="checkbox" className="accent-orange-500"
                        checked={item.selected} onChange={() => toggleItem(idx)} />
                    </td>
                    <td className="py-2 pr-2">
                      {item.imageUrl
                        ? <Image src={item.imageUrl} alt="" width={44} height={44}
                            className="h-11 w-11 rounded bg-white object-contain" unoptimized />
                        : <div className="h-11 w-11 rounded bg-zinc-700" />
                      }
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-white focus:border-orange-500 focus:outline-none"
                        value={item.title}
                        onChange={(e) => updateItem(idx, { title: e.target.value })}
                        placeholder={`Producto ${item.asin}`}
                      />
                      <span className="mt-0.5 block font-mono text-zinc-600">{item.asin}</span>
                    </td>
                    {/* Plataforma + generación */}
                    <td className="py-2 pr-2">
                      <select className={`${miniSelect} mb-1 w-full`} value={item.platformFamily}
                        onChange={(e) => {
                          const p = e.target.value as Platform;
                          updateItem(idx, { platformFamily: p, generation: GENERATIONS[p][0] });
                        }}>
                        <option value="playstation">PlayStation</option>
                        <option value="xbox">Xbox</option>
                        <option value="nintendo">Nintendo</option>
                        <option value="multi">Multi</option>
                      </select>
                      <select className={`${miniSelect} w-full`} value={item.generation}
                        onChange={(e) => updateItem(idx, { generation: e.target.value })}>
                        {GENERATIONS[item.platformFamily].map((g) => (
                          <option key={g} value={g}>{PLATFORM_LABELS[g] ?? g}</option>
                        ))}
                      </select>
                    </td>
                    {/* Categoría */}
                    <td className="py-2 pr-2">
                      <select className={`${miniSelect} w-full`} value={item.category}
                        onChange={(e) => updateItem(idx, { category: e.target.value as Category })}>
                        <option value="consolas">Consolas</option>
                        <option value="videojuegos">Videojuegos</option>
                        <option value="accesorios">Accesorios</option>
                        <option value="figuras">Figuras</option>
                      </select>
                    </td>
                    {/* Condición */}
                    <td className="py-2 pr-2">
                      <select
                        className={`${miniSelect} w-full font-semibold ${CONDITION_COLORS[item.condition]}`}
                        value={item.condition}
                        onChange={(e) => updateItem(idx, { condition: e.target.value as Condition })}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="reacondicionado">Reacondicionado</option>
                        <option value="segunda-mano">Segunda mano</option>
                      </select>
                    </td>
                    {/* Precios */}
                    <td className="py-2 pr-2">
                      <input className={`${miniSelect} w-full`} type="number" step="0.01" min="0"
                        value={item.price || ""} placeholder="0.00"
                        onChange={(e) => updateItem(idx, { price: parseFloat(e.target.value) || 0 })} />
                    </td>
                    <td className="py-2">
                      <input className={`${miniSelect} w-full`} type="number" step="0.01" min="0"
                        value={item.oldPrice || ""} placeholder="—"
                        onChange={(e) => updateItem(idx, { oldPrice: parseFloat(e.target.value) || 0 })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button onClick={handleImport} disabled={importing || selectedCount === 0}
              className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50">
              {importing ? "Importando…" : `⬇️ Importar ${selectedCount} productos`}
            </button>
            {importResult && <span className="text-sm text-emerald-400">{importResult}</span>}
          </div>
        </div>
      )}

      {parsed && items.length === 0 && (
        <div className="rounded-xl border border-amber-800/50 bg-amber-900/20 p-4 text-sm text-amber-300">
          No se encontraron productos. Asegúrate de copiar toda la página (Ctrl+A → Ctrl+C).
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  PESTAÑA 3: Catálogo completo                              */
/* ═══════════════════════════════════════════════════════════ */

function TabCatalog({
  products,
  onEdit,
  onDelete,
  onRefresh,
}: {
  products: Record<string, unknown>[];
  onEdit: (p: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) {
  const [q, setQ] = useState("");
  const [redetecting, setRedetecting] = useState(false);
  const [redetectMsg, setRedetectMsg] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    !q || String(p.title ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  async function handleRedetect() {
    setRedetecting(true);
    setRedetectMsg(null);
    const res = await fetch("/api/admin/redetect", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setRedetectMsg(`✅ ${data.changed} productos actualizados de ${data.total}`);
      onRefresh();
    } else {
      setRedetectMsg(`❌ Error: ${data.error}`);
    }
    setRedetecting(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input className={`${inputCls} flex-1`} placeholder="Buscar por título…"
          value={q} onChange={(e) => setQ(e.target.value)} />
        <button
          onClick={handleRedetect}
          disabled={redetecting || products.length === 0}
          title="Re-aplica la auto-detección de plataforma, categoría y condición a todos los productos"
          className="shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-300 hover:border-orange-500 hover:text-orange-400 disabled:opacity-40"
        >
          {redetecting ? "Analizando…" : "🔄 Re-detectar categorías"}
        </button>
      </div>
      {redetectMsg && (
        <p className="mb-3 rounded-lg bg-zinc-800 px-4 py-2 text-xs text-emerald-400">{redetectMsg}</p>
      )}
      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800/60 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Cat.</th>
              <th className="px-4 py-3">Plataforma</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.map((p) => {
              const prod = p as {
                id: string; title: string; category: string;
                platformLabel: string; price: number; oldPrice?: number;
                condition: string; featured?: boolean;
              };
              return (
                <tr key={prod.id} className="bg-zinc-900 hover:bg-zinc-800/50">
                  <td className="max-w-xs truncate px-4 py-2.5 text-white">
                    {prod.featured && <span className="mr-1.5 text-orange-400">★</span>}
                    <span title={prod.title}>{prod.title}</span>
                  </td>
                  <td className="px-4 py-2.5 text-zinc-400">{prod.category}</td>
                  <td className="px-4 py-2.5 text-zinc-400">{prod.platformLabel}</td>
                  <td className="px-4 py-2.5 text-white">
                    {prod.price.toFixed(2)} €
                    {prod.oldPrice && (
                      <span className="ml-1 text-xs text-zinc-500 line-through">
                        {prod.oldPrice.toFixed(2)} €
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      prod.condition === "nuevo" ? "bg-blue-900/50 text-blue-300"
                      : prod.condition === "reacondicionado" ? "bg-amber-900/50 text-amber-300"
                      : "bg-zinc-700 text-zinc-300"
                    }`}>
                      {prod.condition}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => onEdit(p)}
                      className="mr-3 text-xs text-orange-400 hover:text-orange-300">Editar</button>
                    <button onClick={() => onDelete(prod.id)}
                      className="text-xs text-red-500 hover:text-red-400">Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  COMPONENTE PRINCIPAL                                       */
/* ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════ */
/*  Bloqueo en producción                                      */
/* ═══════════════════════════════════════════════════════════ */

function ProductionBlock() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <p className="text-3xl">🔒</p>
        <h1 className="mt-4 text-lg font-bold text-white">Panel de administración</h1>
        <p className="mt-2 text-sm text-zinc-400">
          El panel de administración solo está disponible en local para proteger tu catálogo.
        </p>
        <p className="mt-4 rounded-lg bg-zinc-800 px-4 py-3 text-left font-mono text-xs text-orange-300">
          cd cholloweb-next<br />
          npm run dev<br />
          # → localhost:3000/admin
        </p>
        <a href="/" className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400">
          Volver a la web
        </a>
      </div>
    </div>
  );
}

type Tab = "add" | "import" | "catalog";

export default function AdminPage() {
  const [tab, setTab]             = useState<Tab>("import");
  const isProduction = typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1");
  const [products, setProducts]   = useState<Record<string, unknown>[]>([]);
  const [editingProd, setEditingProd] = useState<ProductForm | undefined>(undefined);

  if (isProduction) return <ProductionBlock />;

  async function refreshProducts() {
    const d = await fetch("/api/products").then((r) => r.json());
    setProducts(d.products ?? []);
  }

  useEffect(() => { void refreshProducts(); }, []);

  function handleEdit(p: Record<string, unknown>) {
    const pp = p as { id: string; title: string; category: Category; platformFamily: Platform;
      generation: string | null; platformLabel: string; condition: Condition;
      price: number; oldPrice?: number; imageUrl: string; amazonUrl: string;
      badge?: string; featured?: boolean };
    setEditingProd({
      id: pp.id, title: pp.title, category: pp.category,
      platformFamily: pp.platformFamily, generation: pp.generation ?? "",
      platformLabel: pp.platformLabel, condition: pp.condition,
      price: String(pp.price), oldPrice: pp.oldPrice ? String(pp.oldPrice) : "",
      imageUrl: pp.imageUrl, amazonUrl: pp.amazonUrl,
      badge: pp.badge ?? "", featured: pp.featured ?? false,
    });
    setTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm(`¿Eliminar producto ${id}?`)) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    void refreshProducts();
  }

  function handleSaved() {
    void refreshProducts();
    setEditingProd(undefined);
  }

  const tabBtn = (t: Tab, label: string) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition ${
      tab === t
        ? "bg-orange-500 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Cabecera */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-orange-400">chollo</span>web.es — Admin
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Tras cualquier cambio ejecuta{" "}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-orange-300">
                git add src/data/products.json &amp;&amp; git commit -m &quot;update catalog&quot; &amp;&amp; git push
              </code>
            </p>
          </div>
          <span className="mt-1 rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-700">
            {products.length} productos
          </span>
        </div>

        {/* Pestañas */}
        <div className="mb-6 flex gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5">
          <button className={tabBtn("import", "Importar lista")}
            onClick={() => { setTab("import"); setEditingProd(undefined); }}>
            📥 Importar lista Amazon
          </button>
          <button className={tabBtn("add", "Añadir")}
            onClick={() => setTab("add")}>
            {editingProd ? "✏️ Editar producto" : "➕ Añadir producto"}
          </button>
          <button className={tabBtn("catalog", "Catálogo")}
            onClick={() => { setTab("catalog"); setEditingProd(undefined); }}>
            📋 Catálogo ({products.length})
          </button>
        </div>

        {/* Contenido de pestaña */}
        {tab === "add"     && <TabAddProduct initial={editingProd} onSaved={handleSaved} />}
        {tab === "import"  && <TabImportList onImported={refreshProducts} />}
        {tab === "catalog" && (
          <TabCatalog products={products} onEdit={handleEdit} onDelete={handleDelete} onRefresh={refreshProducts} />
        )}

        <p className="mt-8 text-center text-xs text-zinc-700">
          Panel solo disponible en localhost:3000/admin
        </p>
      </div>
    </div>
  );
}
