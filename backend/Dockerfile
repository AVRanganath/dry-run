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
    libsqlite3-dev \
    libpq-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions including PostgreSQL (pdo_pgsql)
RUN docker-php-ext-install pdo_mysql pdo_sqlite pdo_pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy existing application directory
COPY . /app

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Make entrypoint executable
RUN chmod +x /app/docker-entrypoint.sh

# Expose port
EXPOSE 10000

# Run entrypoint script
CMD ["/app/docker-entrypoint.sh"]
