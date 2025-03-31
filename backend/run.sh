#!/bin/bash

if [ $# -eq 0 ]; then
  echo "Usage: ./run.sh <artisan command>"
  echo "Example: ./run.sh make:migration CreateUsersTable"
  exit 1
fi

COMMAND="$@"

docker compose exec --user "$(id -u):$(id -g)" backend sh -c "$COMMAND"
