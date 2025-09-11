# Prisma Apps Folder

This folder contains app-specific Prisma configurations and databases for the ECE platform.

## Structure

- `ece-web/` - Web application database and schema
  - `schema.prisma` - Prisma schema for web app
  - `dev.db` - Development SQLite database

## Purpose

The `/prisma/apps/` folder organizes database-related files by application, allowing for:
- App-specific schema definitions
- Isolated development databases
- Clear separation of concerns
- Easier maintenance and deployment

## Usage

Each subfolder contains the complete Prisma setup for that application:

### Web App (`ece-web/`)
- Schema with comprehensive models for users, cards, transactions
- Development database with sample data
- Ready for local development and testing

## Commands

From the web app directory (`apps/ece-web/`):
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio for database exploration
npx prisma studio

# Reset database
npx prisma migrate reset
```

## Environment

- **Development**: SQLite database (dev.db)
- **Production**: PostgreSQL database
- **Database URL**: Configured in .env file

## Maintenance

- Update schema.prisma when adding new features
- Run migrations for schema changes
- Backup dev.db for important development data
- Keep schemas synchronized with main /prisma/ folder

## Best Practices

- Use descriptive model and field names
- Add proper indexes for performance
- Include relations for data integrity
- Document complex queries and business logic
- Test migrations before deploying to production
