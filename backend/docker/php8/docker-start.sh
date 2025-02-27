#!/bin/bash

DB_USERNAME=$(grep '^DB_USERNAME=' /var/www/.env | cut -d'=' -f2 | tr -d '\r' | tr -d ' ')
DB_PASSWORD=$(grep '^DB_PASSWORD=' /var/www/.env | cut -d'=' -f2 | tr -d '\r' | tr -d ' ')

if [ ! -f /build-lock ]; then

  until mysql -hmysql -u"$DB_USERNAME" -p"$DB_PASSWORD" -e '\q' 2> /dev/null; do
    echo '#### Mysql is unavailable - sleeping'
    sleep 10
  done

  echo '#### Mysql is up - executing command'

  echo '#### Laravel - php artisan migrate'
  (cd /var/www && php artisan migrate --force)

  echo '#### Laravel - php artisan storage:link'
  (cd /var/www && php artisan storage:link)

  echo '#### Configuring the crontab'
  echo '*	*	*	*	*	(cd /var/www && php artisan schedule:run || true)' >> /etc/crontab

  touch /build-lock
else

  until mysql -hmysql -u"$DB_USERNAME" -p"$DB_PASSWORD" -e '\q' 2> /dev/null; do
    echo '#### Mysql is unavailable - sleeping'
    sleep 10
  done
  echo '#### Mysql is up - executing command'

fi

echo '#### Starting cron'
crontab /etc/crontab
service cron start

echo '#### Starting supervisor'
supervisord -c /etc/supervisor/supervisord.conf

echo '#### Starting laravel-worker'
supervisorctl reread
supervisorctl update
supervisorctl start laravel-worker:*

echo '#### Starting server'
mkdir -p /run/php
php-fpm8.1 -F --allow-to-run-as-root
