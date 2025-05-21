#!/bin/bash

ENV_FILE=".env.e2e"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: File $ENV_FILE not found!"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

docker run --rm \
  --init \
  --ipc=host \
  --cap-add=SYS_ADMIN \
  -e BASE_URL="$BASE_URL" \
  -e USER_TEST_EMAIL="$USER_TEST_EMAIL" \
  -e USER_TEST_PASSWORD="$USER_TEST_PASSWORD" \
  -v $(pwd):/tests \
  -v $(pwd)/playwright-report:/tests/playwright-report \
  -w /tests \
  mcr.microsoft.com/playwright:v1.52.0-noble \
  npx playwright test