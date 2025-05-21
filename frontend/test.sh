#!/bin/bash

docker run -it --rm \
  --init \
  --ipc=host \
  --cap-add=SYS_ADMIN \
  -e BASE_URL=http://localhost:3000 \
  -v $(pwd):/tests \
  -w /tests \
  mcr.microsoft.com/playwright:v1.52.0-noble \
  npx playwright test

npx playwright show-report