# ==============================================================================
# Dockerfile untuk Deploy Laravel + React (Inertia.js) di Railway
# dengan MySQL 8.4 (caching_sha2_password support via mysqlnd)
#
# Skripsi: Hybrid Chatbot Pelayanan Akademik UNISKA MAB
# ==============================================================================

# --- Stage 1: Build stage (PHP + Node.js) ---
FROM php:8.4-cli AS builder

# Install system dependencies + Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    unzip \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (EKSPLISIT mysqlnd untuk MySQL 8.4 caching_sha2_password)
RUN docker-php-ext-configure pdo_mysql --with-pdo-mysql=mysqlnd \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        gd \
        zip \
        xml \
        bcmath \
        curl \
        mbstring

# Verifikasi mysqlnd aktif
RUN php -r "if (!extension_loaded('mysqlnd')) { echo 'ERROR: mysqlnd NOT LOADED'; exit(1); }" \
    && php -r "echo 'mysqlnd OK. PDO drivers: ' . implode(', ', PDO::getAvailableDrivers()) . PHP_EOL;"

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Install Node dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy full source code
COPY . .

# Generate autoload & build frontend (wayfinder butuh PHP + Node bersamaan)
RUN composer dump-autoload --optimize
RUN npm run build

# --- Stage 2: Final production image (ringan) ---
FROM php:8.4-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng16-16t64 \
    libjpeg62-turbo \
    libfreetype6 \
    libzip4t64 \
    libxml2 \
    libcurl4t64 \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (sama seperti builder)
RUN docker-php-ext-configure pdo_mysql --with-pdo-mysql=mysqlnd \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        gd \
        zip \
        xml \
        bcmath \
        curl \
        mbstring

# Konfigurasi PHP untuk MySQL 8.4
RUN echo "mysqlnd.sha256_server_public_key=" > /usr/local/etc/php/conf.d/mysql-auth.ini \
    && echo "pdo_mysql.default_socket=" >> /usr/local/etc/php/conf.d/mysql-auth.ini

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app /app

# Ensure directories exist with correct permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# Start command
CMD php artisan migrate --force \
    && php artisan db:seed --class=ChatRuleSeeder --force \
    && php artisan db:seed --class=AdminSeeder --force \
    && php artisan storage:link \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
