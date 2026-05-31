# Westward Travel

A Western Canada girls' trip planner. Answer 8 questions about your group's vibe, budget, and travel style — get back the top 3 destinations from a curated database of attractions across Manitoba, Saskatchewan, Alberta, and British Columbia.

**Live:** https://westwardtravel.vercel.app

---

## What it does

- 8-question quiz covering group size, budget, season, indoor/outdoor preference, energy level, festival interest, vibes, and province preference
- Scores every attraction in a hand-curated database against your answers using a weighted rubric
- Returns the top 3 matches with a percentage score, match reasons, price range, and best season

## Attractions

22 destinations across 4 provinces:

| Province | Highlights |
|---|---|
| Alberta | Banff, Jasper, Calgary Stampede, Kananaskis Spa, Drumheller, Edmonton |
| British Columbia | Whistler, Tofino, Okanagan Wine Country, Victoria, Vancouver, Nelson, Harrison Hot Springs |
| Saskatchewan | Manitou Beach, Saskatoon, Grasslands National Park, Prince Albert National Park |
| Manitoba | Churchill, Winnipeg, Thermëa Spa, Riding Mountain National Park |

## Running locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Deploying

```bash
npm run build
vercel --prod
```

Vercel does not auto-deploy on HTML-only changes — always trigger manually.

## Project structure

```
src/
  App.jsx       # entire app — database, scoring, quiz UI, styles
  main.jsx      # React entry point
index.html      # HTML shell
logs/           # daily dev logs (YYYY-MM-DD.md)
```
