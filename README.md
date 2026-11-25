# EduTrack — HCI Prototype

Frontend-only evaluation portal for Lagonoy High School Inc., based on our updated 28-screen UI design. Built with **React + Vite**.

## Run in VS Code

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal (usually `http://localhost:5173`).

## Explore the demo

1. On the login page, select **Student** or **Staff**.
2. Keep the prefilled login details and select **Sign in**.
3. **Student:** open teacher/facility evaluations, choose ratings, save drafts and submit.
4. **Staff:** view the dashboard, release/lock surveys and review results.

This is a UI prototype only. No backend or real authentication. Changes are saved in **this browser** using `localStorage`.

## Project files

- `src/pages/` — login, student and staff screens
- `src/components/` — shared UI elements
- `src/context/` — demo state and browser storage
- `src/data/` — sample teachers, facilities and questions
- `src/styles/` — layouts, animations and updated theme
- `public/assets/` — school seal and EduTrack wordmark

## Publish changes to GitHub

```bash
git add .
git commit -m "Apply updated EduTrack UI design"
git push
```

For GitHub Pages: **Settings → Pages → Source: GitHub Actions**. The included workflow deploys the Vite build after each push to `main`.

## Production build

```bash
npm run build
```

Built files appear in `dist/`.
