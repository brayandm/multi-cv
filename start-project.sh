#!/bin/bash

set -e

echo "🚀 Starting up project... 🚀"

echo "Copying Git hooks..."
cp .hooks/* .git/hooks/

echo "Creating docker network..."
docker network create multi-cv-local > /dev/null 2>&1 || true 


pushd backend/ > /dev/null

echo "Installing composer dependencies..."
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/var/www/html \
    -w /var/www/html \
    brayand/fullstack-project-template-composer:1.0.0 \
    composer install --ignore-platform-reqs > /dev/null 2>&1

echo "Copying backend .env file..."
cp .env.local .env

echo "Starting backend..."
docker compose up -d > /dev/null 2>&1

popd > /dev/null


pushd frontend/ > /dev/null

echo "Installing npm dependencies..."
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/usr/src/app \
    -w /usr/src/app \
    brayand/fullstack-project-template-node:1.0.0 \
    npm install > /dev/null 2>&1

echo "Copying frontend .env file..."
cp .env.local .env

echo "Starting frontend..."
docker compose up -d > /dev/null 2>&1

popd > /dev/null


pushd backend/ > /dev/null

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

echo "Running migrations..."
docker compose exec backend php artisan migrate > /dev/null 2>&1

echo "Creating symbolic link for storage..."
docker compose exec backend php artisan storage:link > /dev/null 2>&1 || true 

popd > /dev/null

echo "🚀 Project is ready! 🚀"