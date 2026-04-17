# Force Rebuild
# ── Build ────────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM oven/bun:1-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/migrate.ts ./migrate.ts

EXPOSE 3000

CMD ["sh", "-c", "bun migrate.ts && exec bun build/index.js"]
