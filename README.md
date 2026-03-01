# Construction Company Website

A full-stack web application for a construction company — public-facing site with an admin panel for managing services, projects, messages, and site settings.

**Stack:** React 19 + Vite (frontend) · .NET 10 Web API (backend) · PostgreSQL + Dapper (database) · Docker Compose

---

## Project Structure

```
web/
├── client/          # React + Vite frontend
├── server/          # .NET 10 Web API
├── docker-compose.yml
├── .env             # Secret values (gitignored — you create this)
└── .env.example     # Template to copy from
```

---

## Quick Start (Docker — recommended)

The easiest way to run the full stack with a single command.

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone the repository

```bash
git clone <repo-url>
cd web
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
POSTGRES_USER=tikinti
POSTGRES_PASSWORD=your_db_password_here
POSTGRES_DB=tikinti_db

CONNECTION_STRING=Host=localhost;Port=5432;Database=tikinti_db;Username=tikinti;Password=your_db_password_here

JWT_SECRET=your_jwt_secret_min_32_characters_long!
JWT_ISSUER=tikinti-api
JWT_AUDIENCE=tikinti-admin
JWT_EXPIRY_HOURS=24

COMPANY_NAME=Your Company Name

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password_here
```

> Generate a strong JWT secret: `openssl rand -base64 32`

### 3. Start the stack

```bash
docker compose up --build
```

This starts:
- **PostgreSQL** on port `5432` (creates tables and seeds data on first run)
- **API** on port `5000`

The API is available at `http://localhost:5000`.

---

## Running Locally (without Docker)

Use this if you want hot-reload for development.

**Requirements:** [.NET 10 SDK](https://dotnet.microsoft.com/download) · [Node.js 18+](https://nodejs.org/) · PostgreSQL running locally

### Backend

```bash
cd server
```

Set your connection string — either update `appsettings.json` or set the environment variable:

```bash
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=tikinti_db;Username=tikinti;Password=your_password"
export Jwt__Secret="your_jwt_secret_min_32_characters_long!"
export Admin__Password="your_admin_password"
export App__CompanyName="Your Company Name"
```

Then run:

```bash
dotnet run
```

API starts at `http://localhost:5000`.

### Frontend

```bash
cd client
cp .env.example .env   # already set to http://localhost:5000
npm install
npm run dev
```

Site opens at `http://localhost:5173`.

---

## Admin Panel

Navigate to `http://localhost:5173/admin` (or `http://localhost:5000` if serving via Docker with a static build).

Default credentials are set by `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env`. They are only used when the database is empty on first startup.

The admin panel lets you manage:
- **Services** — add, edit, delete, reorder
- **Projects** — portfolio items
- **Messages** — contact form submissions
- **Site Settings** — company name, about text, hero content, contact info, social links

---

## Environment Variables Reference

### Root `.env`

| Variable | Description |
|---|---|
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | Database name |
| `CONNECTION_STRING` | Full connection string for local development (not used by Docker) |
| `JWT_SECRET` | JWT signing secret — must be at least 32 characters |
| `JWT_ISSUER` | JWT issuer claim |
| `JWT_AUDIENCE` | JWT audience claim |
| `JWT_EXPIRY_HOURS` | Token expiry in hours |
| `COMPANY_NAME` | Company name shown on the site |
| `ADMIN_USERNAME` | Initial admin username (first startup only) |
| `ADMIN_PASSWORD` | Initial admin password (first startup only) |

### `client/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | API base URL used by the frontend |

---

## Useful Commands

```bash
# Start in background
docker compose up -d --build

# Stop
docker compose down

# Stop and delete database volume (full reset)
docker compose down -v

# View API logs
docker compose logs -f api

# Rebuild only the API image
docker compose up --build api
```
