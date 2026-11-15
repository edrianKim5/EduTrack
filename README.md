# EduTrack — HCI Frontend

A frontend-only student evaluation prototype for **Lagonoy High School**, based on our HCI Figma designs.

## Run locally

1. Open this folder in **VS Code**.
2. Open the terminal and run:

   ```bash
   npm install
   npm run dev
   ```

3. Open the local URL shown in the terminal (usually **http://localhost:5173**).

## Demo

- Select **Student** or **Staff** on the sign-in screen.
- The login fields are prefilled; click **Sign in**.
- Student: rate teachers and facilities, save drafts, submit evaluations.
- Staff: release or lock surveys, explore participation and results.
- Drafts and survey changes are saved in your browser's `localStorage`.

**Note:** This is an HCI demo. Login, feedback, and results use sample data. There is no backend or real authentication.

## Project structure

- `src/pages/` — student, staff, and login screens
- `src/components/` — reusable UI components
- `src/context/` — demo state and browser storage
- `src/data/` — mock records and questionnaires
- `src/styles/` — visual design and animations
- `public/assets/` — school logo

## Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`. **GitHub Pages:** Push this folder to the `main` branch, then open **Repository Settings → Pages → Build and deployment → GitHub Actions**. The included workflow builds and publishes the `dist/` folder automatically. The site uses hash-based routing so reloading internal pages works on GitHub Pages.
