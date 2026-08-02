#!/bin/sh
set -e

# Always ensure database directory and local sqlite file exist with full write permissions
mkdir -p database storage/framework/views storage/framework/sessions storage/framework/cache storage/logs bootstrap/cache
touch database/database.sqlite
chmod -R 777 database storage bootstrap/cache || true

echo "Checking and executing database migrations..."
php artisan migrate --force || echo "Warning: Migration command completed with status $?"

echo "Starting application server on port ${PORT:-10000}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
