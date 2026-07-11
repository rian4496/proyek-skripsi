# ==============================================================================
# Dockerfile - Laravel + React + MySQL 8.4 (mysqlnd/caching_sha2_password)
# Skripsi: Hybrid Chatbot Pelayanan Akademik UNISKA MAB
# ==============================================================================

FROM php:8.4-cli

# Install system dependencies + Node.js 22
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

# Install PHP extensions (EKSPLISIT mysqlnd untuk MySQL 8.4)
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

# Build frontend + autoload
RUN composer dump-autoload --optimize
RUN npm run build

# Ensure directories exist
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# Start
CMD php artisan migrate --force \
    && php artisan db:seed --class=ChatRuleSeeder --force \
    && php artisan db:seed --class=AdminSeeder --force \
    && php artisan storage:link \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
