"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const SIM_GAMES = [
  {
    title: "The Legend of Zelda: Breath of the Wild",
    meta: "Nintendo Switch · PAL ESP",
    desc: "Explora las ruinas de un reino olvidado en esta aclamada aventura de mundo abierto. Encuentra armas, santuarios y derrota a Ganon.",
    badge: "Completo (CIB)",
  },
  {
    title: "Super Mario Odyssey",
    meta: "Nintendo Switch · PAL ESP",
    desc: "Acompaña a Mario en un viaje en 3D alrededor del mundo usando a Cappy para poseer objetos, enemigos y recolectar energilunas.",
    badge: "Completo (CIB)",
  },
  {
    title: "Metal Gear Solid",
    meta: "PlayStation · PAL ESP (Retro)",
    desc: "El legendario juego de sigilo y acción de Hideo Kojima. Controla a Solid Snake e infíltrate en Shadow Moses para neutralizar a FOXHOUND.",
    badge: "Solo Disco",
  },
  {
    title: "Elden Ring",
    meta: "PlayStation 5 · PAL ESP",
    desc: "Álzate, Sinluz, y déjate guiar por la gracia para esgrimir el poder del Círculo de Elden en las Tierras Intermedias.",
    badge: "Completo (CIB)",
  },
];

const REWARDS = [
  {
    price: "5 €",
    title: "Colaborador Digital",
    desc: "Aparecerás inmortalizado para siempre en la pestaña de 'Mecenas' dentro de la propia aplicación móvil.",
    includes: ["Agradecimiento oficial en créditos"],
    image: "/coverlens/logo_app.png",
  },
  {
    price: "15 €",
    title: "Beta Tester VIP",
    desc: "Obtén acceso a las builds de prueba en iOS (TestFlight) y Android (Google Play Beta) meses antes del lanzamiento.",
    includes: ["Acceso Anticipado (Beta)", "Agradecimiento oficial en créditos"],
    image: "/coverlens/scanner_feature.png",
  },
  {
    price: "25 €",
    title: "Mecenas Estético",
    desc: "Desbloquea los temas visuales exclusivos (Retro 16-bits, Ultra Oscuro) e iconos de aplicación personalizados.",
    includes: ["Pack de Temas Premium", "Acceso Anticipado (Beta)", "Agradecimiento oficial en créditos"],
    image: "/coverlens/hero.png",
  },
  {
    price: "50 €",
    title: "Curador VIP",
    desc: "Envíanos fotos de tus juegos más raros PAL/ESP y limpiaremos la carátula para añadirla de forma prioritaria al VPS.",
    includes: ["Curación prioritaria de portadas", "Pack de Temas Premium", "Acceso Anticipado (Beta)", "Agradecimiento oficial en créditos"],
    image: "/coverlens/logo_app.png",
  },
];

export default function CoverLensPage() {
  const [simStatus, setSimStatus] = useState<"idle" | "scanning" | "success">("idle");
  const [simIndex, setSimIndex] = useState(0);
  const [simGame, setSimGame] = useState(SIM_GAMES[0]);

  function startSimulation() {
    if (simStatus === "scanning") return;

    setSimStatus("scanning");

    setTimeout(() => {
      setSimGame(SIM_GAMES[simIndex]);
      setSimStatus("success");
      setSimIndex((prev) => (prev + 1) % SIM_GAMES.length);
    }, 1800);
  }

  return (
    <div className="bg-black text-zinc-100 min-h-screen relative overflow-hidden">
      {/* Glows de fondo */}
      <div className="absolute top-[-100px] right-[-100px] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[200px] left-[-200px] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none" />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-1 text-xs text-zinc-500">
          <Link href="/" className="hover:underline hover:text-zinc-300">Inicio</Link>
          <span>/</span>
          <span className="font-medium text-zinc-300">CoverLens</span>
        </nav>

        {/* Hero Section */}
        <section className="text-center py-12 md:py-20 max-w-4xl mx-auto">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-brand font-semibold uppercase tracking-widest text-primary mb-6 animate-pulse">
            Prototipo 100% Funcional
          </span>
          <h1 className="text-4xl font-brand font-black uppercase tracking-tight sm:text-6xl text-white bg-gradient-to-b from-white via-zinc-200 to-zinc-550 bg-clip-text">
            CoverLens
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-zinc-400 font-light leading-relaxed">
            La app definitiva para coleccionistas de videojuegos físicos. Escanea tus juegos, gestiona metadatos y organiza tus estanterías localmente con carátulas PAL y de formato regional europeo en alta resolución.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://www.kickstarter.com/projects/1141521744/coverlens-video-game-catalog-app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#05ce78] px-8 py-3.5 text-sm font-bold text-black transition hover:bg-[#04b76a] active:scale-95 shadow-[0_4px_20px_rgba(5,206,120,0.3)] flex items-center gap-2"
            >
              💚 Ver en Kickstarter
            </a>
            <a
              href="#rewards"
              className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-95 shadow-[0_4px_20px_rgba(0,127,255,0.4)]"
            >
              Ver Recompensas
            </a>
            <a
              href="#simulator"
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-3.5 text-sm font-bold text-zinc-300 transition hover:border-zinc-700 hover:text-white active:scale-95"
            >
              Probar Demo
            </a>
          </div>

          <div className="mt-16 relative w-full aspect-[21/9] max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d0d0d] shadow-2xl">
            <Image
              src="/coverlens/hero.png"
              alt="CoverLens App Banner"
              fill
              className="object-cover opacity-90"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        </section>

        {/* Simulador Interactivo */}
        <section id="simulator" className="py-16 border-t border-zinc-900">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-black p-6 sm:p-10 shadow-2xl">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              
              {/* Información Simulador */}
              <div className="space-y-6">
                <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary uppercase">
                  Demo Interactiva
                </span>
                <h2 className="text-3xl font-brand font-black uppercase text-white tracking-wide">
                  Prueba el Escaneo en Tiempo Real
                </h2>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Haz clic en el botón inferior para simular cómo CoverLens lee un código de barras físico EAN mediante la cámara de tu móvil, consulta las bases de datos de metadatos y descarga la información en menos de un segundo.
                </p>
                <button
                  type="button"
                  onClick={startSimulation}
                  disabled={simStatus === "scanning"}
                  className="w-full sm:w-auto rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-95 disabled:opacity-50 shadow-[0_4px_15px_rgba(0,127,255,0.3)]"
                >
                  {simStatus === "scanning" ? "Escaneando..." : "Simular Escaneo EAN"}
                </button>
              </div>

              {/* Pantalla Simulada */}
              <div className="flex justify-center">
                <div className="w-[300px] h-[540px] bg-[#0c0c0e] border-[6px] border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col">
                  {/* Status Bar */}
                  <div className="h-9 bg-[#121214] border-b border-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 font-semibold uppercase tracking-wider select-none">
                    🔋 100% · CoverLens Preview
                  </div>

                  {/* Mobile Screen Contents */}
                  <div className="flex-1 p-4 flex flex-col justify-center items-center text-center relative bg-black/40">
                    
                    {/* Barcode scan box */}
                    <div
                      className={`w-[220px] h-[130px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative transition-all duration-300 ${
                        simStatus === "scanning"
                          ? "border-emerald-500 bg-emerald-950/10"
                          : simStatus === "success"
                          ? "border-primary bg-primary/5"
                          : "border-zinc-700 bg-zinc-900/30"
                      }`}
                    >
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                        {simStatus === "scanning"
                          ? "Leyendo código..."
                          : simStatus === "success"
                          ? "¡EAN Detectado!"
                          : "Cámara Lista"}
                      </span>

                      {/* Laser Line */}
                      {simStatus === "scanning" && (
                        <div className="absolute left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_8px_#10b981] top-[20%] animate-[bounce_1.5s_infinite_ease-in-out]" />
                      )}
                    </div>

                    {/* Result Card */}
                    <div
                      className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 mt-6 text-left transition-all duration-500 ${
                        simStatus === "success"
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4 pointer-events-none"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide truncate">
                        {simGame.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-primary mt-1">
                        {simGame.meta}
                      </p>
                      <p className="text-[9px] text-zinc-500 mt-2 leading-relaxed h-[42px] overflow-hidden">
                        {simGame.desc}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-block bg-emerald-950/50 border border-emerald-900/40 text-emerald-450 text-[9px] font-bold px-2 py-0.5 rounded">
                          {simGame.badge}
                        </span>
                        <span className="text-[9px] text-zinc-600">Local DB (SQLite)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Ventajas / Características */}
        <section className="py-16 border-t border-zinc-900">
          <h2 className="text-3xl font-brand font-black uppercase text-center text-white tracking-wide mb-12">
            Diseñado para la <span className="text-primary">Preservación Física</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
                📷
              </div>
              <h3 className="text-lg font-bold text-white">Escáner EAN Ultrarrápido</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Apunta la cámara al código de barras. CoverLens detecta el formato y busca en IGDB y en nuestro servidor propio de forma instantánea.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
                🖼️
              </div>
              <h3 className="text-lg font-bold text-white">Carátulas Regionales PAL</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Olvídate de las carátulas con clasificación americana ESRB. Consigue portadas europeas PEGI limpias y en alta calidad para tu estantería.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
                🔒
              </div>
              <h3 className="text-lg font-bold text-white">Local-First y 100% Privado</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Toda la base de datos se guarda de forma local en tu móvil usando SQLite. Sin anuncios, sin rastreo y sin depender de servidores en la nube.
              </p>
            </div>
          </div>
        </section>

        {/* Tiers de Mecenazgo / Recompensas */}
        <section id="rewards" className="py-16 border-t border-zinc-900">
          <h2 className="text-3xl font-brand font-black uppercase text-center text-white tracking-wide mb-12">
            Elige tus <span className="text-primary">Recompensas</span>
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REWARDS.map((reward) => (
              <div
                key={reward.title}
                className="group rounded-xl border border-zinc-800 bg-[#0d0d0d] p-5 flex flex-col justify-between transition duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_4px_15px_rgba(0,127,255,0.1)] relative overflow-hidden"
              >
                {/* Imagen del Tier */}
                <div>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border border-zinc-900 bg-black/40 mb-4">
                    <Image
                      src={reward.image}
                      alt={reward.title}
                      fill
                      className="object-contain p-2 opacity-80 group-hover:opacity-100 transition-opacity"
                      unoptimized
                    />
                  </div>
                  <span className="text-2xl font-brand font-black text-primary">{reward.price}</span>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-primary transition-colors">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-light">
                    {reward.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-900 flex flex-col justify-end flex-grow">
                  <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Incluye:</h5>
                  <ul className="text-[10px] text-zinc-300 space-y-1 mb-4 flex-grow">
                    {reward.includes.map((inc) => (
                      <li key={inc} className="flex items-center gap-1.5">
                        <span className="text-primary font-bold">✓</span> {inc}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://www.kickstarter.com/projects/1141521744/coverlens-video-game-catalog-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#05ce78]/50 hover:bg-[#05ce78]/10 py-2 text-[10px] font-bold text-white transition active:scale-95"
                  >
                    Obtener Recompensa
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banner Campaña Kickstarter Activa */}
        <section className="py-12 px-6 rounded-2xl border border-[#05ce78]/20 bg-[#05ce78]/5 text-center my-12 space-y-4">
          <span className="inline-block rounded-full bg-[#05ce78]/10 border border-[#05ce78]/20 px-3 py-1 text-xs font-semibold text-[#05ce78] uppercase">
            Campaña Aprobada y Activa
          </span>
          <h3 className="text-2xl font-brand font-black uppercase text-white tracking-wide">
            ¡Ya puedes patrocinar CoverLens en Kickstarter!
          </h3>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
            La campaña de financiación colectiva ya está aprobada y lista para recibir mecenas. Ayúdanos a hacer realidad la aplicación definitiva para coleccionistas de videojuegos físicos.
          </p>
          <div>
            <a
              href="https://www.kickstarter.com/projects/1141521744/coverlens-video-game-catalog-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#05ce78] px-8 py-3.5 text-sm font-bold text-black transition hover:bg-[#04b76a] active:scale-95 shadow-[0_4px_20px_rgba(5,206,120,0.2)]"
            >
              💚 Ir a la Campaña en Kickstarter
            </a>
          </div>
        </section>

        {/* Footer / Patrocinio Cruzado */}
        <section className="py-12 border-t border-zinc-900 text-center space-y-4">
          <h4 className="text-lg font-brand font-bold text-white uppercase tracking-wider">Un proyecto del Ecosistema CholloWeb</h4>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto font-light">
            El catálogo y el motor de búsqueda de portadas de la app móvil están alojados en{" "}
            <a
              href="https://covers.cholloweb.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              covers.cholloweb.es
            </a>
            . Apoya la preservación de videojuegos en formato físico.
          </p>
        </section>

      </main>
    </div>
  );
}
