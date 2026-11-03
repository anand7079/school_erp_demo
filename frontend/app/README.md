# School ERP React frontend

Standalone React + TypeScript + Vite app for the School ERP. The Spring Boot backend remains in the repository root.

## Run locally

From this directory:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Current UI

The app includes Overview, Students, Classes & sections, and Fee status screens. Search and class/section filters work locally. Student registration, class creation, and fee-status updates use in-memory sample state, so a refresh restores the sample dataset. Backend API integration is the next step.

The local API base URL is in `.env.local` as `VITE_API_BASE_URL`. It is ready for the API client integration; it is not read by the current prototype UI yet.

## Production build

```powershell
npm run build
```

Vite writes deployable static files to `dist/`. Set `VITE_API_BASE_URL` to the separately deployed backend before building the production frontend.
