#!/bin/bash

set -e

echo "🚀 Stopping project... 🚀"

pushd backend/ > /dev/null

docker compose down -v > /dev/null 2>&1

popd > /dev/null


pushd frontend/ > /dev/null

docker compose down -v > /dev/null 2>&1

popd > /dev/null

echo "🚀 Project stopped! 🚀"