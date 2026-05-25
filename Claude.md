# Claude Code Notes

## Project Overview

`kinqimen` is a TypeScript 奇门遁甲排盘 library published as an ESM npm package. The package now lives at the repository root and uses Bun for testing/building.

Core entry points:

- `src/index.ts`: public exports.
- `src/qimen.ts`: main `Qimen` API and pan assembly.
- `src/core/`: calculation modules for 天盘、地盘、八门、九星、八神、暗干、马星、长生运、门迫、击刑等.
- `src/calendar/`: calendar/ganzhi/jieqi adapter code, backed by `tyme4ts`.
- `src/data/tables.ts`: static lookup tables.
- `test/`: Bun test suite.

## Common Commands

```bash
bun install
bun run typecheck
bun test
bun run build
```

Before publishing, run:

```bash
bun run prepublishOnly
```

## Development Notes

- Keep the public API centered on `Qimen` and exported types from `src/index.ts`.
- Prefer small, table-driven calculation helpers in `src/core/` instead of broad rewrites.
- Update focused tests in `test/` whenever changing 排盘 behavior or returned JSON shape.
- Build output is generated under `dist/`; source changes belong in `src/`.
- This is an ESM package (`"type": "module"`), so use ESM imports/exports.

## Verification Checklist

For code changes, run at least:

```bash
bun run typecheck
bun test
```

For release-facing changes, also run:

```bash
bun run build
```
