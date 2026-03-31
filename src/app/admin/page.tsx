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
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { detectProductMeta } from "@/lib/detect-product-meta";

/* ─── Tipos ──────────────────────────────────────────────── */

type Category   = "consolas" | "videojuegos" | "accesorios" | "figuras" | "peliculas";
type Platform   = "playstation" | "xbox" | "nintendo" | "evercade" | "multi";
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
  nintendo:    ["switch", "switch-2"],
  evercade:    ["evercade-handheld"],
  multi:       [""],
};

const PLATFORM_LABELS: Record<string, string> = {
  ps3:                "PS3",
  ps4:                "PS4",
  ps5:                "PS5",
  "xbox-360":         "Xbox 360",
  "xbox-one":         "Xbox One",
  "xbox-series":      "Xbox Series X/S",
  switch:             "Switch",
  "switch-2":         "Switch 2",
  "evercade-handheld":"Evercade",
  "":                 "Multi",
};

/** Categorías que no están ligadas a ninguna plataforma de hardware */
const PLATFORM_FREE_CATEGORIES: Category[] = ["figuras", "peliculas"];

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
    const meta = detectProductMeta(title, conditionText);
    results.push({
      selected: true,
      asin,
      title: title.trim(),
      imageUrl,
      price,
      oldPrice,
      category:       meta.category as Category,
      platformFamily: meta.platformFamily as Platform,
      generation:     meta.generation,
      condition:      meta.condition,
    });
  }

  /** Reconstruye URL de Amazon CDN desde la ruta local que guarda el navegador */
  function fixImageUrl(src: string, asin: string): string {
    if (!src || src.includes("placeholder")) return amazonImageUrl(asin);
    // Página guardada localmente: "./ps4_files/51GJnJ4DaOL._SS135_.jpg"
    if (src.startsWith("./") || src.startsWith("../")) {
      const filename = src.split("/").pop() ?? "";
      if (filename) {
        // Aumentar resolución: SS135 → SL300
        const hd = filename.replace(/\._SS\d+_/, "._SL300_").replace(/\._AC_\w+_/, "._SL300_");
        return `https://m.media-amazon.com/images/I/${hd}`;
      }
    }
    // URL ya correcta de Amazon CDN
    if (src.includes("media-amazon.com") || src.includes("ssl-images-amazon.com")) return src;
    return amazonImageUrl(asin);
  }

  /* ══════════════════════════════════════════════════════════
   * Estrategia 1 (PRINCIPAL): listas de Amazon guardadas con Ctrl+S
   * Estructura: <li data-itemid="I…" data-price="39.99"
   *   data-reposition-action-params='{"itemExternalId":"ASIN:B073ZTH4MN|…"}'>
   *   <a id="itemName_I…" title="Nombre del producto" href="/dp/B073ZTH4MN/…">
   *   <img src="./ps4_files/51GJnJ4DaOL._SS135_.jpg">
   *   <span id="itemPrice_I…"><span class="a-offscreen">39,99 €</span>
   * ══════════════════════════════════════════════════════════ */
  doc.querySelectorAll("li[data-itemid]").forEach((li) => {
    // 1. ASIN desde data-reposition-action-params JSON
    const params = li.getAttribute("data-reposition-action-params") ?? "";
    const asinFromParams = params.match(/"itemExternalId"\s*:\s*"ASIN:([A-Z0-9]{10})/)?.[1] ?? "";

    // 2. Enlace del producto (contiene título y ASIN en href)
    const nameLink = li.querySelector("a[id^='itemName_']") as HTMLAnchorElement | null;
    const title = nameLink?.getAttribute("title")?.trim() ?? "";
    const hrefAsin = (nameLink?.getAttribute("href") ?? "").match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? "";

    const asin = asinFromParams || hrefAsin;
    if (!asin) return;

    // 3. Precio: primero data-price del <li>, luego span.a-offscreen
    const dataPrice = parseFloat(li.getAttribute("data-price") ?? "");
    const offscreenText = li.querySelector(`[id^='itemPrice_'] .a-offscreen`)?.textContent?.trim() ?? "";
    const price = (!isNaN(dataPrice) && dataPrice > 0)
      ? dataPrice
      : parsePrice(offscreenText);

    // 4. Precio anterior (tachado)
    const oldPriceText = li.querySelector(".a-text-strike, .a-price.a-text-strike .a-offscreen")?.textContent?.trim() ?? "";
    const oldPrice = parsePrice(oldPriceText);

    // 5. Imagen (puede ser ruta local tras Ctrl+S → reconstruir CDN)
    const imgEl = li.querySelector("img") as HTMLImageElement | null;
    const rawSrc = imgEl?.getAttribute("src") ?? "";
    const imageUrl = fixImageUrl(rawSrc, asin);

    // 6. Condición
    const conditionText = li.querySelector(".a-color-secondary, [id^='item-condition-']")?.textContent?.trim() ?? "";

    addItem(asin, title, imageUrl, price, oldPrice, conditionText);
  });

  if (results.length > 0) return results;

  /* ══════════════════════════════════════════════════════════
   * Estrategia 2: elementos [data-asin] (resultados de búsqueda, etc.)
   * ══════════════════════════════════════════════════════════ */
  doc.querySelectorAll("[data-asin]").forEach((el) => {
    const asin = el.getAttribute("data-asin")?.trim() ?? "";
    if (!asin) return;

    const title =
      el.querySelector("a[id^='itemName_']")?.getAttribute("title")?.trim() ??
      el.querySelector(".g-itemname, h2 a span, .a-size-base-plus")?.textContent?.trim() ??
      el.querySelector("a[title]")?.getAttribute("title")?.trim() ??
      "";

    const imgEl = el.querySelector("img") as HTMLImageElement | null;
    const rawSrc = imgEl?.getAttribute("src") ?? "";
    const imageUrl = fixImageUrl(rawSrc, asin);

    const priceText = el.querySelector(".a-price .a-offscreen, [id^='itemPrice_'] .a-offscreen")?.textContent?.trim() ?? "";
    const price = parsePrice(priceText);
    const oldPriceText = el.querySelector(".a-text-strike")?.textContent?.trim() ?? "";
    const oldPrice = parsePrice(oldPriceText);
    const conditionText = el.querySelector(".a-color-secondary span, [id^='item-condition-']")?.textContent?.trim() ?? "";

    addItem(asin, title, imageUrl, price, oldPrice, conditionText);
  });

  if (results.length > 0) return results;

  /* ══════════════════════════════════════════════════════════
   * Estrategia 3: enlaces /dp/ASIN (cualquier página de Amazon)
   * ══════════════════════════════════════════════════════════ */
  doc.querySelectorAll("a[href*='/dp/']").forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    const asin = href.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? "";
    if (!asin) return;

    const title =
      link.getAttribute("title")?.trim() ??
      link.textContent?.trim() ??
      "";
    const container = link.closest("li, div[id^='item-'], .s-result-item") ?? link.parentElement;
    const imgEl = container?.querySelector("img") as HTMLImageElement | null;
    const rawSrc = imgEl?.getAttribute("src") ?? "";
    const imageUrl = fixImageUrl(rawSrc, asin);
    const priceText = container?.querySelector(".a-price .a-offscreen")?.textContent?.trim() ?? "";

    addItem(asin, title, imageUrl, parsePrice(priceText), 0);
  });

  return results;
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
            <option value="figuras">Figuras y coleccionables</option>
            <option value="peliculas">Películas y series</option>
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
            <option value="evercade">Evercade</option>
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

  // Enriquecimiento de títulos desde Amazon
  const [enriching, setEnriching]         = useState(false);
  const [enrichProgress, setEnrichProgress] = useState(0);
  const [enrichMsg, setEnrichMsg]         = useState<string | null>(null);

  // Plataforma/generación/categoría/condición por defecto para este lote
  const [defPlatform,   setDefPlatform]   = useState<Platform>("playstation");
  const [defGeneration, setDefGeneration] = useState<string>("ps5");
  const [defCategory,   setDefCategory]   = useState<Category>("videojuegos");
  const [defCondition,  setDefCondition]  = useState<Condition>("nuevo");

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

    // Aplicar los defaults a los campos que no pudieron detectarse
    const withDefaults = extracted.map((item) => ({
      ...item,
      // Plataforma: si quedó como "multi" (no detectada), usar el default del usuario
      platformFamily: item.platformFamily === "multi" ? defPlatform : item.platformFamily,
      generation:     item.platformFamily === "multi" ? defGeneration : item.generation,
      // Categoría: si quedó como "videojuegos" (default), usar el seleccionado
      category:       item.category === "videojuegos" ? defCategory : item.category,
      // Condición: aplicar default solo si el título no menciona nada especial
      condition:      item.condition === "nuevo" ? defCondition : item.condition,
    }));

    setItems(withDefaults);
    setParsed(true);
    setImportResult(null);
  }

  const toggleItem = useCallback((idx: number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, selected: !it.selected } : it)));
  }, []);

  function updateItem(idx: number, patch: Partial<ExtractedItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function handleEnrich() {
    const withoutTitle = items.filter((it) => !it.title?.trim());
    if (!withoutTitle.length || enriching) return;

    setEnriching(true);
    setEnrichMsg(null);
    setEnrichProgress(0);

    const BATCH = 5;
    let enriched = 0;

    for (let i = 0; i < withoutTitle.length; i += BATCH) {
      const batch = withoutTitle.slice(i, i + BATCH);
      try {
        const res = await fetch("/api/admin/enrich-asins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asins: batch.map((it) => it.asin) }),
        });
        const data = await res.json() as {
          results: { asin: string; title: string | null; price: number | null; imageUrl: string | null }[]
        };

        setItems((prev) =>
          prev.map((item) => {
            const found = data.results.find((r) => r.asin === item.asin);
            if (!found?.title) return item;

            enriched++;
            const meta = detectProductMeta(found.title);
            return {
              ...item,
              title:          found.title,
              price:          found.price ?? item.price,
              imageUrl:       found.imageUrl ?? item.imageUrl,
              category:       meta.category as Category,
              platformFamily: (meta.platformFamily !== "multi"
                ? meta.platformFamily
                : item.platformFamily) as Platform,
              generation:     meta.platformFamily !== "multi"
                ? meta.generation
                : item.generation,
              condition:      meta.condition !== "nuevo" ? meta.condition : item.condition,
            };
          }),
        );
      } catch {
        // continuar con el siguiente lote si falla uno
      }
      setEnrichProgress(Math.min(i + BATCH, withoutTitle.length));
    }

    setEnrichMsg(
      enriched > 0
        ? `✅ ${enriched} títulos obtenidos de Amazon`
        : "⚠️ No se pudieron obtener títulos (Amazon puede haber bloqueado temporalmente). Inténtalo de nuevo o edítalos manualmente.",
    );
    setEnriching(false);
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

  const selectCls2 = "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none";

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
          ⚠️ Amazon carga los títulos con JavaScript, por lo que el parser puede no extraerlos. Usa los <strong>valores por defecto</strong> de abajo para asignar la plataforma correcta a todo el lote.
        </p>
      </div>

      {/* Selector de plataforma/categoría/condición por defecto */}
      <div className="rounded-2xl border border-orange-800/50 bg-orange-900/10 p-5">
        <h3 className="mb-3 text-sm font-semibold text-orange-300">
          📂 ¿De qué lista es este lote? — Valores por defecto
        </h3>
        <p className="mb-4 text-xs text-zinc-400">
          Si Amazon no pudo incluir los títulos en el HTML estático, los productos no se auto-clasifican.
          Selecciona aquí la plataforma, categoría y condición de tu lista para que se apliquen a todos los que no puedan detectarse.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className={labelCls}>Categoría</label>
            <select className={`${selectCls2} w-full`} value={defCategory}
              onChange={(e) => {
                const cat = e.target.value as Category;
                setDefCategory(cat);
                // Si la categoría no tiene plataforma, forzar "multi"
                if (PLATFORM_FREE_CATEGORIES.includes(cat)) {
                  setDefPlatform("multi");
                  setDefGeneration("");
                }
              }}>
              <option value="videojuegos">🎮 Videojuegos</option>
              <option value="consolas">🕹️ Consolas</option>
              <option value="accesorios">🎧 Accesorios</option>
              <option value="figuras">🗿 Figuras y coleccionables</option>
              <option value="peliculas">🎬 Películas y series</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Plataforma</label>
            <select className={`${selectCls2} w-full`} value={defPlatform}
              disabled={PLATFORM_FREE_CATEGORIES.includes(defCategory)}
              onChange={(e) => {
                const p = e.target.value as Platform;
                setDefPlatform(p);
                setDefGeneration(GENERATIONS[p][0]);
              }}>
              <option value="playstation">PlayStation</option>
              <option value="xbox">Xbox</option>
              <option value="nintendo">Nintendo</option>
              <option value="evercade">Evercade</option>
              <option value="multi">Multi / Sin plataforma</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Generación</label>
            <select className={`${selectCls2} w-full`} value={defGeneration}
              disabled={PLATFORM_FREE_CATEGORIES.includes(defCategory) || defPlatform === "multi"}
              onChange={(e) => setDefGeneration(e.target.value)}>
              {GENERATIONS[defPlatform].map((g) => (
                <option key={g} value={g}>{PLATFORM_LABELS[g] ?? (g || "—")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Condición</label>
            <select className={`${selectCls2} w-full`} value={defCondition}
              onChange={(e) => setDefCondition(e.target.value as Condition)}>
              <option value="nuevo">Nuevo</option>
              <option value="reacondicionado">Reacondicionado</option>
              <option value="segunda-mano">Segunda mano</option>
            </select>
          </div>
        </div>
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

      {/* Banner de enriquecimiento — aparece cuando hay productos sin título */}
      {parsed && items.some((it) => !it.title?.trim()) && (
        <div className="rounded-xl border border-amber-700/50 bg-amber-900/20 p-4">
          <p className="mb-1 text-sm font-semibold text-amber-300">
            ⚠️ {items.filter((it) => !it.title?.trim()).length} productos sin título
          </p>
          <p className="mb-3 text-xs text-amber-200">
            Amazon carga los títulos con JavaScript. Sin título no se puede auto-detectar
            plataforma, categoría ni condición. Pulsa el botón para obtenerlos directamente
            desde Amazon (tu servidor local los descarga uno a uno).
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleEnrich}
              disabled={enriching}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
            >
              {enriching
                ? `⏳ Obteniendo títulos… ${enrichProgress}/${items.filter((it) => !it.title?.trim()).length}`
                : `🔍 Obtener títulos desde Amazon (${items.filter((it) => !it.title?.trim()).length})`}
            </button>
            {enrichMsg && (
              <span className={`text-sm ${enrichMsg.startsWith("✅") ? "text-emerald-400" : "text-amber-300"}`}>
                {enrichMsg}
              </span>
            )}
          </div>
        </div>
      )}

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
                  <tr key={item.asin + idx} className={
                    item.price === 0
                      ? "bg-zinc-800/20"
                      : item.selected ? "" : "opacity-35"
                  }>
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
                        <option value="evercade">Evercade</option>
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
                        <option value="peliculas">Películas</option>
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
                      {item.price === 0 ? (
                        <span className="text-xs font-medium text-red-400">No disponible</span>
                      ) : (
                        <input className={`${miniSelect} w-full`} type="number" step="0.01" min="0"
                          value={item.price || ""} placeholder="0.00"
                          onChange={(e) => updateItem(idx, { price: parseFloat(e.target.value) || 0 })} />
                      )}
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

  const [clearing, setClearing]         = useState(false);

  async function handleClearAll() {
    if (!confirm(`¿Vaciar el catálogo completo? Se eliminarán los ${products.length} productos. Esta acción no se puede deshacer.`)) return;
    setClearing(true);
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clearAll: true }),
    });
    const data = await res.json();
    if (res.ok) {
      onRefresh();
    } else {
      alert(`Error: ${data.error}`);
    }
    setClearing(false);
  }

  // Reasignación en lote
  const [showBulk, setShowBulk]         = useState(false);
  const [bulkFilter, setBulkFilter]     = useState<string>("multi"); // plataforma origen a filtrar
  const [bulkPlatform, setBulkPlatform] = useState<Platform>("playstation");
  const [bulkGen, setBulkGen]           = useState<string>("ps5");
  const [bulkCat, setBulkCat]           = useState<string>("");     // "" = no cambiar
  const [bulkCond, setBulkCond]         = useState<string>("");     // "" = no cambiar
  const [bulking, setBulking]           = useState(false);
  const [bulkMsg, setBulkMsg]           = useState<string | null>(null);

  const selectCls3 = "rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none";

  // Estadísticas de plataformas en el catálogo actual
  const platformStats = products.reduce<Record<string, number>>((acc, p) => {
    const pf = String(p.platformFamily ?? "multi");
    acc[pf] = (acc[pf] ?? 0) + 1;
    return acc;
  }, {});

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

  async function handleBulkUpdate() {
    if (!confirm(`¿Reasignar todos los productos con plataforma "${bulkFilter}" a ${PLATFORM_LABELS[bulkGen] ?? bulkPlatform}?`)) return;
    setBulking(true);
    setBulkMsg(null);

    const platLabel = PLATFORM_LABELS[bulkGen] ?? bulkPlatform;
    const update: Record<string, unknown> = {
      platformFamily: bulkPlatform,
      generation:     bulkGen || null,
      platformLabel:  platLabel,
    };
    if (bulkCat)  update.category  = bulkCat;
    if (bulkCond) update.condition = bulkCond;

    const res = await fetch("/api/admin/bulk-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter: { platformFamily: bulkFilter }, update }),
    });
    const data = await res.json();
    if (res.ok) {
      setBulkMsg(`✅ ${data.changed} productos reasignados a ${platLabel}`);
      onRefresh();
    } else {
      setBulkMsg(`❌ Error: ${data.error}`);
    }
    setBulking(false);
  }

  return (
    <div>
      {/* Estadísticas de plataformas */}
      {products.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(platformStats).map(([pf, count]) => (
            <span key={pf} className={`rounded-full px-3 py-1 text-xs font-medium ${
              pf === "multi"        ? "bg-zinc-700 text-zinc-300" :
              pf === "playstation"  ? "bg-blue-900/60 text-blue-300" :
              pf === "xbox"         ? "bg-green-900/60 text-green-300" :
                                      "bg-red-900/60 text-red-300"
            }`}>
              {pf}: {count}
            </span>
          ))}
          {(platformStats["multi"] ?? 0) > 0 && (
            <span className="rounded-full bg-amber-900/50 px-3 py-1 text-xs font-medium text-amber-300">
              ⚠️ {platformStats["multi"]} sin plataforma asignada
            </span>
          )}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input className={`${inputCls} min-w-0 flex-1`} placeholder="Buscar por título…"
          value={q} onChange={(e) => setQ(e.target.value)} />
        <button
          onClick={() => setShowBulk((v) => !v)}
          className="shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-300 hover:border-orange-500 hover:text-orange-400"
        >
          🔧 Reasignar en lote
        </button>
        <button
          onClick={handleRedetect}
          disabled={redetecting || products.length === 0}
          title="Re-aplica detección de categoría y condición (nunca sobreescribe plataforma ya asignada)"
          className="shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-300 hover:border-orange-500 hover:text-orange-400 disabled:opacity-40"
        >
          {redetecting ? "Analizando…" : "🔄 Re-detectar"}
        </button>
        <button
          onClick={handleClearAll}
          disabled={clearing || products.length === 0}
          title="Elimina todos los productos del catálogo"
          className="shrink-0 rounded-lg border border-red-800 px-4 py-2 text-xs text-red-400 hover:border-red-500 hover:bg-red-900/20 hover:text-red-300 disabled:opacity-40"
        >
          {clearing ? "Vaciando…" : "🗑️ Vaciar catálogo"}
        </button>
      </div>

      {redetectMsg && (
        <p className="mb-3 rounded-lg bg-zinc-800 px-4 py-2 text-xs text-emerald-400">{redetectMsg}</p>
      )}

      {/* Panel de reasignación en lote */}
      {showBulk && (
        <div className="mb-5 rounded-2xl border border-orange-800/50 bg-orange-900/10 p-5">
          <h3 className="mb-2 text-sm font-semibold text-orange-300">🔧 Reasignación en lote</h3>
          <p className="mb-4 text-xs text-zinc-400">
            Selecciona qué productos cambiar (por plataforma actual) y a qué plataforma/generación moverlos.
            Útil para recuperar productos que quedaron como &quot;multi&quot; tras el redetect.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div>
              <label className={labelCls}>Filtrar por plataforma actual</label>
              <select className={`${selectCls3} w-full`} value={bulkFilter}
                onChange={(e) => setBulkFilter(e.target.value)}>
                <option value="multi">multi (sin asignar)</option>
                <option value="playstation">PlayStation</option>
                <option value="xbox">Xbox</option>
                <option value="nintendo">Nintendo</option>
                <option value="evercade">Evercade</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Nueva plataforma</label>
              <select className={`${selectCls3} w-full`} value={bulkPlatform}
                onChange={(e) => {
                  const p = e.target.value as Platform;
                  setBulkPlatform(p);
                  setBulkGen(GENERATIONS[p][0]);
                }}>
                <option value="playstation">PlayStation</option>
                <option value="xbox">Xbox</option>
                <option value="nintendo">Nintendo</option>
                <option value="evercade">Evercade</option>
                <option value="multi">Multi</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Nueva generación</label>
              <select className={`${selectCls3} w-full`} value={bulkGen}
                onChange={(e) => setBulkGen(e.target.value)}>
                {GENERATIONS[bulkPlatform].map((g) => (
                  <option key={g} value={g}>{PLATFORM_LABELS[g] ?? (g || "—")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Categoría (opcional)</label>
              <select className={`${selectCls3} w-full`} value={bulkCat}
                onChange={(e) => setBulkCat(e.target.value)}>
                <option value="">— No cambiar —</option>
                <option value="videojuegos">Videojuegos</option>
                <option value="consolas">Consolas</option>
                <option value="accesorios">Accesorios</option>
                <option value="figuras">Figuras</option>
                <option value="peliculas">Películas</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Condición (opcional)</label>
              <select className={`${selectCls3} w-full`} value={bulkCond}
                onChange={(e) => setBulkCond(e.target.value)}>
                <option value="">— No cambiar —</option>
                <option value="nuevo">Nuevo</option>
                <option value="reacondicionado">Reacondicionado</option>
                <option value="segunda-mano">Segunda mano</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handleBulkUpdate} disabled={bulking}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50">
              {bulking ? "Aplicando…" : `Aplicar a todos los "${bulkFilter}"`}
            </button>
            {bulkMsg && <span className="text-sm text-emerald-400">{bulkMsg}</span>}
          </div>
        </div>
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
        <Link href="/" className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400">
          Volver a la web
        </Link>
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

  async function refreshProducts() {
    const d = await fetch("/api/admin/catalog").then((r) => r.json());
    setProducts(d.products ?? []);
  }

  useEffect(() => {
    if (isProduction) return;
    const loadProducts = async () => {
      const d = await fetch("/api/admin/catalog").then((r) => r.json());
      setProducts(d.products ?? []);
    };
    void loadProducts();
  }, [isProduction]);

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

  const tabBtn = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition ${
      tab === t
        ? "bg-orange-500 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }`;

  if (isProduction) return <ProductionBlock />;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Cabecera */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-amber-400">chollo</span>web.es — Admin
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
          <button className={tabBtn("import")}
            onClick={() => { setTab("import"); setEditingProd(undefined); }}>
            📥 Importar lista Amazon
          </button>
          <button className={tabBtn("add")}
            onClick={() => setTab("add")}>
            {editingProd ? "✏️ Editar producto" : "➕ Añadir producto"}
          </button>
          <button className={tabBtn("catalog")}
            onClick={() => { setTab("catalog"); setEditingProd(undefined); }}>
            📋 Catálogo ({products.length})
          </button>
        </div>

        {/* Contenido de pestaña */}
        {tab === "add"     && <TabAddProduct key={editingProd?.id ?? "new"} initial={editingProd} onSaved={handleSaved} />}
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
