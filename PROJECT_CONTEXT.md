# PROJECT CONTEXT — Multi-site HSE Dashboard

This document captures the working project brief for future reference. It describes the multi-site HSE dashboard architecture, files, technology stack, and site-specific details.

_Last updated: 2026-05-07._

---

## Project Summary

This project is a multi-site HSE (Health, Safety & Environment) Dashboard for **VAMED Healthcare Projects in Angola**. It is a static HTML website with no build tools, frameworks, or package manager — just three self-contained HTML files, each representing a different military hospital construction site.

---

## Project Structure

```text
/
  index.html              — HMRH (Hospital Militar Regional do Huambo) dashboard (~1,432 lines)
  cabinda/index.html      — HMRC (Hospital Militar Regional de Cabinda) dashboard (~1,139 lines)
  luena/index.html        — HMRL (Hospital Militar Regional de Luena) dashboard (~1,310 lines)
```

There is no `package.json`, no CSS/JS build pipeline, no server-side code, and no Netlify Functions. Each HTML file is entirely self-contained with inline `<style>` and `<script>` blocks.

---

## Technology Stack

- **Pure HTML/CSS/JS** — no frameworks, no bundler.
- **Leaflet.js v1.9.4 via CDN** — interactive maps showing each hospital's location in Angola.
- **Chart.js v4.4.0 via CDN** — line, bar, and doughnut charts for workers, training, water consumption, alcohol testing trends, and workforce distribution.
- **Google Fonts**:
  - Huambo: `Orbitron` + `JetBrains Mono`.
  - Cabinda/Luena: `Syne` + `JetBrains Mono`.

---

## Features Per Dashboard

Each page includes:

- Header with site switcher navigation between Huambo, Cabinda, and Luena.
- Month selector buttons.
- Period label.
- Dark/light theme toggle.
- Six KPI cards:
  - Workers.
  - Alcohol Tests.
  - HSE Checklist score.
  - Training Participants.
  - Environmental Incidents.
  - Positive Alcohol results.
- Interactive Leaflet map with a marker for the hospital site and popup details.
- HSE Topics panel with tracked issues and resolved/unresolved status.
- Monthly detail breakdown:
  - Alcohol tests.
  - Accidents.
  - Water/fuel/electricity consumption.
- Three charts per site:
  - Workers trend.
  - Training trend.
  - Resource consumption trend.
- Comparison tables:
  - SST / occupational safety indicators.
  - Environmental resources.
  - Month-over-month variance.
- Workforce section:
  - Workforce KPIs.
  - Doughnut chart of employees by company.
  - Calendar heatmap showing daily presence rates.
  - Company breakdown table.
- HSE Verification Plan:
  - Seven scheduled verification routines, including scaffolding, social facilities, fire extinguishers, first aid, electrical panels, equipment, and HSE checklist.
  - Weekly/monthly cadence.
  - Download buttons.
- Licenses tracker:
  - Nine tracked licenses.
  - Expiration status computed dynamically in JavaScript:
    - More than 60 days: green.
    - 30 to 60 days: yellow.
    - Less than 30 days: red.

---

## Site-specific Details

### Huambo (`/index.html`)

- Site: **HMRH — Hospital Militar Regional do Huambo**.
- Project ref: `13DC - DEI/SV/2021`.
- Active phase with around **207 workers** using April 2026 data.
- Data period: **September 2025 to April 2026**.
- Has a **Documents & Files** section with links to DOCX/PDF reports:
  - Monthly HSE reports.
  - Weekly meeting minutes.
  - Drill/simulacro reports.
- Uses a more elaborate Verification Plan section with month navigation arrows and a content grid layout.
- Fonts: `Orbitron` + `JetBrains Mono`.

### Cabinda (`/cabinda/index.html`)

- Site: **HMRC — Hospital Militar Regional de Cabinda**.
- Project ref: `12DC - DEI/SV/2021`.
- Active phase with around **110 workers** using March 2026 data.
- Data period: **August 2025 to March 2026**.
- Violet/purple accent color theme.
- Fonts: `Syne` + `JetBrains Mono`.

### Luena (`/luena/index.html`)

- Site: **HMRL — Hospital Militar Regional de Luena**.
- Project ref: `14DC - DEI/SV/2021`.
- Final/completion phase with around **8–19 workers**.
- Data period: **August 2025 to March 2026**.
- Lime/green accent color theme.
- Includes a **Sinistralidade / Accident** section with accumulated safety statistics:
  - Frequency index.
  - Gravity index.
- Fonts: `Syne` + `JetBrains Mono`.

---

## JavaScript Functionality

Each page has inline JavaScript that:

- Stores monthly HSE data in a `DATA` object:
  - Workers.
  - Checklist percentage.
  - Alcohol tests.
  - Positive results.
  - Training participants.
  - Environmental incidents.
  - Water consumption.
  - Fuel consumption.
  - Electricity consumption.
- Renders KPI values and month-over-month deltas when the user selects a different month.
- Creates Chart.js charts:
  - Line/bar trend charts.
  - Doughnut workforce charts.
- Builds the SST comparison table dynamically.
- Populates a calendar heatmap showing daily worker presence percentages.
- Initializes a Leaflet map with the hospital location marker.
- Computes license expiration status:
  - `> 60 days` = green.
  - `30–60 days` = yellow.
  - `< 30 days` = red.
- Supports dark/light theme toggling via a CSS class on `<body>`.

---

## Theme Support

All three pages support:

- Dark mode.
- Light / normal mode.

Cabinda and Luena default to dark mode. The theme is toggled via buttons in the header. CSS custom properties control the theme, with extensive light-theme overrides defined in each file.

---

## Maintenance Notes

- Keep the project static unless there is a clear reason to introduce a build pipeline.
- Preserve self-contained HTML files for simple Netlify deployment.
- When adding new months, update:
  - `DATA` object.
  - Month selector labels.
  - Chart labels/datasets.
  - Comparison table logic if needed.
  - Calendar heatmap data.
  - Documents/files section for the relevant site.
- When deploying, verify that all links are relative and that no local `file://` or `/Users/...` paths remain in the deploy HTML.
