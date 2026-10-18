# OS Quiz

Practice quizzes for the Operating Systems course (Midterm 1, chapters 1–5).
A static site: all progress is stored in the visitor's browser (localStorage).

**Live:** https://obaicodes.github.io/os-quiz/

## Repository layout

| Path | Contents |
|---|---|
| `web/` | The website (Svelte 5 + TypeScript + Vite) |
| `data/bank/` | The question bank used by the site (`ch1.json` … `ch5.json`) |
| `data/syllabus/`, `data/leaks/` | Syllabus scope and the extracted past-exam questions |
| `tools/` | Python scripts that build and validate the question bank |
| `docs/SYSTEM_DESIGN.md` | System design |
| `PROJECT_REQUIREMENTS.md` | Requirements (Arabic) |

## Development

```bash
cd web
npm install
npm run dev          # local dev server
npm run check        # type check
npm run lint
npm test             # unit tests (Vitest)
npm run test:e2e     # browser tests (Playwright)
npm run build        # production build in web/dist
npm run bank:check   # validate the question bank
```

## Deployment

GitHub Pages, built by `.github/workflows/deploy.yml` on every push to `main`
(validates the bank, type-checks, runs unit tests, builds `web/dist`).

First publish (creates the public repo, enables Pages, pushes):

```bash
sudo dnf install gh
bash tools/publish.sh
```
