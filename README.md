# GIFS App

Buscador de GIFs por palabra o etiqueta, con historial local y visor a pantalla completa. Reescrita en **Angular 22** (standalone + signals) sobre la API de Giphy.

**Demo:** https://leandrocarlino.github.io/gifsApp/

## La API key

La versión original tenía una key de Giphy **hardcodeada** en el servicio, en un repo público. Ahora:

- `public/config.json` está **ignorado por git** y se lee en runtime (no en el bundle).
- `public/config.example.json` es la plantilla que sí se commitea.
- En GitHub Actions, el workflow escribe `config.json` desde el secret **`GIPHY_API_KEY`** antes de compilar.
- Si falta la key, la app lo dice en pantalla en vez de romperse.

**Aviso honesto:** en una app 100 % estática la key igual viaja al navegador (se ve en la pestaña Network). Sacarla del repo evita que quede indexada en GitHub y permite rotarla sin tocar código, pero **no la vuelve secreta**. Para eso haría falta un proxy del lado del servidor.

### Configurarla en local

```bash
cp public/config.example.json public/config.json
# editá config.json y pegá tu key de https://dashboard.giphy.com
npm install
npm start
```

### Configurarla en el deploy

En GitHub → *Settings → Secrets and variables → Actions* → **New repository secret**:

```
GIPHY_API_KEY = tu_key
```

## Qué cambió

| | Antes | Ahora |
|---|---|---|
| Framework | Angular 13 (sin soporte, no compila en Node 24) | **Angular 22**, standalone + signals |
| Key | hardcodeada en `gifs.service.ts` | `config.json` ignorado + secret de Actions |
| Estado | `subscribe` dentro del servicio, sin manejo de error | signals + estados de carga, error y vacío |
| Entrada | `@ViewChild` + `nativeElement` | `input()` + query param `?q=` (URLs compartibles) |
| Búsquedas | solo con Enter | Enter, tags y clic en el historial |
| Historial | se guardaba, sin deduplicar por caso | deduplicado, máximo 8, con botón para limpiar |
| UI | Bootstrap + animate.css por CDN | CSS propio, grilla masonry, esqueletos de carga y visor `<dialog>` |
| Tests | spec por defecto | **8 tests** con `HttpTestingController` |

## Características

- Búsqueda por texto o etiqueta, con `?q=` en la URL: podés compartir el resultado.
- Historial persistente en `localStorage`, sin repetidos.
- Visor a pantalla completa con flechas ←/→ y enlace a Giphy.
- Esqueletos mientras carga, mensajes de error claros y estado vacío.
- Accesibilidad: skip link, `aria-live`, `aria-busy`, foco visible y botones reales (antes eran `href="#"`).
- Lighthouse: accesibilidad, buenas prácticas y SEO en 100.

## Estructura

```
src/app/
├── app.ts · app.html · app.css        # shell
├── app.config.ts                      # router + HttpClient
├── app.routes.ts
├── core/
│   ├── gif.ts                         # tipos y etiquetas
│   ├── config.service.ts              # config.json en runtime
│   ├── gifs.service.ts                # búsqueda + historial con signals
│   └── gifs.service.spec.ts           # 6 tests del servicio
└── pages/inicio/                      # buscador, resultados e historial
```

## Correr

```bash
npm install
npm start        # http://localhost:4200
npm test         # 8 tests
npm run build
```

## Créditos

GIFs servidos por [Giphy](https://giphy.com). La app usa su API pública de búsqueda.
