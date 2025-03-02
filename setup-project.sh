#!/bin/bash

set -e


docker network create multi-cv-local || true


pushd backend/

# Install composer dependencies
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/var/www/html \
    -w /var/www/html \
    brayand/fullstack-project-template-composer:1.0.0 \
    composer install --ignore-platform-reqs

# Copy .env file
cp .env.local .env

docker compose up -d

popd


pushd frontend/

# Install npm dependencies
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/usr/src/app \
    -w /usr/src/app \
    brayand/fullstack-project-template-node:1.0.0 \
    npm install

# Copy .env file
cp .env.local .env

docker compose up -d

popd


pushd backend/

echo "Waiting for MySQL to be ready..."
CONTAINER_NAME="backend-backend-1" 
DB_USER="admin"
DB_PASSWORD="password"
DB_NAME="multicv"
DB_HOST="mysql"
DB_PORT="3306"

until docker exec "$CONTAINER_NAME" mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" &>/dev/null; do
    echo "MySQL is not ready yet; sleeping..."
    sleep 5
done

echo "✅ MySQL is ready!"

docker compose exec backend php artisan migrate

docker compose exec backend php artisan storage:link

popd