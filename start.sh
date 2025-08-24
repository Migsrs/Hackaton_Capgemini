#!/bin/sh
set -e

. .venv/bin/activate

http-server . -p ${STATIC_PORT:-8080} -a 0.0.0.0 &
node ./src/server.js
python ./mcptools/main.py

wait -n