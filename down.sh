#!/bin/bash

set -e

pushd engine/
docker compose down --remove-orphans &
engine_pid=$!
popd

pushd backend/
docker compose down --remove-orphans &
backend_pid=$!
popd

pushd frontend/
docker compose down --remove-orphans &
frontend_pid=$!
popd

wait $engine_pid
wait $backend_pid
wait $frontend_pid
