# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` - Start all apps in dev mode (via Turborepo)
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all apps and packages
- `pnpm dev --filter=@bling/web` - Start only the web app

No test framework is configured.

## Architecture

Turborepo monorepo with pnpm workspaces.

### Apps
- `apps/web` (`@bling/web`) - Next.js 16 app using App Router with React 19 and TypeScript. React Compiler (`reactCompiler: true`) is enabled.

### Packages
- `packages/ui` (`@bling/ui`) - Shared shadcn/ui components and `cn()` utility. Shipped as TypeScript source (not pre-compiled). Apps transpile via `transpilePackages`.
- `packages/typescript-config` (`@bling/typescript-config`) - Shared TypeScript base configurations.

**Styling:** Tailwind CSS 4 (via `@tailwindcss/postcss`). Theme tokens are defined as CSS custom properties in `apps/web/src/app/globals.css` with dark mode support.

**Component system:** Shadcn/ui components live in `packages/ui/`. The `cn()` utility is in `@bling/ui` and re-exported from `apps/web/src/lib/utils.ts` for backward compatibility. App code imports UI components from `@bling/ui`.

**Adding a new shadcn component:**
```bash
cd packages/ui && npx shadcn@latest add <component-name>
# Then:
# 1. Change `@/lib/utils` imports to `../lib/utils` (relative)
# 2. Change any `@/components/*` imports to relative (e.g., `./button`)
# 3. Export it from packages/ui/src/index.ts
```

**ESLint:** v9 flat config with Next.js core-web-vitals and TypeScript rules.

## 개발 시 고려사항
- 나중에 웹뷰로 패키징해서 웹뿐 아니라 앱까지 출시할 가능성도 있음.
- apps 하위에 현재는 web프로젝트만 있는 creator 페이지, admin페이지, advertiser 페이지 각 프로젝트들이 같이 들어갈 예정. 