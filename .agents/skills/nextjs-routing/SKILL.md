---
name: nextjs-routing
description: Custom guidelines for App Router, routing, and conventions.
---

# Next.js App Router Skill

This skill contains the conventions and best practices for Next.js App Router features in this project.

## Conventions

1. **Pages & Routing**:
   - Use App Router structure inside [src/app/](file:///c:/Users/user/Desktop/kwakuasamoah/src/app/).
   - Always define layout at the directory level when needed.
   - Use CSS Modules (`*.module.css`) or TailwindCSS classes for styling as configured.

2. **Server and Client Components**:
   - By default, files are Server Components.
   - Add `"use client"` at the top of files that use React hooks (state, effects) or browser-only APIs.
