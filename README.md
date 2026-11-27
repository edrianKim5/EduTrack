# EduTrack — HCI Frontend Prototype

EduTrack is a student evaluation UI prototype for **Lagonoy High School Inc.**, based on the revised 28-screen design. Built using **React + Vite** with sample data only—no backend, database, or real authentication.

## Git Repository Link

**GitHub repository:** `https://github.com/edrianKim5/EduTrack`


The repository should contain both the **project files** (`src/`, `public/`, `package.json`, and deployment workflow) and the **documentation of prompts used** in [`docs/PROMPT_LOG.md`](docs/PROMPT_LOG.md). Commit and push the new documentation files to include them in the online repository.

## Run Locally

Requires a supported Node.js version for the included Vite release.

```bash
npm install
npm run dev
```

Open the local address displayed by Vite (usually `http://localhost:5173/`).

## Try the Demo

Choose **Student** or **Staff** on the login screen, use the prefilled demo fields, and select **Sign in**. Students can rate teachers and facilities, save drafts, and submit responses. Staff can view the dashboard, release or lock surveys, and explore results. Demo changes are stored in the current browser using `localStorage`.

## Project Structure

- `src/pages/` — authentication, student and staff screens
- `src/components/` — shared UI components
- `src/context/` — demo application state
- `src/data/` — mock evaluation content
- `src/styles/` — styling, animations and revised theme
- `public/assets/` — school seal and EduTrack logo
- `docs/PROMPT_LOG.md` — AI-assisted development prompts and outcomes

## Push Changes to GitHub

From the existing Git-connected EduTrack folder in VS Code:

```bash
git add -A
git commit -m "Document project repository and development prompts"
git push
```

For GitHub Pages, choose **Settings → Pages → GitHub Actions**. The included workflow builds and publishes the Vite project. To check the build locally, run `npm run build`.
