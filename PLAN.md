# Лендинг-портфолио Раду (Automation Engineer) с админкой и кейсами

## Context

Раду — Automation Engineer (n8n + AI-агенты), работает один. У него нет сайта, продвигает услуги через личные каналы. Нужен одностраничный лендинг как точка входа клиентов: позиционирование, услуги, стек, кейсы. Кейсы оформлены как карточки на главной → при клике открывается детальная страница проекта (контекст, решение, скриншоты, отзыв). Раду через свою админку добавляет/редактирует проекты и грузит изображения.

Проблема, которую решаем: нет публичной витрины с кейсами; новые клиенты не могут быстро понять, кто это, что он делает и какие задачи решал. Лендинг должен компенсировать отсутствие отзывов конкретикой кейсов и техническим, сдержанным тоном.

Папка `/project/mysait/` сейчас содержит только исходники (`landing_info.md`, фото, референс) — стартуем с нуля.

## Стек (зафиксировано)

- **Frontend/Backend:** Next.js 15 (App Router, React Server Components, TypeScript)
- **Стили:** Tailwind CSS 4 + CSS-переменные, Framer Motion для микро-анимаций
- **UI-библиотека:** shadcn/ui (поверх Radix UI) + `class-variance-authority`, `clsx`, `tailwind-merge` — базовые примитивы (Button, Input, Textarea, Select, Dialog, Toast, Card, Form, Label) генерируем командой `npx shadcn@latest add`, не пишем руками. Стилизация через токены тёмной темы (`globals.css`).
- **БД:** PostgreSQL 16 (Docker, рядом с приложением)
- **ORM/Migrations:** Drizzle ORM + drizzle-kit
- **Auth:** Auth.js (NextAuth v5), Credentials provider, **один пользователь** (Раду), пароль хешируется bcrypt, креды в env
- **Хранилище файлов:** локальный диск VPS (`/var/data/uploads`), отдаются через Next.js route handler с правильными cache-headers
- **Markdown:** `@uiw/react-md-editor` в админке + `react-markdown` + `remark-gfm` + `rehype-highlight` на странице проекта
- **Хостинг:** JustHost VPS, Docker Compose (web + postgres + caddy), Caddy для HTTPS (Let's Encrypt)
- **CTA:** просто ссылки на Telegram `@Radovssky`, никакой формы и бэкенда заявок
- **Менеджер пакетов:** pnpm (быстрее npm, дисково экономичнее, лучше работает в Docker через `pnpm fetch`)
- **MCP-инструменты разработки** *(не код проекта, а помощники Claude)*: `context7` (актуальная документация Next.js / Drizzle / Auth.js) и `shadcn-ui` (быстрое добавление компонентов).

## Структура секций лендинга (главная `/`)

1. **Hero** — имя, позиционирование `Automation Engineer`, мигающий курсор `_` в код-стилистике, кнопка "написать в Telegram"
2. **About** — ч/б фото слева, текст справа: краткое био из `landing_info.md` (Казань, опыт 2–4 года, до 10 проектов, договор + фикс)
3. **Services** — 4 карточки услуг с ценами (чат-боты от 50к, голосовые от 150к, контент от 75к, кастом)
4. **Tech Stack** — категории: Ядро / AI / CRM / Мессенджеры / БД (бейджи моноширинным шрифтом)
5. **Process** — 7 этапов работы (нумерованный таймлайн)
6. **Projects** — грид карточек кейсов из БД (фильтр по категории, опционально)
7. **Contact** — Telegram + футер

Стилистика акцентов: префикс `> ` перед CTA-кнопками, `// ` перед подзаголовками секций, моноширинные бейджи.

## Анимации и hover-эффекты

- Карточки проектов: подъём (`translateY`) + glow по периметру акцентом при hover
- Карточки услуг: появление линии-подчёркивания, плавный fade подзаголовка
- Hero: typewriter-эффект на позиционировании, мигающий курсор
- Бейджи стека: лёгкий scale + смена цвета границы при hover
- Скролл-анимации секций через Framer Motion (`whileInView`, `once: true`), без агрессии — просто fade+slide
- Все переходы — `cubic-bezier(0.22, 1, 0.36, 1)`, длительность 200–400 мс
- Уважение `prefers-reduced-motion` — анимации отключаются

## Дизайн-токены (тёмная тема + мятный акцент)

`src/styles/tokens.css`:
- `--bg-base`: #0B0F0E
- `--bg-elevated`: #141A18
- `--border`: #1F2A26
- `--text-primary`: #E8F0EC
- `--text-muted`: #8A9590
- `--accent`: #5AE8B4 (мятно-зелёный)
- `--accent-glow`: rgba(90, 232, 180, 0.2)
- Шрифты: Inter (sans) + JetBrains Mono (моно), оба через `next/font`

## Структура страниц/роутов

| Роут | Тип | Доступ |
|---|---|---|
| `/` | SSG + revalidate 60s | публичный |
| `/projects/[slug]` | SSG + ISR | публичный |
| `/admin/login` | client | публичный |
| `/admin` | SSR (gated) | только Раду |
| `/admin/projects/new` | client | только Раду |
| `/admin/projects/[id]/edit` | client | только Раду |
| `/api/upload` | route handler | только Раду |
| `/api/uploads/[...path]` | route handler | публичный (отдаёт файлы с диска) |
| `/sitemap.xml`, `/robots.txt` | route handlers | публичный |

Защита админки: `src/middleware.ts` проверяет JWT-сессию Auth.js для `/admin/*` и `/api/upload`.

## Схема БД (Drizzle)

**`projects`:**
- `id` uuid PK
- `slug` text unique not null
- `title` text not null
- `short_description` text not null *(для карточки на главной)*
- `cover_image` text *(путь в `/var/data/uploads`)*
- `category` text *(enum: chatbot | ai_agent | voice | content | custom)*
- `client` text *(клиент/индустрия)*
- `context` text *(markdown — задача/контекст)*
- `solution` text *(markdown — что сделано)*
- `stack` text[] *(массив тегов стека)*
- `result` text nullable *(markdown — результат/метрики)*
- `is_published` boolean default false
- `sort_order` int default 0
- `published_at` timestamptz nullable
- `created_at`, `updated_at` timestamptz

**`project_screenshots`:**
- `id` uuid PK
- `project_id` uuid FK ON DELETE CASCADE
- `image_path` text
- `caption` text nullable
- `sort_order` int

**`testimonials`:**
- `id` uuid PK
- `project_id` uuid FK ON DELETE CASCADE
- `author_name` text
- `author_role` text nullable
- `text` text
- `photo_path` text nullable
- `sort_order` int

**`users`** (для Auth.js Credentials, один ряд):
- `id` uuid PK
- `email` text unique
- `password_hash` text

## Структура карточки проекта (поля в форме админки)

Выведены из примера про Авито-агента и потребностей кейсов:

**Базовые (для главной):**
- Заголовок
- Короткое описание (1-2 предложения)
- Превью-картинка (cover)
- Категория (selector)

**Детали (для страницы проекта):**
- Slug (генерируется из заголовка, можно редактировать)
- Клиент / индустрия
- Контекст / задача (markdown)
- Решение (markdown)
- Стек / интеграции (тег-инпут)
- Результат / метрики (markdown, опционально)

**Медиа:**
- Галерея скриншотов (drag-and-drop, caption на каждый, сортировка)

**Отзыв** *(в карточке проекта, скрывается если пусто):*
- Имя автора
- Должность / компания
- Текст
- Фото (опционально)

**Публикация:**
- Чекбокс `is_published`
- Дата публикации
- Sort order (для ручной сортировки на главной)

## Файловая структура

```
/project/mysait/
├── docker-compose.yml          # web + postgres + caddy
├── Dockerfile                  # multi-stage build Next.js
├── Caddyfile                   # reverse proxy + автоHTTPS
├── .env.example
├── .env.local                  # секреты (не коммитим)
├── drizzle.config.ts
├── next.config.ts              # remotePatterns для /api/uploads
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── public/
│   ├── favicon.svg
│   └── radu-photo.jpg          # копия фото для About
├── drizzle/
│   ├── schema.ts
│   └── migrations/             # генерится drizzle-kit
└── src/
    ├── middleware.ts           # auth gate для /admin/*
    ├── auth.ts                 # конфиг Auth.js v5
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx            # лендинг
    │   ├── globals.css
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── opengraph-image.tsx
    │   ├── projects/[slug]/
    │   │   ├── page.tsx
    │   │   ├── opengraph-image.tsx
    │   │   └── not-found.tsx
    │   ├── admin/
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   ├── page.tsx
    │   │   └── projects/
    │   │       ├── new/page.tsx
    │   │       └── [id]/edit/page.tsx
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts
    │       ├── upload/route.ts
    │       └── uploads/[...path]/route.ts
    ├── components/
    │   ├── landing/            # Hero, About, Services, TechStack, Process, ProjectsGrid, ProjectCard, Contact
    │   ├── project/            # ProjectHero, ProjectGallery, Testimonial, MarkdownContent
    │   ├── admin/              # LoginForm, ProjectForm, ScreenshotsManager, TestimonialEditor, ImageUploader, MarkdownEditor
    │   └── ui/                 # сгенерированные shadcn/ui примитивы (button, input, textarea, dialog, toast, card, form...)
    ├── lib/
    │   ├── db.ts               # Drizzle client
    │   ├── auth-helpers.ts     # requireAdmin
    │   ├── projects.ts         # server-only CRUD
    │   ├── storage.ts          # save/delete файлов на диск
    │   ├── slug.ts
    │   └── seo.ts              # generateMetadata helpers, JSON-LD
    ├── content/
    │   ├── services.ts         # 4 услуги (хардкод)
    │   ├── process-steps.ts    # 7 этапов
    │   ├── tech-stack.ts       # категории стека
    │   └── about.ts            # текст для About
    ├── types/
    │   └── db.ts
    └── styles/
        └── tokens.css
```

## Загрузка файлов

- POST `/api/upload` принимает multipart, проверяет сессию Auth.js, валидирует MIME (image/jpeg, image/png, image/webp), max 5 MB, генерирует имя `{uuid}.{ext}`, сохраняет в `/var/data/uploads`, возвращает путь
- GET `/api/uploads/[...path]` стримит файл с диска с `Cache-Control: public, max-age=31536000, immutable`
- В Docker Compose `/var/data/uploads` монтируется как named volume → бэкапы через `docker run --rm -v uploads_volume:/data -v $(pwd):/backup alpine tar czf /backup/uploads.tar.gz /data`
- При удалении проекта/скриншота — Server Action удаляет файл с диска
- `next.config.ts` добавляет домен сайта в `images.remotePatterns` для `next/image`

## SEO

- Корневой `layout.tsx`: дефолтный title template `"%s — Раду | Automation Engineer"`, OG-теги, Twitter cards
- `generateMetadata` на `/projects/[slug]` тянет данные из БД (title, description = short_description, OG-image = cover)
- JSON-LD `Person` schema на главной (имя, должность, sameAs Telegram), `CreativeWork` на странице проекта
- `sitemap.ts` динамически перечисляет опубликованные проекты с `lastModified = updated_at`
- `robots.txt` запрещает `/admin/*` и `/api/*`
- После CRUD в админке — `revalidatePath('/')` и `revalidatePath('/projects/[slug]')`

## Деплой на JustHost VPS

`docker-compose.yml`:
- `postgres:16-alpine` (volume `pg_data`, порт только internal, healthcheck через `pg_isready`)
- `web` (build из Dockerfile, env-vars из `.env`, `depends_on: postgres (condition: service_healthy)`, volume `/var/data/uploads`, healthcheck на `/api/health`)
- `caddy:2-alpine` (Caddyfile, volumes для Let's Encrypt сертификатов, ports 80/443, `depends_on: web (condition: service_healthy)`)

Health checks (требование Урока 6):
- Postgres: `pg_isready -U $POSTGRES_USER`, interval 10s
- Web: GET `/api/health` (возвращает 200 + проверку БД), interval 30s, start_period 40s
- Перезапуск контейнера при `unhealthy` через `restart: unless-stopped`

Первичный деплой:
1. Поднять VPS (минимум 1 GB RAM, Ubuntu 22.04+, Docker, Docker Compose)
2. `git clone`, скопировать `.env.example` в `.env`, заполнить `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_URL`, `POSTGRES_PASSWORD`
3. `docker compose up -d --build`
4. Внутри контейнера web: `pnpm drizzle-kit push` для применения схемы
5. Сид админ-пользователя: одноразовый скрипт `pnpm tsx scripts/seed-admin.ts`

Дальнейшие обновления: `git pull && docker compose up -d --build web`

## Бэкапы и обслуживание БД

Урок 4 явно требует «всегда делать ДАМП перед изменениями БД». Реализуем:

- `scripts/backup.sh` — `pg_dump` всей БД в файл `backups/dump_YYYY-MM-DD_HH-MM.sql.gz` (gzip-сжатие). Запускается вручную перед миграциями и через cron (раз в сутки).
- `scripts/restore.sh` — обратный процесс из выбранного дампа.
- `scripts/backup-uploads.sh` — `tar czf backups/uploads_YYYY-MM-DD.tar.gz /var/data/uploads`.
- Папка `backups/` в `.gitignore` (объёмные бинари не в репо).
- Crontab на VPS:
  - `0 3 * * * /srv/app/scripts/backup.sh && /srv/app/scripts/backup-uploads.sh`
  - Опционально — `rsync` бэкапов на внешний хостинг (можно и позже, не на старте).
- Ротация: оставляем последние 7 дневных + 4 недельных дампа, остальное удаляем (простой `find -mtime +7 -delete`).

## Файлы, которые нужно будет создать/затронуть

Критические:
- `/project/mysait/src/app/page.tsx` — главная со всеми секциями
- `/project/mysait/src/app/projects/[slug]/page.tsx` — страница проекта с галереей и отзывом
- `/project/mysait/src/components/admin/ProjectForm.tsx` — основная форма CRUD кейса
- `/project/mysait/drizzle/schema.ts` — схема БД (projects, screenshots, testimonials, users)
- `/project/mysait/src/auth.ts` + `/project/mysait/src/middleware.ts` — Auth.js + защита роутов
- `/project/mysait/src/app/api/upload/route.ts` + `/project/mysait/src/app/api/uploads/[...path]/route.ts` — загрузка/раздача файлов
- `/project/mysait/docker-compose.yml` + `/project/mysait/Dockerfile` + `/project/mysait/Caddyfile` — деплой

Контент:
- `/project/mysait/public/radu-photo.jpg` — копия фото из исходников
- `/project/mysait/src/content/{services,process-steps,tech-stack,about}.ts` — статичный контент по landing_info.md

## Последовательность реализации

1. Скаффолд Next.js 15 + Tailwind 4 + токены тёмной темы (`globals.css`)
2. Установка shadcn/ui (`npx shadcn@latest init`) + базовые примитивы (button, input, textarea, label, dialog, toast, card, form, select), шрифты через `next/font`
3. Лендинг со статичными секциями (Hero → About → Services → TechStack → Process → Contact), включая анимации hover/scroll через Framer Motion
4. Docker Compose + Postgres + Drizzle, схема БД, миграции, health checks для контейнеров, `/api/health` route
5. Auth.js + middleware + страница `/admin/login`, сид админ-пользователя
6. Чтение проектов из БД на главной (`ProjectsGrid` + `ProjectCard`), страница `/projects/[slug]`
7. Админка: список проектов, форма создания/редактирования (без медиа)
8. Загрузка файлов: route handlers + ImageUploader-компонент + интеграция в форму (cover, screenshots, testimonial photo)
9. Markdown-редактор и рендеринг
10. SEO: metadata, sitemap, robots, JSON-LD, OG-images
11. Скрипты бэкапов (`scripts/backup.sh`, `scripts/restore.sh`, `scripts/backup-uploads.sh`)
12. Caddyfile + production-сборка, проверка локально через `docker compose up`
13. Деплой на JustHost VPS, настройка cron для бэкапов
14. Финальный прогон Lighthouse (цель: Performance 95+, SEO 100, Accessibility 95+)

## Верификация

Локально:
- `docker compose up` поднимает Postgres + web
- Открыть `http://localhost:3000` — все секции отрисованы, hover-анимации работают
- `http://localhost:3000/admin/login` — войти, создать тестовый проект (с обложкой, 2 скриншотами, отзывом с фото), опубликовать
- Открыть главную — карточка появилась
- Кликнуть карточку — открылась `/projects/[slug]` с контентом, галереей, отзывом
- Снять `is_published` — карточка пропала с главной
- Удалить проект — файлы исчезли с диска
- `prefers-reduced-motion: reduce` в DevTools — анимации отключены
- Lighthouse в DevTools: Performance ≥ 95, SEO = 100, Accessibility ≥ 95
- Проверить `view-source:` страницы проекта — title, description, OG-теги корректные, JSON-LD присутствует

На VPS (после деплоя):
- HTTPS работает (Caddy выдал сертификат)
- Карточки и страницы проектов открываются
- Админка работает по `/admin/login`
- Загрузка изображения проходит, файл доступен по публичному URL
