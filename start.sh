#!/bin/sh
set -e

# Start backend
cd /app/backend
/app/backend/venv/bin/python server.py &

# Start frontend
cd /app/frontend
npx serve -s build
