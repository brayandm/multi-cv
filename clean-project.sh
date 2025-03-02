#!/bin/bash

set -e

REMOVE_VOLUMES=false

while getopts "v" opt; do
  case $opt in
    v)
      REMOVE_VOLUMES=true
      ;;
    *)
      echo "Usage: $0 [-v] (optional: remove Docker volumes)"
      exit 1
      ;;
  esac
done

echo "🚀 Cleaning up project... 🚀"

echo "Removing Git hooks..."
rm -rf .git/hooks/*

echo "Removing docker network..."
docker network rm multi-cv-local > /dev/null 2>&1 || true

pushd backend/ > /dev/null

echo "Removing composer dependencies..."
rm -rf vendor

echo "Removing backend .env file..."
rm -f .env

echo "Stopping and removing backend containers..."
if [ "$REMOVE_VOLUMES" = true ]; then
  echo "Removing Docker volumes for backend..."
  docker compose down -v > /dev/null 2>&1
else
  docker compose down > /dev/null 2>&1
fi

popd > /dev/null


pushd frontend/ > /dev/null

echo "Removing npm dependencies..."
rm -rf node_modules .next

echo "Removing frontend .env file..."
rm -f .env

echo "Stopping and removing frontend containers..."
if [ "$REMOVE_VOLUMES" = true ]; then
  echo "Removing Docker volumes for frontend..."
  docker compose down -v > /dev/null 2>&1
else
  docker compose down > /dev/null 2>&1
fi

popd > /dev/null

echo "🚀 Project is cleaned! 🚀"