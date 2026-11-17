# School ERP Deployment Details

This document records where the deployed School ERP services are hosted, which accounts are used to access them, and how to deploy future changes.

## Account access

| Service | Sign-in method / account |
|---|---|
| Neon PostgreSQL | Sign in with Google using the MASHCOD Gmail account. |
| Render | Sign in with GitHub using the `anand7079` GitHub account. |
| Vercel | Sign in with GitHub using the `anand7079` GitHub account. |

Never add account passwords, database passwords, or secret tokens to this document or to Git. Store service credentials in the providers' environment-variable settings.

## Current deployment

| Component | Provider / URL | Notes |
|---|---|---|
| Frontend | [https://school-erp-demo-zeta.vercel.app](https://school-erp-demo-zeta.vercel.app) | React + TypeScript + Vite in `frontend/app`. |
| Backend | [https://school-erp-demo-pp7c.onrender.com](https://school-erp-demo-pp7c.onrender.com) | Spring Boot API, deployed as a Docker web service. |
| API base URL | `https://school-erp-demo-pp7c.onrender.com/api/v1` | Configured in Vercel as `VITE_API_BASE_URL`. |
| Database | Neon PostgreSQL, database `school_erp_demo` | Backend database credentials are configured in Render. Flyway manages schema migrations. |

The backend's `CORS_ALLOWED_ORIGINS` value must match the frontend's origin exactly:

```text
https://school-erp-demo-zeta.vercel.app
```

Do not add a trailing slash or a path to this CORS value.

## Initial deployment configuration

### Neon PostgreSQL

1. Sign in to Neon with Google using the MASHCOD Gmail account.
2. Open the School ERP Neon project and select the `school_erp_demo` database.
3. Use Neon's Connect panel to view its connection settings. For the Spring Boot service, use the direct (unpooled) connection where available; the app runs Flyway migrations at startup.
4. Keep the Neon username, password, and connection string private. The password is entered in Render, not in Git or Vercel.

### Render backend

1. Sign in to Render with GitHub using the `anand7079` account.
2. Open the `school-erp-demo` web service connected to the GitHub repository.
3. Confirm the service uses the repository root `Dockerfile` and Docker runtime. The Dockerfile builds with Java 25 and serves on Render's `PORT` (default `8080`).
4. In the service's **Environment** settings, configure:

   | Variable | Value |
   |---|---|
   | `SPRING_DATASOURCE_URL` | JDBC-form Neon URL, e.g. `jdbc:postgresql://<direct-neon-host>:5432/school_erp_demo?sslmode=require` |
   | `SPRING_DATASOURCE_USERNAME` | Neon database role, currently `neondb_owner` |
   | `SPRING_DATASOURCE_PASSWORD` | Current Neon role password; enter in Render's secret field only |
   | `CORS_ALLOWED_ORIGINS` | `https://school-erp-demo-zeta.vercel.app` |

   For the JDBC URL, start with the direct connection details shown by Neon and change the `postgresql://` scheme to `jdbc:postgresql://`. Keep `sslmode=require`. If the existing deployed connection is healthy, avoid changing it without a reason.

5. Save environment changes and trigger a deploy/redeploy if Render does not start one automatically.
6. Follow **Events** and **Logs** until the service is live and Spring Boot reports successful startup. On the first connection, Flyway applies the migrations to Neon.

### Vercel frontend

1. Sign in to Vercel with GitHub using the `anand7079` account.
2. Import the School ERP repository as a project.
3. Set **Root Directory** to `frontend/app` and use these build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | Vite |
   | Install command | `npm install` |
   | Build command | `npm run build` |
   | Output directory | `dist` |

4. In **Environment Variables**, set `VITE_API_BASE_URL` to:

   ```text
   https://school-erp-demo-pp7c.onrender.com/api/v1
   ```

   Apply it to Production. Add Preview too if preview deployments should call the production backend.

5. Deploy and open the Vercel URL. The Vercel domain must be listed in Render's `CORS_ALLOWED_ORIGINS` for browser API requests to succeed.

## Deploying future changes

The Render and Vercel projects are linked to the GitHub repository. A push to their configured deployment branch (usually `main`) normally triggers a new deployment automatically.

### Backend changes

1. Make and review the backend changes locally.
2. If the database schema needs changes, add a new Flyway migration under `src/main/resources/db/migration`. Do not edit a migration that has already run in production; add the next migration instead.
3. Commit and push the changes to the deployment branch in GitHub.
4. In Render, open the backend service's **Events** or **Deploys** page and watch the build, deploy, and startup logs.
5. Confirm the service is live and check an API endpoint, for example `https://school-erp-demo-pp7c.onrender.com/api/v1/schools`.

If automatic deployment is disabled, use **Manual Deploy → Deploy latest commit** in Render. If only an environment variable changed, save it in **Environment** and manually deploy if Render does not redeploy automatically.

### Frontend changes

1. Make and review the frontend changes locally. To check the production build, run `npm run build` from `frontend/app`.
2. Commit and push the changes to the Vercel project's deployment branch.
3. In Vercel, open **Deployments** and watch the new build until it is marked Ready.
4. Open the production site and confirm the UI and API data work.

If automatic deployment is disabled, use **Deployments → Create Deployment** or redeploy the latest deployment in Vercel. Vite variables are read during build, so after changing `VITE_API_BASE_URL` under **Settings → Environment Variables**, redeploy the frontend.

### Database or CORS setting changes

- Change Neon database credentials/URL only in Render's **Environment** settings, then redeploy the backend and review its logs.
- When the Vercel domain changes, update Render's `CORS_ALLOWED_ORIGINS` to the new origin exactly (scheme and hostname, no path or trailing slash), save, then redeploy the backend.
- Do not put Neon credentials in Vercel. The browser frontend needs only the public API base URL.
- Back up production data before any schema or data operation that could remove or rewrite it.

## Local build and run reminders

From the repository root, start the frontend with:

```powershell
Set-Location .\frontend\app
npm run dev
```

The local Vite URL is usually `http://localhost:5173`. For local backend development, `application.properties` retains localhost PostgreSQL defaults; production database values are supplied to Render as environment variables.
