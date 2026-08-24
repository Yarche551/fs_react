# Freelance Studio

SPA для управления фрилансерами и заказами.

- **frontend** — React 19 + TypeScript + Redux Toolkit + React Router 7, сборка Vite, вёрстка AdminLTE 3
- **backend** — Node.js + Express + MongoDB (mongoose), JWT-авторизация, миграции через migrate-mongo

## Локальный запуск

Нужен запущенный MongoDB на `127.0.0.1:27017`.

```bash
# 1. база: зависимости и тестовые данные
cd backend
npm install
npm run migrate

# 2. API на http://localhost:3000
npm run dev

# 3. фронтенд на http://localhost:9001
cd ../frontend
npm install --ignore-scripts
npm run dev
```

Тестовый пользователь из миграций: `ekaterina.ivanova@gmail.com` / `Ek4tIv#702`.

> `--ignore-scripts` во фронтенде обязателен: пакет `admin-lte` тянет `summernote`,
> у которого в `prepare` прописан `husky install` — без флага установка падает.

## Переменные окружения

**backend** (см. `backend/.env.example`) — на Render задаются в дашборде:

| Переменная | Назначение |
|---|---|
| `DB_URL` | строка подключения MongoDB (Atlas) |
| `DB_NAME` | имя базы, по умолчанию `freelancers` |
| `SECRET` | секрет для подписи JWT |
| `PORT` | порт (Render подставляет сам) |
| `CORS_ORIGIN` | домен фронтенда; если не задан — CORS открыт |

**frontend** (см. `frontend/.env.example`) — подставляется **на этапе сборки**:

| Переменная | Назначение |
|---|---|
| `VITE_API_HOST` | адрес API, например `https://freelance-studio-api.onrender.com` |

## Деплой на Render

В корне лежит `render.yaml` — Blueprint на два сервиса. Порядок:

1. **MongoDB Atlas**: создать кластер M0, пользователя базы, в Network Access разрешить `0.0.0.0/0`
   (у Render на free-плане нет статических IP), скопировать connection string.
2. **Миграции** — прогнать один раз против Atlas локально:
   ```bash
   cd backend
   DB_URL="mongodb+srv://user:pass@cluster.mongodb.net" DB_NAME=freelancers npm run migrate
   ```
3. **Render → New → Blueprint**, выбрать репозиторий. Поднимутся два сервиса:
   - `freelance-studio-api` — Web Service, root `backend`, `npm ci` + `npm start`
   - `freelance-studio-web` — Static Site, root `frontend`, публикует `dist`, с SPA-rewrite на `index.html`
4. Заполнить переменные с `sync: false`:
   - у API — `DB_URL`;
   - у фронтенда — `VITE_API_HOST` (URL API-сервиса), затем **Clear build cache & deploy**,
     потому что переменная вшивается в бандл при сборке;
   - у API — `CORS_ORIGIN` (URL статики), после чего перезапустить сервис.

### Что важно помнить про прод

- **Загруженные аватары не переживают редеплой.** `FileUtils.generateAndSavePublicImage` пишет файлы
  в `backend/public/images/freelancers/avatars/`, а файловая система Render эфемерная: при рестарте
  или новом деплое всё, что не в git, пропадает. Варианты: подключить Render Disk (платный план)
  либо перенести загрузку в S3/Cloudinary.
- **Free-план засыпает** после 15 минут простоя — первый запрос после сна ждёт ~30–60 секунд.
- **Смена `SECRET`** инвалидирует все выданные токены: пользователям придётся залогиниться заново.
