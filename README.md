# Paradox (Rails — ruby-rewrite branch)

This branch replaces the Svelte/Bun app with the [Fallout](https://github.com/hackclub/fallout) Rails app, reskinned to match the Paradox event landing (stage/curtain, RSVP, Hack Club auth).

## Local Development Setup

### 1. Prerequisites

- Ruby (see `.ruby-version` or Gemfile)
- Node.js (for Vite and frontend dependencies)
- Bundler (`gem install bundler`)
- PostgreSQL and Redis (e.g. Docker or local)

### 2. Environment

Copy `.env.development.example` to `.env` and set:

- `DATABASE_URL` — PostgreSQL connection URL
- `HCA_CLIENT_ID` / `HCA_CLIENT_SECRET` (or `HACKCLUB_CLIENT_ID` / `HACKCLUB_CLIENT_SECRET`) — Hack Club OAuth. Register redirect URI **`http://localhost:3000/auth/hca/callback`** (or your app origin + `/auth/hca/callback`) at [auth.hackclub.com](https://auth.hackclub.com).
- Optional: `REDIS_URL` (default `redis://localhost:6379/1`) for cache and Solid Queue
- Optional: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID` for RSVP (otherwise RSVP shows “temporarily unavailable”)

### 3. Install dependencies

```sh
bundle install
npm install
```

### 4. Setup credentials (if not already done)

See original Fallout README below for `bin/rails credentials:edit` and `db:encryption:init` if the app prompts for encryption keys.

### 5. Setup the database

```sh
bin/rails db:setup
```

### 6. Start the Rails server

```sh
bin/dev
```

App runs at `http://localhost:3000`. Landing uses Paradox design assets from `public/paradox/`.

---

## Fallout template notes

Original Fallout README:

### 1. Prerequisites

- Ruby (see `.ruby-version` or Gemfile)
- Node.js (for Vite and frontend dependencies)
- Bundler (`gem install bundler`)
- Docker (for running Postgres)

### 2. Start Postgres with Docker

You can spin up a local Postgres instance using Docker:

```sh
docker run -d \
  --name fallout-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=fallout \
  -e POSTGRES_DB=fallout_development \
  -p 5432:5432 \
  postgres:15
```

Update your `.env` file with the database URL:

```
DATABASE_URL=postgresql://postgres:fallout@localhost:5432/fallout_development
```

### 3. Install dependencies

```sh
bundle install
npm install
```

### 4. Setup credentials

The template ships with a placeholder `config/credentials.yml.enc`. Delete it and generate fresh credentials for your project:

```sh
rm config/credentials.yml.enc
bin/rails credentials:edit
```

Then generate Active Record encryption keys and paste them into the credentials file:

```sh
bin/rails db:encryption:init
```

Copy the output into your credentials file so it looks like:

```yaml
active_record_encryption:
  primary_key: <generated>
  deterministic_key: <generated>
  key_derivation_salt: <generated>
```

This creates `config/master.key` (keep this secret, never commit it) and a new `config/credentials.yml.enc`.

### 5. Setup the database

```sh
bin/rails db:setup
```

### 6. Start the Rails server

```sh
bin/dev
```

### Cloudflare R2 (Production)

Active Storage is configured to use Cloudflare R2 in production. Development uses local disk storage by default. To set up R2 for production, create an R2 bucket and API token in the Cloudflare dashboard, then set these environment variables:

```
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET=your_bucket_name
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
```

---

See `.env.development.example` for required environment variables.
