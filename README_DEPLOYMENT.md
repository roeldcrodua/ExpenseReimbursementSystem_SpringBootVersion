# Deployment TODOs

This guide covers the two main deployment tracks for this project:

- Frontend (Angular) to GitHub Pages
- Backend (Spring Boot, Java 21) to Oracle Cloud

Keep this as your short, actionable checklist with verified commands for PowerShell on Windows.

---

## 1) Frontend → GitHub Pages

Your Angular app lives at:

- `angular-front-end/ers-web-app`

Already prepared in this repo:
- Production base path is set for GitHub Pages in `angular.json` (`baseHref`/`deployUrl`).
- Node engines pinned in `package.json` (Node 16 recommended) and `.nvmrc` set to `16.20.2`.
- CI deploy workflow created at `.github/workflows/gh-pages.yml` (builds with Node 16 and publishes to `gh-pages`).
- Frontend now reads the backend URL from Angular environments (`environment.ts` / `environment.prod.ts`).

### TODO A — Set your production API URL
Edit:

- `angular-front-end/ers-web-app/src/environments/environment.prod.ts`

Set `apiBase` to your public backend (Oracle Cloud) URL, for example:

```ts
export const environment = {
  production: true,
  apiBase: 'https://api.your-domain.com/ers/api'
};
```

Note: Do not leave this as `localhost` or the site will fail on GitHub Pages.

### TODO B — Enable CORS on backend
Allow your GitHub Pages origin in your Spring Boot CORS/security config, e.g.:

- `https://<your-username>.github.io`
- `https://<your-username>.github.io/ExpenseReimbursementSystem_SpringBootVersion/`

### TODO C — Enable GitHub Pages
In your GitHub repo:

- Settings → Pages → Source: “Deploy from a branch”
- Branch: `gh-pages` / root

The provided workflow will publish to `gh-pages` on pushes to `main`.

### Optional — Run locally before CI
From the Angular app folder:

```pwsh
# Use Node 16 (Angular 12 compatible)
nvm install 16.20.2
nvm use 16.20.2
node -v

cd angular-front-end/ers-web-app
npm ci
npm run build
```

This emits `dist/ers-web-app`. The CI will do the same and publish it.

### SPA routing on GitHub Pages
The workflow copies `index.html` to `404.html` so deep links work without server rewrites. Alternatively, consider hash routing in Angular if preferred.

---

## 2) Backend → Oracle Cloud

You have two primary options:

- A) Docker container via OCIR → Compute/OKE
- B) Run the fat JAR on a Compute VM (simplest)

There is a complete guide with both paths here:

- `ORACLE_CLOUD_DEPLOYMENT.md`
- Scripts: `deploy-oracle-cloud.ps1` and `deploy-oracle-cloud.sh`
- Dockerfile: project root `Dockerfile`
- Production config: `src/main/resources/application-prod.properties`

### Option B (simplest) — Run the JAR on a VM
On your local machine, build the JAR:

```pwsh
cd D:\PROJECTS\ExpenseReimbursementSystem_SpringBootVersion
$env:JAVA_HOME = 'C:\\Program Files\\Java\\jdk-21'
$env:Path = "$env:JAVA_HOME\\bin;$env:Path"
.\mvnw.cmd -DskipTests package
```

Copy `target/ers_springboot.jar` to your Oracle VM (SCP/WinSCP). On the VM (with Java 21 installed):

```bash
# Example on Linux VM
java -jar ers_springboot.jar --spring.profiles.active=prod \
  --server.port=8080 \
  --spring.datasource.url=$DATABASE_URL \
  --spring.datasource.username=$DATABASE_USERNAME \
  --spring.datasource.password=$DATABASE_PASSWORD
```

Recommendation: run it as a systemd service and add a reverse proxy (NGINX) + TLS.

### Option A — Docker to OCIR
Build and push image:

```pwsh
cd D:\PROJECTS\ExpenseReimbursementSystem_SpringBootVersion
# Build image (Dockerfile is multi-stage for Java 21)
docker build -t <region-key>.ocir.io/<tenancy-namespace>/<repo>/ers:latest .

# Login to OCIR
# docker login <region-key>.ocir.io  (use auth token)

# Push
docker push <region-key>.ocir.io/<tenancy-namespace>/<repo>/ers:latest
```

Deploy the image on:
- Oracle Kubernetes Engine (OKE), or
- Compute VM running Docker

Pass required environment variables at runtime (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `SERVER_PORT`), or mount an external `application-prod.properties`.

### CORS + URL for the frontend
Ensure the deployed backend allows CORS from your GitHub Pages origin and is accessible over HTTPS. Use that HTTPS URL in `environment.prod.ts`.

---

## Quick verification

- Backend check (from your machine):

```pwsh
curl -s -o NUL -w "%{http_code}" https://api.your-domain.com/ers/api
```

- Frontend: visit your Pages URL:

```
https://<your-username>.github.io/ExpenseReimbursementSystem_SpringBootVersion/
```

If you see 401 on protected endpoints, that’s expected—it confirms the server is reachable. Configure authentication in the frontend as needed.

---

## Troubleshooting

- Angular 12 requires Node 14–16 (Node 16 recommended). Use `nvm use 16.20.2` when building locally.
- If CI fails on peer deps, we already set `--legacy-peer-deps` in the workflow.
- If pages show blank or 404 on deep routes, ensure `404.html` exists or switch to hash routing.
- If frontend can’t reach backend in production, double-check:
  - `environment.prod.ts` has your public URL
  - CORS allows your Pages origin
  - Backend is reachable over HTTPS and correct port
