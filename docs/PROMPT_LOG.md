# EduTrack — AI-Assisted Development Prompt Log

This document records the **user's requests in the ChatGPT development conversation** that informed the EduTrack HCI frontend. Quoted prompts are reproduced from the conversation as written, including original spelling. The notes describe the corresponding work or decisions; they are **not** hidden system instructions or a full export of the chat.

## Frontend Development Requests

| No. | User prompt | Result / purpose |
| --- | --- | --- |
| 1 | “I need yout to code these figma design. I just need the UI itself and no need for backend stuff since this is for a Human Computer Interaction subject” | Create a frontend-only UI prototype from the original 28-screen EduTrack design, with simulated student and staff workflows. |
| 2 | “Alright done. Next I wanna add some animation or even just a ui framework to add some effects for the UI, would you be able to add that?” | Add subtle transitions and micro-interactions to cards, buttons, navigation, forms, progress indicators and dialogs. |
| 3 | “I just noticed the code base is just the index and the app.js can you tell me the reason for that?” | Review the original vanilla-JavaScript structure and consider a more maintainable component-based architecture. |
| 4 | “Yeah, Let's migrate to React + Vite. Also please organize the readme and make it simpler.” | Migrate to React + Vite, organize pages/components/context/mock data and simplify project documentation. |
| 5 | “here's our new and updated UI” | Apply the revised 28-screen design, including navy-and-white branding, updated login/recovery pages, student pages and staff dashboard styling. |
| 6 | “based from the history of this chat, can you add these to the readme of the codebase: - **Git Repository Link** (containing the project files and documentation of the prompts used)” | Add a repository-link section to the README and create this prompt documentation file. |

## Repository and Deployment Assistance

These related prompts guided setup and troubleshooting rather than introducing new application features:

| User prompt | Assistance provided |
| --- | --- |
| “I need it to be from vscode” | Guidance on publishing and pushing the project from VS Code using Git. |
| “done, how do I push it to the repo” | Steps for committing and pushing to the existing GitHub repository. |
| “got these errors after pushing to github” | Diagnosis of a GitHub Pages configuration failure after a successful Vite build, with instructions to enable GitHub Actions deployment. |

## Design References and Limitations

- The original and revised **EduTrack — Lagonoy High School Inc.** design PDFs were supplied in the conversation and informed the interface.
- The application is a demonstration prototype. Accounts, evaluation responses, approvals and statistics are simulated; browser storage is not a production backend.
- The exact GitHub repository URL was not included in the conversation history available for this update. Replace the placeholder in `README.md` before submitting the project.
