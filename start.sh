#!/bin/sh
set -e

# Start backend
cd /app/backend
. venv/bin/activate
python server.py &

# Start frontend
cd /app/frontend
npx serve -s build
