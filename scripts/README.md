# ECE Scripts

This folder contains utility scripts and automation tools for the ECE platform development, testing, and deployment.

## Available Scripts

### Development Scripts
- `ai-echo.ts` - Test AI provider connectivity and routing
- `platform-operations.ts` - Platform management and operations utilities
- `simple-api-test.js` - Basic API endpoint testing and validation
- `test-generation-engine.ts` - Automated test generation and management
- `start-all.sh` - Unified startup script for all ECE applications

### Database Scripts
- `db-manage.sh` - Database operations (migrate, seed, backup, restore)

### Deployment Scripts
- `deploy.sh` - Automated deployment for all platforms

### Maintenance Scripts
- `cleanup.sh` - Clean up build artifacts and temporary files

### System & Monitoring
- `health-check.sh` - System health monitoring and diagnostics

### CI/CD
- `ci-pipeline.sh` - Complete CI/CD pipeline execution

### Performance
- `perf-test.js` - Performance testing and metrics collection

## Usage Examples

### Development
```bash
# Test AI connectivity
node -r ts-node/register scripts/ai-echo.ts --provider openai --message "ping"

# Start all applications
./scripts/start-all.sh

# Run API tests
node scripts/simple-api-test.js
```

### Database Management
```bash
# Run database migrations
./scripts/db-manage.sh migrate

# Seed database with test data
./scripts/db-manage.sh seed

# Backup database
./scripts/db-manage.sh backup
```

### Deployment
```bash
# Deploy all applications
./scripts/deploy.sh
```

### Maintenance
```bash
# Clean up project
./scripts/cleanup.sh
```

## Script Categories

### AI & Testing
Scripts for AI integration testing and automated test generation.

### Platform Operations
Scripts for managing platform operations and maintenance tasks.

### Database
Scripts for database schema management, migrations, and data operations.

### Deployment
Scripts for building and deploying applications across platforms.

### Utilities
General utility scripts for development workflow optimization.

## Requirements

- Node.js 18+
- npm or yarn
- Bash shell (for .sh scripts)
- ts-node (for TypeScript scripts)

## Adding New Scripts

When adding new scripts:

1. Use descriptive filenames
2. Include usage comments at the top
3. Add error handling and logging
4. Update this README
5. Make shell scripts executable with `chmod +x`

## Best Practices

- Scripts should be idempotent when possible
- Include proper error handling and exit codes
- Use consistent logging and output formatting
- Document all command-line options
- Test scripts in isolation before integration

## Troubleshooting

### Common Issues
- **Permission denied**: Run `chmod +x script.sh` to make executable
- **Module not found**: Ensure dependencies are installed with `npm install`
- **Path issues**: Run scripts from project root directory
- **Environment variables**: Check `.env` file for required variables

### Debug Mode
Most scripts support debug output:
```bash
DEBUG=* ./scripts/script.sh
```

## Integration

These scripts integrate with:
- Nx workspace for monorepo management
- GitHub Actions for CI/CD pipelines
- Docker for containerized deployments
- Vercel/Netlify for web deployments
- Expo for mobile deployments
