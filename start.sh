#!/bin/sh
set -e

# Source backend .env file
if [ -f /app/backend/.env ]; then
  export $(cat /app/backend/.env | sed 's/#.*//g' | xargs)
fi

# Start backend with Gunicorn + UvicornWorker (for FastAPI/ASGI)
cd /app/backend
/app/backend/venv/bin/gunicorn --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001 server:app &

# Start frontend (serve is already installed globally)
cd /app/frontend
serve -s build -l 3000
