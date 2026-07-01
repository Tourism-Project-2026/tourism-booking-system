---
name: Replit deployment removes gitignored files from container images
description: Replit's autoscale deployment strips gitignored files after the build step; production build outputs must not be gitignored
---

# Replit deployment removes gitignored files from container images

## The rule
Replit's deployment system (autoscale / Cloud Run) runs the build command, then **removes gitignored files** from the workspace before finalizing the container image. Any production build output that is gitignored will be gone by the time the `run` command executes.

## Why
The cleanup step is visible in build logs as:
```
Removed all cached metadata files
Removed 36450 files
Removed 497 packages
```
This is Replit optimizing container image size by stripping ignored/generated files.

## How to apply
For Next.js with `output: "standalone"`:
- Do NOT put `.next/` in `.gitignore` — the standalone output will be wiped
- Safe to ignore: `.next/cache/` (dev compilation cache only, not produced in production builds)
- Correct `.gitignore` entry: `.next/cache/` not `.next/`

General rule: if a build step produces output that the `run` command needs, that output path must NOT match any `.gitignore` pattern, or it will be removed before the container starts.
