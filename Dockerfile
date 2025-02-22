# Usamos PHP 8.2 con FPM
FROM php:8.2-fpm

# Instalamos las dependencias necesarias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    git \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_pgsql

# Instalamos Composer globalmente
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copiamos los archivos del proyecto dentro del contenedor
COPY . .

# Cambiamos la propiedad de los archivos para evitar problemas con Git y Composer
RUN chown -R www-data:www-data /var/www/html

# Ejecutamos Composer para instalar las dependencias (automáticamente)
RUN composer install --no-interaction --prefer-dist

# Exponemos el puerto 9000
EXPOSE 9000

# Comando para iniciar PHP-FPM
CMD ["php-fpm"]
