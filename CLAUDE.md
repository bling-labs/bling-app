# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

No test framework is configured.

## Architecture

Next.js 16 app using the App Router with React 19 and TypeScript. The React Compiler (`reactCompiler: true` in next.config.ts) is enabled for automatic optimizations.

**Styling:** Tailwind CSS 4 (via `@tailwindcss/postcss`). Theme tokens are defined as CSS custom properties in `src/app/globals.css` with dark mode support.

**Component system:** Shadcn/ui is configured (`components.json`) with the `cn()` utility in `src/lib/utils.ts` for className merging (clsx + tailwind-merge). New shadcn components install to `src/components/ui/` with the `@/` path alias mapping to `./src/*`.

**ESLint:** v9 flat config with Next.js core-web-vitals and TypeScript rules.
