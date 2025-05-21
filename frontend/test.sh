#!/bin/bash

docker run -it --rm \
  --init \
  --ipc=host \
  --cap-add=SYS_ADMIN \
  -v $(pwd):/tests \
  -w /tests \
  mcr.microsoft.com/playwright:v1.52.0-noble \
  npx playwright test
