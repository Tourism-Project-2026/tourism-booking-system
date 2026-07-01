---
name: Next.js standalone server.js path in pnpm monorepo
description: In a monorepo, Next.js standalone output nests server.js at the full workspace path, not at the standalone root
---

# Next.js standalone server.js path in pnpm monorepo

## The rule
When `output: "standalone"` is set in `next.config.ts` and the app lives inside a monorepo subdirectory (e.g. `artifacts/travel-agency/`), Next.js mirrors the full workspace path inside the standalone output directory.

**Wrong** (flat assumption):
```
artifacts/travel-agency/.next/standalone/server.js
```

**Correct** (mirrors workspace path):
```
artifacts/travel-agency/.next/standalone/artifacts/travel-agency/server.js
```

## Why
Next.js standalone traces the app from the workspace root. The output directory structure reflects the absolute path of the app within the project, so `server.js` ends up at `<standalone>/<relative-path-to-app>/server.js`.

## How to apply
When setting `artifact.toml` production `run` command for a Next.js app in this monorepo:
- Find the actual path with: `find artifacts/travel-agency/.next/standalone -name "server.js" | grep -v node_modules`
- Use that full path in the `run` command
- Pattern: `node artifacts/<name>/.next/standalone/artifacts/<name>/server.js`
