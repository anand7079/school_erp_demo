# School ERP React frontend

Standalone React + TypeScript + Vite frontend. The Spring Boot backend remains in the repository root and runs independently.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The backend must also be running at `http://localhost:8080` with its database available.

## Backend connection

The API base URL is configured in `.env.local` as `VITE_API_BASE_URL`. The frontend reads school and branch details, paginated students, classes and sections, fee summary, and unpaid students from the Spring API. Creating a class, creating a section, registering a student, and changing fee status send requests to the backend.

Spring CORS allows `http://localhost:5173` by default. For a separately deployed frontend, set the backend environment variable `CORS_ALLOWED_ORIGINS` to the exact frontend origin (or comma-separated allowed origins), then restart the backend.

## Production build

```powershell
npm run build
```

Vite writes static deployable files to `dist/`. Set `VITE_API_BASE_URL` to the deployed backend URL before building for production. The current backend security configuration is still development-only and allows unauthenticated requests; add authentication and authorization before exposing real student data.
