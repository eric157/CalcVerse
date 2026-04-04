# ![CalcVerse Logo](./src/assets/logo.svg) CalcVerse

[![Built with React](https://img.shields.io/badge/Built%20with-React%2018-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/3D-Three.js-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github&logoColor=white)](https://eric157.github.io/CalcVerse/)
[![Live App](https://img.shields.io/badge/Live-App-blueviolet?style=for-the-badge)](https://eric157.github.io/CalcVerse/)

CalcVerse is a real-time mathematical universe engine for interactive graphing, calculus exploration, numerical analysis, and 3D surface investigation.

## Architecture

```mermaid
flowchart LR
  A["Function Input"] --> B["FunctionParser"]
  B --> C["MathEngine"]
  C --> D["Differentiator / Integrator"]
  C --> E["WebWorker Grid Eval"]
  D --> F["2D Plotly Renderer"]
  E --> G["R3F Surface Renderer"]
  D --> H["Error Analytics Plot"]
  I["Zustand Stores"] --> A
  I --> F
  I --> G
  I --> H
```

## Features

- 🚀 Multi-function Plotly 2D graphing with domain controls and derivative hover readouts
- 🔬 Calculus lab with tangent diagnostics and secant-to-tangent limit animation
- 🟦 Integral engine with animated Riemann sums and exact-vs-numerical comparison
- 🌐 3D explorer with worker-driven surfaces, gradient arrows, contours, slicing planes, and cross-section inset chart
- 🎬 Global animation engine (`t`) with play/pause/reset/speed controls
- 📊 Error analytics lab with log-log finite-difference error curves, optimal `h`, and configurable noise/smoothing
- ✨ Neon glow design system, Framer Motion transitions, and keyboard-driven interaction model

## Built-in Examples

- Gaussian Bell: `exp(-x^2)` (2D + derivative)
- Saddle Point: `x^2 - y^2` (3D + gradient)
- Ripple Wave: `sin(sqrt(x^2+y^2)) / sqrt(x^2+y^2)` (3D)
- Traveling Wave: `sin(x - t)` (2D animated)
- Butterfly Curve: `exp(cos(x)) - 2*cos(4x) - sin(x/12)^5` (2D)
- Periodic Gaussian: `sin(x)*exp(-x^2/10)` (2D + integral)

## Local Development

```bash
npm install
npm run dev
```

Optional strict type-check:

```bash
npm run typecheck
```

## GitHub Pages Deployment

```bash
npm run deploy
```

Notes:

- `vite.config.ts` uses `base: '/CalcVerse/'`
- `public/404.html` handles SPA fallback redirection
- `public/CNAME` and `public/.nojekyll` are included
- `postbuild` writes `dist/.nojekyll`

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause animation |
| `R` | Reset animation to `t=0` |
| `G` | Toggle gradient arrows |
| `W` | Toggle wireframe |
| `C` | Toggle contour projection |
| `S` | Toggle slicing plane |
| `D` | Toggle derivative overlay |
| `I` | Toggle integral shading |
| `Tab` | Cycle function inputs |
| `Escape` | Close active panel |
| `Ctrl+Z` | Undo last function edit |
| `Ctrl+Enter` | Add new function |
| `F` | Fullscreen canvas |
| `?` | Show keyboard shortcut modal |

## Screenshots

![CalcVerse Home Placeholder](https://via.placeholder.com/1280x720.png?text=CalcVerse+Home)
![CalcVerse 2D Lab Placeholder](https://via.placeholder.com/1280x720.png?text=CalcVerse+2D+Lab)
![CalcVerse 3D Lab Placeholder](https://via.placeholder.com/1280x720.png?text=CalcVerse+3D+Lab)
![CalcVerse Error Lab Placeholder](https://via.placeholder.com/1280x720.png?text=CalcVerse+Error+Lab)

## License

MIT