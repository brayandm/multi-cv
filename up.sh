#!/bin/bash

set -e

pushd engine/
docker compose up -d --force-recreate
popd

pushd backend/
docker compose up -d --force-recreate
popd

pushd frontend/
docker compose up -d --force-recreate
popd