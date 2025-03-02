#!/bin/bash

set -e

docker network create multi-cv-local

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

popd