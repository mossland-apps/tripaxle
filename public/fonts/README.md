# Self-hosted fonts

Both families are SIL Open Font License 1.1 and are served from this origin so
the site does not make a render-blocking request to `fonts.googleapis.com`.

| File | Family | Axes | Subset | Upstream |
|---|---|---|---|---|
| `fraunces-latin.woff2` | Fraunces (variable) | `wght 400–700` | `latin` | https://github.com/undercasetype/Fraunces |
| `inter-latin.woff2` | Inter (variable) | `wght 400–700` | `latin` | https://github.com/rsms/inter |

The files are the `latin` subsets Google Fonts builds from those upstream
projects; the matching `unicode-range` in `src/styles/global.css` lets the
browser fall back to a system face for anything outside that range. Licence
texts are kept alongside the fonts as `Fraunces-OFL.txt` and `Inter-OFL.txt`.
