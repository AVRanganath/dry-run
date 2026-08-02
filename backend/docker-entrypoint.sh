#!/bin/sh
set -e

# Run migrations at container startup
echo "Checking and executing database migrations..."
if [ -n "$DATABASE_URL" ] || [ -n "$DB_URL" ] || [ "$DB_CONNECTION" = "pgsql" ] || [ "$DB_CONNECTION" = "mysql" ]; then
    echo "Running migrations on remote database..."
    php artisan migrate --force || echo "Warning: Migration failed or already up to date"
else
    # Fallback to local SQLite
    touch database/database.sqlite
    php artisan migrate --force || true
fi

# Ensure storage and cache permissions
chmod -R 777 storage bootstrap/cache || true

echo "Starting application server..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
