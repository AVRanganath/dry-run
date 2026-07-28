FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy existing application directory
COPY . /app

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Setup SQLite database
RUN touch database/database.sqlite
RUN php artisan migrate --force

# Expose port
EXPOSE 10000

# Start Laravel development server
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
