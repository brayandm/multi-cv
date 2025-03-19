#!/bin/bash

set -e

pushd engine/
docker compose up -d --force-recreate &
engine_pid=$!
popd

pushd backend/
docker compose up -d --force-recreate &
backend_pid=$!
popd

pushd frontend/
docker compose up -d --force-recreate &
frontend_pid=$!
popd

wait $engine_pid
wait $backend_pid
wait $frontend_pid
