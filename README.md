# cholloweb.es (nuevo proyecto)

Base inicial del nuevo sitio sin WordPress, creada con Next.js + TypeScript + Tailwind.

## Arranque local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configuración de afiliado

1. Crea un archivo `.env.local` en la raíz del proyecto.
2. Añade tus tags por marketplace:

```bash
NEXT_PUBLIC_AMAZON_TAG_ES=tuusuarioes-21
NEXT_PUBLIC_AMAZON_TAG_IT=tuusuarioit-21
NEXT_PUBLIC_AMAZON_TAG_DE=tuusuariode-21
NEXT_PUBLIC_AMAZON_TAG_UK=tuusuariouk-21
NEXT_PUBLIC_AMAZON_TAG_FR=tuusuariofr-21
```

El sistema añade automáticamente el `tag` correcto según el dominio del enlace (`amazon.es`, `amazon.it`, etc.).

## Estructura inicial

- `src/data/products.json`: catálogo local (fuente actual de datos).
- `src/app/page.tsx`: portada con categorías y grid de ofertas.
- `src/app/api/products/route.ts`: endpoint interno para listar productos.
- `src/app/consolas/*`: landings SEO por consola.
- `src/app/guias/*`: landings SEO por intención long-tail.
- `src/app/ofertas`, `src/app/segunda-mano`, `src/app/reacondicionados`, `src/app/nuevos`, `src/app/destacados`: secciones por estado/tipo de publicación.
- `src/components/site-header.tsx`: menú horizontal principal de navegación.
- `src/app/sitemap.ts` y `src/app/robots.ts`: base técnica SEO.
- `src/components/product-card.tsx`: tarjeta de producto reutilizable.
- `src/lib/products.ts`: lógica de catálogo + helper de afiliación por marketplace.

## Sync local del catálogo (fase JSON)

Para simular el flujo de actualización periódica sin API:

```bash
npm run sync:local
```

Para simular cambios de precio:

```bash
npm run sync:local:simulate
```

El script actualiza `src/data/products.json` y renueva `updatedAt`.

## Sync con Amazon PA-API (cuando tengas acceso)

Script: `scripts/sync-paapi.mjs`

- Incremental por ASIN (recomendado para productos ya cargados):
  - `node scripts/sync-paapi.mjs`
- Regeneración completa por búsquedas:
  - `node scripts/sync-paapi.mjs --mode=search`
- Prueba sin escribir cambios:
  - `node scripts/sync-paapi.mjs --dry-run`

El modo incremental toma los ASIN de `products.json` (campo `id` o URL `/dp/ASIN`) y refresca precio/oldPrice/estado/imagen/título manteniendo categorías y metadatos editoriales.

En **localhost**, pestaña **Admin → Catálogo**, hay botones **Actualizar precios (PA-API)** y **Simular** (llaman a `POST /api/admin/sync-paapi`). En producción ese endpoint no está disponible.

## Uso de la API interna

- Todos los productos: `/api/products`
- Filtrar por categoría: `/api/products?category=videojuegos`
- Buscar por texto: `/api/products?q=ps5`
- Filtro + búsqueda: `/api/products?category=consolas&q=playstation`

## Próximos pasos recomendados

1. Migrar de JSON local a base de datos (`PostgreSQL`) cuando se estabilice el catálogo.
2. Crear panel de administración para curar productos/ofertas.
3. Añadir jobs programados para refresco de precios con API oficial (cuando tengas acceso).
4. Revisar textos legales finales con datos fiscales y contacto reales del titular.
5. Preparar despliegue en Vercel + dominio `cholloweb.es`.

## Publicación rápida (Vercel + Hostinger DNS)

1. Sube el proyecto a GitHub.
2. Entra en Vercel y crea proyecto importando ese repositorio.
3. Configura variables de entorno en Vercel:
   - `NEXT_PUBLIC_AMAZON_TAG_ES`
   - `NEXT_PUBLIC_AMAZON_TAG_IT`
   - `NEXT_PUBLIC_AMAZON_TAG_DE`
   - `NEXT_PUBLIC_AMAZON_TAG_UK`
   - `NEXT_PUBLIC_AMAZON_TAG_FR`
4. Despliega y prueba la URL temporal de Vercel.
5. En Hostinger (DNS del dominio), crea:
   - registro `A` para `@` apuntando a `76.76.21.21`
   - registro `CNAME` para `www` apuntando a `cname.vercel-dns.com`
6. Añade `cholloweb.es` y `www.cholloweb.es` en Vercel Domains y espera propagación.
