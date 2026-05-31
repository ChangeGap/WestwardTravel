# Westward Travel — Claude Guidelines

## Project Overview

A React + Vite single-page app that helps groups plan Western Canada girls' trips. Users answer 8 questions and receive scored destination recommendations from a curated database of attractions across MB, SK, AB, and BC.

**Live site:** https://westwardtravel.vercel.app

## Tech Stack

- **React 18** — all UI in `src/App.jsx` (single-file app)
- **Vite** — dev server (`npm run dev`) and build (`npm run build`)
- **Vercel** — production deployment via `vercel --prod`

## Key Files

- `src/App.jsx` — entire app: attraction database, scoring logic, questionnaire, and CSS-in-JS styles
- `index.html` — HTML shell and page title
- `logs/` — daily dev logs (see convention below)

## Conventions

### Daily Dev Log

Create a new log file in `logs/` for every day work is done, named `YYYY-MM-DD.md`. Each log should include:

```markdown
# Dev Log — YYYY-MM-DD

## Tasks
- [ ] thing planned

## Accomplishments
- thing completed

## Learnings
- something discovered or figured out

## Notes
- anything else worth remembering
```

Keep logs factual and terse — they are a running record, not a narrative.

### Code Style

- Single-file architecture: keep all logic and styles in `src/App.jsx` unless a strong reason exists to split
- Inline CSS lives in the `CSS` template literal at the bottom of `App.jsx`
- Attraction objects follow the schema defined at the top of `ATTRACTIONS` (io, energy, festival, budget, seasons, vibes, group)
- No comments unless the WHY is non-obvious

### Deployment

Vercel does **not** auto-deploy on HTML-only changes — always run `vercel --prod` manually after any change.
