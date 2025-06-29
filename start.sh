#!/bin/sh
set -e

# Start backend
cd /app/backend && venv/bin/python server.py &

# Start frontend
cd /app/frontend && npm run start
