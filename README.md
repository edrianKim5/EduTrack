# EduTrack — HCI Frontend Prototype

Frontend-only recreation of **EduTrack / Lagonoy High School**, based on the supplied Figma PDF (student and staff portals).

## How to open

**Simplest:** Open `index.html` in Chrome, Edge, or Firefox. No installation required.

**Optional local server (recommended for classroom demonstration):**

```bash
python -m http.server 8000
```

Then visit **http://localhost:8000**.

## Demo credentials

The login screen is prefilled. Just press **Sign in**. Any nonempty input works, because there is no real authentication system. Use the **Student** and **Staff** tabs to explore both portals.

## Included screens and interactive elements

### Student portal
- Student/staff login switch, password visibility, and forgot-password request with confirmation modal
- Academic evaluation dashboard with active, pending, and locked module cards
- Teacher/facility lists with progress summaries, search and status filters
- Multi-step rating evaluation forms (1–5), progress bars, optional comments
- Save draft and exit, return to drafts, required-answer check, submission confirmation
- Completed response (read-only) pages

### Staff portal
- Dashboard: participation chart, response metrics, watchlist, activity, pending approvals
- Survey release manager: live/locked toggles with confirmation dialogs; availability updates the student dashboard
- Results overview table and detailed results screens
- Criteria charts, response distribution, sample anonymous student feedback, unavailable-results states

## UI animations and micro-interactions (v2)

The project now includes a lightweight **CSS motion system** in `styles.css`, with a small route-change hook in `app.js`. There is **no React, Tailwind, Bootstrap, npm, or external CDN** to configure. It works as before by opening `index.html`, with Live Server, or on GitHub Pages.

Effects added:
- Soft page entrances and staggered dashboard cards when navigating
- Buttons lift on hover and compress slightly on click
- Teacher/facility cards, tables, side navigation and filter tabs react to hover
- 1–5 evaluation ratings have quick selection feedback
- Progress bars and staff dashboard bars animate on page navigation
- Confirmation dialogs use a fade/scale entrance; success indicators pop
- Toast messages slide in gently
- Input focus is visually clearer
- **Accessibility:** `prefers-reduced-motion` disables these animations automatically

All sample data, workflows, GitHub Pages compatibility, and localStorage behavior remain unchanged. You can adjust motion duration in the `--motion-*` variables at the end of `styles.css`.

## Important: no backend

All students, staff names, statistics, questions, status labels and responses are **illustrative static demo data** taken from the supplied UI designs. Login doesn't verify identity. Password reset doesn't email anyone. Submission doesn't send data to the school. The staff release toggles change the displayed mock UI (including the student dashboard), not any real school system. The source design does not include questionnaire screens for class advisers or general staff, so the prototype shows a descriptive placeholder if they are released.

Evaluation drafts, submitted demo responses and survey release switches are stored using **browser localStorage** so the UI stays interactive after refreshing. This is **not a database** and is not a private or secure data store.

To restore the original sample data, open the browser's Developer Tools → Console and run:

```js
EduTrackDemo.reset()
```

## Files

- `index.html` — application entry point
- `styles.css` — desktop/mobile responsive styles and design system
- `app.js` — sample data, navigation, state and interactions
- `assets/lagonoy-logo.png` — school logo extracted from the provided design
- `preview/` — captured examples from the local implementation (if included)

The desktop design follows the provided PDF's navy, gold and light-gray visual style. Layouts also adapt to tablet and phone screens for usability testing.
