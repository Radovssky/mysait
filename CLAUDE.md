# Проект mysait — лендинг-портфолио Раду

Одностраничный лендинг + админка + страницы кейсов для **Раду (Automation Engineer)**: позиционирование, услуги, технический стек, кейсы. Раду через приватную админку добавляет/редактирует кейсы и грузит изображения.

## Ключевые документы

Прочитай эти файлы прежде чем что-либо делать:

1. **`/project/mysait/PLAN.md`** — утверждённый план реализации (стек, схема БД, маршруты, файловая структура, последовательность шагов, верификация). **Это главный документ — следуй ему.**
2. **`/project/mysait/landing_info.md`** — бриф: личное, позиционирование, услуги и цены, стек, тон-оф-войс.
3. **`/project/mysait/документация из обучения/`** — материалы курса по фронтенду / БД / бэкенду / деплою, на которых учился Раду. Используй как ориентир по уровню сложности и знакомым ему практикам (особенно Урок 6 — деплой через Docker).
4. **`/project/mysait/3ef2d2f1-680b-4947-a0cb-00005c975705-cover.png`** — стилевой референс дизайна (тёмная тема, мятно-зелёный акцент, код-стилистика `</>`).
5. **`/project/mysait/photo_2024-10-07_00-51-24 (2).jpg`** — ч/б портрет Раду для секции About.
6. **Memory** в `/home/radu/.claude/projects/-project-mysait/memory/` — профиль пользователя, тон-оф-войс, предпочтения по работе. Загружается автоматом.

## Стек (кратко — детали в PLAN.md)

- Next.js 16 (App Router, TypeScript, React 19) + Tailwind CSS 4 + Framer Motion + shadcn/ui
- PostgreSQL 16 в Docker (self-hosted, **БЕЗ** Supabase) + Drizzle ORM
- Auth.js v5 (Credentials, один пользователь)
- Локальные файлы изображений в `/var/data/uploads`, отдаются через Next.js route handler
- Docker Compose (web + postgres + caddy) на JustHost VPS
- pnpm как менеджер пакетов

## MCP-инструменты, доступные в сессии

- `context7` — актуальная документация Next.js / Drizzle / Auth.js / shadcn-ui. Используй когда нужна свежая API-сигнатура.
- `shadcn-ui` — добавление компонентов shadcn в проект. Используй вместо ручного копи-паста.

Если этих MCP в сессии нет — скажи пользователю, обходись `npx shadcn@latest add ...` и WebFetch для документации.

## Текущий статус

- Git: репо инициализирован (`git@github.com:Radovssky/mysait.git`), ветка `main`, удалённый origin подключён.
- Прогресс по плану:
  - ✅ Шаг 1/14 — scaffold Next.js + Tailwind 4 + dark theme tokens (commit `8495540`).
  - ⏳ Шаг 2/14 — shadcn/ui init + базовые примитивы.
- Версия Next.js: при скаффолде `create-next-app@latest` поставил **Next 16.2.4 + React 19.2.4** (latest stable на 2026-04-27). Раду подтвердил оставить 16. Все API из PLAN.md совместимы; в корне лежит `AGENTS.md` от шаблона с предупреждением для AI про возможные расхождения с training data. Если будут сомнения по API — свериться через `context7` MCP.
- Задачи: при старте новой сессии проверь `TaskList`. Если пусто — пересоздай 14 пунктов из раздела "Последовательность реализации" в PLAN.md через TaskCreate.

## Команды разработки

После скаффолда (когда появится `package.json`):

```bash
pnpm dev              # дев-сервер на :3000
pnpm build            # production build
pnpm lint             # ESLint
pnpm drizzle-kit push # применить схему БД к Postgres
docker compose up -d  # поднять Postgres + web + caddy локально
```

## Конвенции

- **Тон UI-текстов:** сдержанный, технический, без эмодзи и продажных клише, на «вы». Допустимы код-стилистики (`> command`, `// comment`, моноширинные бейджи) — см. memory `feedback_tone.md`.
- **Уточняющие вопросы пользователю:** задавать в теле текстового сообщения нумерованным списком, **не** через AskUserQuestion-дропдаун — см. memory `feedback_inline_questions.md`.
- **Workflow с git:** коммит после каждой завершённой задачи плана. Push не автоматический — спрашивай пользователя или следуй договорённости из текущей сессии.
- **Не создавать `.md`-документы** без явной просьбы пользователя (напр. README, заметки, summary).

## Чего пока нет, но может понадобиться

- `.env` — будет создан вместе с docker-compose.yml на шаге 4. Шаблон в `.env.example`.
- Конфиги Drizzle (`drizzle.config.ts`, `drizzle/schema.ts`) — появятся на шаге 4.
- `node_modules/`, `.next/`, `uploads/`, `postgres_data/`, `backups/` — в `.gitignore`, никогда не коммитим.

## Среда разработки

Хост: WSL2 без sudo. `pnpm` уже установлен через corepack-shim в `~/.local/bin` (`pnpm --version` → 10.33.2). Если в новой сессии `pnpm: command not found` — `corepack enable --install-directory ~/.local/bin` (детали в memory `user_env.md`).
