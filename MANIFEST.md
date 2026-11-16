# DM-System — структура проєкту після підготовки ЛР 7–8

## Корінь
- `package.json`, `package-lock.json` — npm monorepo та workspaces.
- `README.md` — загальна документація та команди запуску.
- `labs/lab_7-8/README.md` — архітектура та кроки лабораторної.
- `server-graphql/` — основний GraphQL API.
- `server/` — попередній REST-сервер (залишений як окремий навчальний компонент).
- `mobile/` — Expo-клієнт.
- `docs/`, `labs/`, `practic/` — навчальні матеріали.

## Monorepo
- `app/packages/core/` — `@dm-system/core`, спільна бізнес-логіка й unit-тести.
- `app/` — React/Vite Web-клієнт і Web localStorage adapter.
- `app/desktop/` — Electron main process, preload bridge, файловий адаптер та IPC-тести.

## Прибрані дублікати
Видалені вкладені копії `app/app`, `app/mobile`, `app/server`, `app/server-graphql`, `app/electron`, `app/docs`, `app/practic` та `app/labs`. Оригінальні `mobile/`, `server/`, `server-graphql/`, `docs/`, `practic/` і `labs/` у корені збережені. Методичні матеріали ЛР 7–8 перенесені до `labs/lab_7-8/`.

## Безпека
- `.env` та локальні секрети не входять до архіву.
- У репозиторії залишаються лише `.env.example`.
- `node_modules`, `dist`, кеші та IDE-папки не включаються до архіву.
