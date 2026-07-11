# ==============================================================================
# Dockerfile untuk Deploy Laravel + React (Inertia.js) di Railway
# dengan MySQL 8.4 (caching_sha2_password support via mysqlnd)
#
# Skripsi: Hybrid Chatbot Pelayanan Akademik UNISKA MAB
# ==============================================================================

# --- Stage 1: Build frontend assets ---
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Install PHP dependencies ---
FROM composer:2 AS composer-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction
COPY . .
RUN composer dump-autoload --optimize

# --- Stage 3: Final production image ---
FROM php:8.4-cli

# Install system dependencies (TANPA libmysqlclient agar pdo_mysql pakai mysqlnd)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# KRITIS: Install pdo_mysql SECARA EKSPLISIT dengan mysqlnd (bukan libmysqlclient)
# mysqlnd mendukung caching_sha2_password yang dipakai MySQL 8.4
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

# Verifikasi mysqlnd aktif (build gagal jika tidak)
RUN php -r "if (!extension_loaded('mysqlnd')) { echo 'ERROR: mysqlnd NOT LOADED'; exit(1); }" \
    && php -r "echo 'mysqlnd OK. PDO drivers: ' . implode(', ', PDO::getAvailableDrivers()) . PHP_EOL;"

# Konfigurasi PHP untuk MySQL 8.4 caching_sha2_password
RUN echo "mysqlnd.sha256_server_public_key=" > /usr/local/etc/php/conf.d/mysql-auth.ini \
    && echo "pdo_mysql.default_socket=" >> /usr/local/etc/php/conf.d/mysql-auth.ini

WORKDIR /app

# Copy PHP dependencies from composer stage
COPY --from=composer-builder /app/vendor ./vendor

# Copy built frontend assets from node stage
COPY --from=frontend-builder /app/public/build ./public/build

# Copy application code
COPY . .

# Ensure storage and cache directories exist with correct permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# Start command: migrate, seed, then serve
CMD php artisan migrate --force \
    && php artisan db:seed --class=ChatRuleSeeder --force \
    && php artisan db:seed --class=AdminSeeder --force \
    && php artisan storage:link \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
