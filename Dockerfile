# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend-build
RUN npm install -g npm@latest
WORKDIR /app/frontend
COPY frontend/package.json ./
# yarn.lock not copied since it does not exist
RUN yarn install --non-interactive --no-progress || true
COPY frontend .
RUN yarn build

FROM python:3.11-alpine AS backend-build
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN python -m venv /app/backend/venv \
    && . /app/backend/venv/bin/activate \
    && pip install --no-cache-dir -r requirements.txt
COPY backend .

FROM node:22-alpine AS runner
RUN npm install -g npm@latest
WORKDIR /app
COPY --from=frontend-build /app/frontend/build ./frontend/build
COPY --from=frontend-build /app/frontend/.env ./frontend/.env
COPY --from=backend-build /app/backend ./backend
COPY --from=backend-build /app/backend/.env ./backend/.env
COPY start.sh ./start.sh
RUN addgroup -g 10001 appuser && adduser -D -u 10001 -G appuser appuser \
    && chmod +x ./start.sh
USER 10001
EXPOSE 3000
CMD ["./start.sh"]
