#!/bin/bash

set -e

docker run --rm --name multi-cv-backend-testing multi-cv-backend:latest sh -c "php artisan test"