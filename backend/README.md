# Content Factory Backend

Instagram контент-фабрика - автоматизация публикации контента.

## Стек

- **NestJS** - Node.js фреймворк
- **TypeORM** - ORM для PostgreSQL
- **PostgreSQL** - База данных
- **FFmpeg** - Обработка видео

## Установка

```bash
cd backend
npm install
```

## Конфигурация

Скопируйте `.env.example` в `.env` и настройте:

```bash
cp .env.example .env
```

Настройте подключение к PostgreSQL и получите Instagram API ключи от [Meta for Developers](https://developers.facebook.com/).

## Запуск

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Документация

После запуска доступна по адресу: `http://localhost:4000/api/docs`

## Архитектура

```
src/
├── auth/           # Аутентификация (JWT)
├── users/          # Управление пользователями
├── instagram-accounts/  # Подключенные аккаунты
├── content-sources/      # Источники контента
├── tasks/         # Задачи (скачивание, обработка, публикация)
├── video-processing/     # Обработка видео и cron jobs
└── database/
    └── entities/  # Сущности TypeORM
```

## Cron Jobs

- `EVERY_DAY_AT_MIDNIGHT` - Ежедневное скачивание контента
- `EVERY_HOUR` - Обработка задач каждый час

## Основные функции

1. **Регистрация/Логин** - JWT аутентификация
2. **Подключение Instagram** - Управление аккаунтами
3. **Content Sources** - Указание родительских аккаунтов
4. **Автоматическое скачивание** - Ежедневно в полночь
5. **Обработка видео**:
   - Зеркаливание
   - Наложение маски
   - Добавление текста
   - Водяной знак
6. **Автопубликация** - Автоматическая публикация обработанного контента
