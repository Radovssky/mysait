#!/usr/bin/env bash
# Дамп БД в backups/dump_YYYY-MM-DD_HH-MM.sql.gz.
# Если postgres в docker (контейнер mysait-postgres) — pg_dump через docker exec,
# иначе берёт DATABASE_URL и работает с удалённым/локальным psql клиентом хоста.

set -euo pipefail

# Подгружаем .env, если есть
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

POSTGRES_USER="${POSTGRES_USER:-mysait}"
POSTGRES_DB="${POSTGRES_DB:-mysait}"

mkdir -p backups
DATE="$(date +%Y-%m-%d_%H-%M)"
OUT="backups/dump_${DATE}.sql.gz"

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^mysait-postgres$'; then
  docker exec mysait-postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$OUT"
else
  : "${DATABASE_URL:?DATABASE_URL is required when postgres is not in docker}"
  pg_dump "$DATABASE_URL" | gzip > "$OUT"
fi

echo "→ Saved $OUT ($(du -h "$OUT" | cut -f1))"

# Ротация: дневные старше 7 дней — удалить.
DELETED="$(find backups -maxdepth 1 -name 'dump_*.sql.gz' -type f -mtime +7 -print -delete | wc -l)"
if [[ "$DELETED" -gt 0 ]]; then
  echo "→ Rotated out $DELETED old dumps"
fi
