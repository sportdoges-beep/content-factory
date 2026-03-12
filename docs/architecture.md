# 🏗️ Архитектура Content Factory

## Высокоуровневая схема

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend │────▶│   Backend   │────▶│ PostgreSQL  │
│   (React)  │◀────│  (NestJS)   │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ Instagram   │
                   │   API       │
                   └─────────────┘
```

## Backend Архитектура (NestJS)

### Модули

```
backend/
├── src/
│   ├── auth/           # Аутентификация (JWT)
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── auth.controller.ts
│   │
│   ├── users/          # Пользователи
│   │   ├── entities/
│   │   ├── dto/
│   │   └── users.service.ts
│   │
│   ├── instagram/      # Instagram интеграция
│   │   ├── instagram.controller.ts
│   │   ├── instagram.service.ts
│   │   ├── instagram-api.service.ts
│   │   └── entities/
│   │
│   ├── accounts/       # Подключённые аккаунты
│   │   ├── entities/account.entity.ts
│   │   ├── accounts.service.ts
│   │   └── accounts.controller.ts
│   │
│   ├── content/        # Контент
│   │   ├── content.service.ts     # Скачивание
│   │   ├── processor.service.ts   # Обработка видео
│   │   ├── publisher.service.ts   # Публикация
│   │   └── scheduler/             # Планировщик
│   │
│   ├── jobs/           # Очередь задач (Bull)
│   │
│   └── config/         # Конфигурация
```

### База данных (PostgreSQL)

```sql
-- Users
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Instagram Accounts (дочерние)
instagram_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  username VARCHAR(255),
  access_token TEXT,
  account_id VARCHAR(255),
  status VARCHAR(50), -- active, paused, error
  created_at TIMESTAMP
)

-- Parent Accounts (источники контента)
parent_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  username VARCHAR(255),
  instagram_account_id UUID REFERENCES instagram_accounts(id),
  download_settings JSONB,
  processing_settings JSONB,
  schedule VARCHAR(100),
  is_active BOOLEAN
)

-- Content Items
content_items (
  id UUID PRIMARY KEY,
  parent_account_id UUID REFERENCES parent_accounts(id),
  media_url TEXT,
  media_type VARCHAR(50), -- video, image
  caption TEXT,
  processed_media_url TEXT,
  status VARCHAR(50), -- pending, processing, published, failed
  published_at TIMESTAMP,
  instagram_post_id VARCHAR(255),
  created_at TIMESTAMP
)
```

## Frontend Архитектура (React)

### Структура

```
frontend/
├── src/
│   ├── app/            # Redux store, RTK Query
│   │   ├── store.ts
│   │   └── api/       # RTK Query endpoints
│   │
│   ├── features/      # Фиче-папки
│   │   ├── auth/      # Авторизация
│   │   ├── accounts/  # Управление аккаунтами
│   │   ├── content/   # Контент
│   │   └── settings/  # Настройки
│   │
│   ├── components/     # Переиспользуемые компоненты
│   ├── pages/         # Страницы
│   ├── hooks/         # Кастомные хуки
│   └── utils/         # Утилиты
```

### Redux Store

```typescript
// store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    content: contentReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => 
    getDefault().concat(api.middleware),
});
```

## Поток данных

### 1. Создание аккаунта
```
User → Frontend → API /accounts → Save to DB → Return account
```

2. Подключение Instagram (OAuth)
```
User → Frontend → /auth/instagram → Instagram OAuth → Callback → Save token
```

3. Добавление родительского аккаунта
```
User → Select child account → Enter parent username → Save
```

4. Скачивание контента (по крону/триггеру)
```
Scheduler → Find active parent accounts → 
  Instagram API (media) → Download → Save to DB
```

5. Обработка видео
```
Job Queue → Get pending content → 
  FFmpeg (mask, mirror, text) → Upload to storage → Save URL
```

6. Публикация
```
Job Queue → Get processed content → 
  Instagram API (upload) → Save post ID → Mark published
```

## API Endpoints

### Auth
- `POST /auth/register` — Регистрация
- `POST /auth/login` — Вход
- `POST /auth/refresh` — Обновление токена

### Accounts
- `GET /accounts` — Список аккаунтов
- `POST /accounts` — Добавить аккаунт
- `DELETE /accounts/:id` — Удалить аккаунт
- `PATCH /accounts/:id` — Обновить аккаунт

### Parent Accounts
- `GET /parent-accounts` — Список родительских аккаунтов
- `POST /parent-accounts` — Добавить родительский аккаунт
- `PATCH /parent-accounts/:id` — Настройки (маска, зеркало, текст)

### Content
- `GET /content` — Список контента
- `POST /content/trigger-download` — Триггер скачивания
- `GET /content/:id/status` — Статус публикации

## Безопасность

1. JWT токены с refresh
2. Хранение токенов Instagram в зашифрованном виде
3. Rate limiting на API
4. Валидация на бэкенде (class-validator)

## Планировщик

Используется Bull/Redis для очереди задач:
- `content:download` — скачивание
- `content:process` — обработка видео
- `content:publish` — публикация

Cron: каждый день в 00:00 (или настраивается)
