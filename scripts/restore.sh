#!/usr/bin/env bash
# Восстановление БД из дампа: scripts/restore.sh backups/dump_2026-04-27_03-00.sql.gz
# Перезаписывает текущую БД — спрашивает подтверждение.

set -euo pipefail

if [[ "${1:-}" == "" ]]; then
  echo "Usage: $0 <path-to-dump.sql.gz>"
  exit 1
fi

DUMP="$1"
if [[ ! -f "$DUMP" ]]; then
  echo "Dump not found: $DUMP"
  exit 1
fi

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

POSTGRES_USER="${POSTGRES_USER:-mysait}"
POSTGRES_DB="${POSTGRES_DB:-mysait}"

read -r -p "Это перезапишет БД '${POSTGRES_DB}'. Продолжить? [y/N] " ANSWER
if [[ "${ANSWER,,}" != "y" ]]; then
  echo "Отменено"
  exit 1
fi

if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^mysait-postgres$'; then
  gunzip -c "$DUMP" | docker exec -i mysait-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
else
  : "${DATABASE_URL:?DATABASE_URL is required when postgres is not in docker}"
  gunzip -c "$DUMP" | psql "$DATABASE_URL"
fi

echo "→ Восстановлено из $DUMP"
