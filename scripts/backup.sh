#!/bin/bash

echo "ECE Backup Script"
echo "Usage: $0 [database|configs|all]"

BACKUP_TYPE="${1:-all}"

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Function to backup database
backup_database() {
  echo "Backing up database..."
  if [ -f "prisma/dev.db" ]; then
    cp prisma/dev.db "$BACKUP_DIR/database.db"
    echo "✅ Database backed up"
  else
    echo "❌ Database file not found"
  fi
}

# Function to backup configurations
backup_configs() {
  echo "Backing up configuration files..."

  # Environment files
  cp .env "$BACKUP_DIR/.env.backup" 2>/dev/null || echo "⚠️  .env not found"

  # Package files
  cp package.json "$BACKUP_DIR/package.json"
  cp package-lock.json "$BACKUP_DIR/package-lock.json" 2>/dev/null || true

  # Config files
  cp tsconfig.json "$BACKUP_DIR/tsconfig.json"
  cp tailwind.config.ts "$BACKUP_DIR/tailwind.config.ts" 2>/dev/null || true

  echo "✅ Configuration files backed up"
}

# Function to backup source code
backup_source() {
  echo "Backing up source code..."
  mkdir -p "$BACKUP_DIR/src"
  cp -r src/ "$BACKUP_DIR/src/" 2>/dev/null || echo "⚠️  src directory not found"
  echo "✅ Source code backed up"
}

# Main backup logic
case "$BACKUP_TYPE" in
  database)
    backup_database
    ;;
  configs)
    backup_configs
    ;;
  source)
    backup_source
    ;;
  all)
    backup_database
    backup_configs
    backup_source
    ;;
  *)
    echo "Invalid backup type. Use: database, configs, source, or all"
    exit 1
    ;;
esac

echo ""
echo "🎉 Backup completed!"
echo "📁 Backup location: $BACKUP_DIR"
echo "📊 Backup contents:"
ls -la "$BACKUP_DIR"

# Show backup size
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo "📏 Backup size: $BACKUP_SIZE"

echo ""
echo "💡 To restore: cp $BACKUP_DIR/* ./"
echo "💡 To list backups: ls -la backups/"
