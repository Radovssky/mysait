# Проект mysait — лендинг-портфолио Раду

Одностраничный лендинг + админка + страницы кейсов для **Раду (Automation Engineer)**: позиционирование, услуги, технический стек, кейсы. Раду через приватную админку добавляет/редактирует кейсы и грузит изображения.

## Ключевые документы

1. **`/project/mysait/PLAN.md`** — утверждённый план реализации (стек, схема БД, маршруты, файловая структура, последовательность шагов, верификация). Главный документ — следуй ему.
2. **Memory** в `/home/radu/.claude/projects/-project-mysait/memory/` — профиль пользователя, тон-оф-войс, предпочтения по работе, прогресс. Загружается автоматом.

Контент уже зашит в `src/content/{about,services,tech-stack,process-steps}.ts`. Стилевая палитра / акценты — в `src/styles/tokens.css`. Фото портрета — `public/radu-photo.jpg`. Исходные брифы и референсы из истории не нужны для работы — удалены.

## Стек (кратко — детали в PLAN.md)

- Next.js 16 (App Router, TypeScript, React 19) + Tailwind CSS 4 + Framer Motion + shadcn/ui (preset `base-nova`)
- PostgreSQL 16 в Docker (self-hosted, **БЕЗ** Supabase) + Drizzle ORM
- Auth.js v5 (Credentials, один пользователь)
- Локальные файлы изображений в `/var/data/uploads`, отдаются через Next.js route handler
- Docker Compose (web + postgres + caddy) на JustHost VPS
- pnpm как менеджер пакетов

## MCP-инструменты, доступные в сессии

- `context7` — актуальная документация Next.js / Drizzle / Auth.js / shadcn-ui. Используй когда нужна свежая API-сигнатура.
- `shadcn-ui` — добавление компонентов shadcn в проект.

Если этих MCP в сессии нет — обходись `npx shadcn@latest add ...` и WebFetch для документации.

## Текущий статус

- Git: репо `git@github.com:Radovssky/mysait.git`, ветка `main`, push на origin актуален. Тэг `v1-before-restyle` помечает версию до визуального редизайна.
- Все 14 шагов плана закрыты локально + Cursor-pass для визуала, тестовый кейс `avito-agent` опубликован.
- Открытый шаг — деплой на JustHost VPS (`scripts/setup-vps.sh` как чеклист, дальше идёт ручной заход по SSH).
- Версия Next.js 16.2.4 + React 19.2.4 (latest stable, подтверждено пользователем). При сомнениях по API — сверяться через `context7` MCP.

## Команды разработки

```bash
pnpm dev                      # дев-сервер на :3000
pnpm build                    # production build (standalone)
pnpm lint                     # ESLint
pnpm db:push                  # применить схему Drizzle к Postgres (нужен --force при destructive)
pnpm db:generate              # сгенерировать SQL-миграцию из изменений schema.ts
pnpm tsx scripts/hash-password.ts <pwd>   # bcrypt-хеш для ADMIN_PASSWORD_HASH
pnpm tsx scripts/seed-admin.ts             # сидирование админа в БД
docker compose up -d postgres              # только постгрес для локальной разработки
docker compose --profile prod up -d --build  # полный prod-стек (postgres + web + caddy)
./scripts/backup.sh                        # дамп БД (gzip → backups/)
./scripts/backup-uploads.sh                # tarball uploads → backups/
```

## Конвенции

- **Тон UI-текстов:** сдержанный, технический, без эмодзи и продажных клише, на «вы». Допустимы код-стилистики (`> command`, `// comment`, моноширинные бейджи) — см. memory `feedback_tone.md`.
- **Уточняющие вопросы пользователю:** задавать в теле текстового сообщения нумерованным списком, **не** через AskUserQuestion-дропдаун — см. memory `feedback_inline_questions.md`.
- **Автономный режим по PLAN.md:** не спрашивать «стартую?» между шагами плана — переходить автоматически. По разовым/опасным вещам (push, destructive ops, изменения стека) — спрашивать. См. memory `feedback_autonomous_plan.md`.
- **Workflow с git:** коммит после каждой завершённой задачи плана. Push на origin — без отдельного запроса, если он зафиксирован договорённостью; иначе спрашивать.
- **Не создавать `.md`-документы** без явной просьбы пользователя (напр. README, заметки, summary).

## Чего нет в репо, но нужно для работы

- `.env` — локальные секреты, в `.gitignore`. Шаблон в `.env.example`. На проде создаётся руками на сервере.
- `node_modules/`, `.next/`, `uploads/`, `backups/` — в `.gitignore`.

## Среда разработки

Хост: WSL2 без sudo. `pnpm` установлен через corepack-shim в `~/.local/bin` (`pnpm --version` → 10.33.2). Если в новой сессии `pnpm: command not found` — `corepack enable --install-directory ~/.local/bin` (детали в memory `user_env.md`).

Docker Desktop с WSL integration. Postgres в контейнере `mysait-postgres` (5432 наружу). Полный prod-стек поднимается профилем `prod`.
