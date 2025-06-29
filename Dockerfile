# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend-build
ENV NODE_ENV=production
RUN npm install -g npm@latest serve
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN yarn install --non-interactive --no-progress --production || true
COPY frontend .
RUN yarn build && yarn cache clean

FROM python:3.11-alpine AS backend-build
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN python -m venv /app/backend/venv \
    && . /app/backend/venv/bin/activate \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install gunicorn \
    && find /app/backend/venv -name '*.pyc' -delete
COPY backend .

FROM node:22-alpine AS runner
ENV NODE_ENV=production
RUN npm install -g serve
WORKDIR /app
COPY --from=frontend-build /app/frontend/build ./frontend/build
COPY --from=backend-build /app/backend ./backend
COPY start.sh ./start.sh
RUN addgroup -g 10001 appuser && adduser -D -u 10001 -G appuser appuser \
    && chmod +x ./start.sh \
    && chown -R appuser:appuser /app
USER 10001
EXPOSE 3000
CMD ["./start.sh"]
