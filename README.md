# VAMED Angola HSE Dashboards

Static multi-site HSE dashboard for VAMED Healthcare Projects in Angola.

## Structure

- `index.html` - HMRH Huambo dashboard
- `cabinda/index.html` - HMRC Cabinda dashboard
- `luena/index.html` - HMRL Luena dashboard
- `documentos-abril/` - April 2026 Huambo report files
- `fotos-fossa-resolvida/` - Huambo evidence photos
- `documentos-plano/`, `formularios_docx/`, `formularios_pdf/` - HSE verification plan downloads
- `PROJECT_CONTEXT.md` - project reference notes for future work

## Vercel

This project is pure static HTML/CSS/JS. No build command is required.

Recommended Vercel settings:

- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: `.`
- Install Command: leave empty

After connecting the GitHub repository to Vercel, every push to `main` will deploy automatically.
