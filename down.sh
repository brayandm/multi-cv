#!/bin/bash

set -e

pushd engine/
docker compose down --remove-orphans
popd

pushd backend/
docker compose down --remove-orphans
popd

pushd frontend/
docker compose down --remove-orphans
popd