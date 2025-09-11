#!/bin/bash

echo "ECE Database Management Script"
echo "Usage: $0 {migrate|seed|backup|restore|reset|studio}"

case "$1" in
  migrate)
    echo "Running database migrations..."
    npx prisma migrate dev
    ;;
  seed)
    echo "Seeding database with test data..."
    npx prisma db seed
    ;;
  backup)
    echo "Creating database backup..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    cp prisma/dev.db "prisma/dev.db.backup.$TIMESTAMP"
    echo "Backup created: prisma/dev.db.backup.$TIMESTAMP"
    ;;
  restore)
    echo "Restoring database from latest backup..."
    LATEST_BACKUP=$(ls -t prisma/dev.db.backup.* 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
      cp "$LATEST_BACKUP" prisma/dev.db
      echo "Database restored from: $LATEST_BACKUP"
    else
      echo "No backup found!"
      exit 1
    fi
    ;;
  reset)
    echo "Resetting database..."
    npx prisma migrate reset --force
    ;;
  studio)
    echo "Opening Prisma Studio..."
    npx prisma studio
    ;;
  *)
    echo "Available commands:"
    echo "  migrate - Run pending migrations"
    echo "  seed    - Seed database with test data"
    echo "  backup  - Create database backup"
    echo "  restore - Restore from latest backup"
    echo "  reset   - Reset database and migrations"
    echo "  studio  - Open Prisma Studio"
    exit 1
esac

echo "Database operation completed!"
