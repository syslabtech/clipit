#!/bin/sh
set -e

# Start backend with Gunicorn (update 'server:app' if needed)
cd /app/backend
/app/backend/venv/bin/python -m gunicorn --bind 0.0.0.0:8000 server:app &

# Start frontend (serve is already installed globally)
cd /app/frontend
serve -s build -l 3000
