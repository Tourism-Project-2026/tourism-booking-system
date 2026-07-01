---
name: Next.js standalone server.js path and static assets in pnpm monorepo
description: In a monorepo, Next.js standalone output nests server.js at the full workspace path and requires manual copying of static/public files
---

# Next.js standalone in pnpm monorepo — two critical issues

## Issue 1: server.js path is nested at the full workspace path

When `output: "standalone"` is set and the app lives at `artifacts/travel-agency/`, Next.js mirrors the full workspace path inside the standalone output directory.

**Wrong** (flat assumption):
```
artifacts/travel-agency/.next/standalone/server.js
```

**Correct** (mirrors workspace path):
```
artifacts/travel-agency/.next/standalone/artifacts/travel-agency/server.js
```

Find the real path after any build with:
```bash
find artifacts/travel-agency/.next/standalone -name "server.js" | grep -v node_modules
```

## Issue 2: Static and public files must be manually copied into standalone

Next.js does NOT automatically include `.next/static/` or `public/` in the standalone output. The standalone server looks for them **relative to server.js**, so they must be copied there after the build.

`package.json` `build:prod` script (runs from `artifacts/travel-agency/`):
```
"build:prod": "next build && cp -r .next/static .next/standalone/artifacts/travel-agency/.next/static && cp -r public .next/standalone/artifacts/travel-agency/public"
```

`artifact.toml` must reference `build:prod`, not `build`:
```toml
[services.production]
build = [ "pnpm", "--filter", "@workspace/travel-agency", "run", "build:prod" ]
run = "node artifacts/travel-agency/.next/standalone/artifacts/travel-agency/server.js"
```

## Why
Replit's autoscale deployment removes gitignored files from the container image after the build step. Additionally, Next.js standalone does not self-contain static assets. Both issues together cause the deployed app to have no CSS/JS.

## How to apply
Any time a new Next.js app is added to this monorepo with `output: "standalone"`, apply both fixes above before the first publish.
