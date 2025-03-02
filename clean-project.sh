#!/bin/bash

set -e

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
docker compose down -v > /dev/null 2>&1

popd > /dev/null


pushd frontend/ > /dev/null

echo "Removing npm dependencies..."
rm -rf node_modules .next

echo "Removing frontend .env file..."
rm -f .env

echo "Stopping and removing frontend containers..."
docker compose down -v > /dev/null 2>&1

popd > /dev/null

echo "🚀 Project is cleaned"