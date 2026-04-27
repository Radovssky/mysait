#!/usr/bin/env bash
# Первоначальная инициализация на VPS. Не запускается автоматически —
# это шпаргалка, прокомментированная по шагам. Запускать руками или
# копировать команды в свою сессию.

set -euo pipefail

cat <<'EOF'
==> Шаги первичного деплоя mysait на VPS

Предполагается чистый Ubuntu 22.04+ с правами sudo.

# 1. Установить Docker + Compose
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker "$USER"
# (relogin) — чтобы группа docker подхватилась без sudo

# 2. Клонировать репозиторий в /srv/mysait
sudo mkdir -p /srv/mysait
sudo chown "$USER":"$USER" /srv/mysait
git clone git@github.com:Radovssky/mysait.git /srv/mysait
cd /srv/mysait

# 3. Заполнить .env (НЕ копируйте dev-значения в прод)
cp .env.example .env
$EDITOR .env
#   - POSTGRES_PASSWORD: длинный случайный
#   - DATABASE_URL: оставьте как есть, compose сам соберёт под docker-сеть
#   - AUTH_SECRET: openssl rand -base64 32
#   - ADMIN_EMAIL: ваш email
#   - ADMIN_PASSWORD_HASH: pnpm tsx scripts/hash-password.ts <pwd> (см. ниже)
#   - CADDY_HOST: ваш домен
#   - CADDY_ACME_EMAIL: реальная почта (для Let's Encrypt)
#   - NEXTAUTH_URL=https://<домен>
#   - SITE_URL=https://<домен>

# 4. Поднять стек
docker compose --profile prod up -d --build

# 5. Применить схему БД (один раз)
docker compose exec -T web sh -lc 'pnpm exec drizzle-kit push --force'
# Если drizzle-kit нет в production-образе (он только в devDeps), залейте
# схему через:
docker exec -i mysait-postgres psql -U mysait -d mysait < drizzle/migrations/0000_volatile_the_fallen.sql

# 6. Создать админа
# Сначала получите хеш пароля локально:
#   pnpm tsx scripts/hash-password.ts <ваш-пароль>
# Запишите ADMIN_EMAIL + ADMIN_PASSWORD_HASH в .env, потом:
docker compose exec -T web sh -lc 'pnpm tsx scripts/seed-admin.ts'
# (или, если tsx нет в проде, выполните INSERT через psql напрямую)

# 7. Cron на бэкапы
crontab -e
# вставьте строки из scripts/crontab.example, поправьте пути под /srv/mysait

# 8. Проверка
curl -fsS https://<домен>/api/health   # ожидаем {"status":"ok","db":"up"}
# Зайти в /admin/login и убедиться, что /admin доступен.

==> Обновления (после первичного деплоя)
cd /srv/mysait && git pull
docker compose --profile prod up -d --build web caddy
EOF
