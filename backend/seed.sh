#!/bin/bash

docker compose exec backend php artisan migrate:fresh

docker compose exec backend php artisan db:seed
