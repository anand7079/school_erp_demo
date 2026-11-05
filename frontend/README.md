# School ERP Frontend

The React + TypeScript frontend is in [`app/`](app/). The static visual reference is in [`prototype/`](prototype/).

## Start the frontend

1. Make sure PostgreSQL and the Spring Boot backend are running.
2. Open PowerShell at the repository root and run:

   ```powershell
   Set-Location .\frontend\app
   npm run dev
   ```

3. Keep the terminal open and open the URL printed by Vite, usually [http://localhost:5173/](http://localhost:5173/).

The frontend reads its backend URL from `app/.env.local` (`VITE_API_BASE_URL`). The backend's allowed CORS origins are configured with `CORS_ALLOWED_ORIGINS`; the local default is `http://localhost:5173`.

## Build for deployment

From `frontend/app`, run:

```powershell
npm run build
```

Vite writes the static site to `app/dist/`. Configure `VITE_API_BASE_URL` with the deployed API URL before building the production frontend.
