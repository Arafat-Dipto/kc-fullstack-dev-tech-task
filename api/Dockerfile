FROM php:8.1-apache

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq-dev \
    libzip-dev && \
    docker-php-ext-install pdo pdo_mysql zip && \
    a2enmod rewrite

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html