#!/usr/bin/env bash
# Архив папки uploads в backups/uploads_YYYY-MM-DD_HH-MM.tar.gz.
# В dev читает из ./uploads (или $UPLOADS_DIR), в prod — из docker named volume
# (по умолчанию mysait_uploads, переопределить через $UPLOADS_VOLUME).

set -euo pipefail

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

mkdir -p backups
DATE="$(date +%Y-%m-%d_%H-%M)"
OUT="backups/uploads_${DATE}.tar.gz"

HOST_DIR="${UPLOADS_DIR:-./uploads}"
DOCKER_VOLUME="${UPLOADS_VOLUME:-mysait_uploads}"

if [[ -d "$HOST_DIR" ]]; then
  tar czf "$OUT" -C "$(dirname "$HOST_DIR")" "$(basename "$HOST_DIR")"
elif docker volume inspect "$DOCKER_VOLUME" >/dev/null 2>&1; then
  docker run --rm \
    -v "$DOCKER_VOLUME":/data:ro \
    -v "$(pwd)/backups":/backup \
    alpine \
    tar czf "/backup/uploads_${DATE}.tar.gz" -C /data .
else
  echo "→ Ни $HOST_DIR, ни docker volume $DOCKER_VOLUME не найдены — пропускаю"
  exit 0
fi

echo "→ Saved $OUT ($(du -h "$OUT" | cut -f1))"

DELETED="$(find backups -maxdepth 1 -name 'uploads_*.tar.gz' -type f -mtime +7 -print -delete | wc -l)"
if [[ "$DELETED" -gt 0 ]]; then
  echo "→ Rotated out $DELETED old upload archives"
fi
