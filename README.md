# 📱 Content Factory — Система автопостинга в Instagram

Монорепозиторий для автоматизации контента в Instagram.

## Стек

### Frontend
- React 18
- Redux Toolkit + RTK Query
- Redux Persist
- Ant Design 5
- TypeScript

### Backend
- NestJS
- TypeORM
- PostgreSQL
- TypeScript

## Функционал

1. **Авторизация**
   - Регистрация
   - Вход

2. **Управление аккаунтами**
   - Подключение Instagram аккаунтов
   - Указание родительского аккаунта (источник контента)
   - Множественные дочерние аккаунты

3. **Автоматизация**
   - Скачивание контента из родительского аккаунта
   - Обработка видео (маска, зеркало, текст)
   - Автопубликация

## Архитектура

```
content-factory/
├── frontend/          # React приложение
├── backend/          # NestJS API
├── docs/             # Документация
└── shared/           # Общие типы
```

## Быстрый старт

### Требования
- Node.js 20+
- PostgreSQL 15+
- Docker (опционально)

### Установка

```bash
# Клонирование
git clone https://github.com/sportdoges-beep/content-factory.git
cd content-factory

# Установка зависимостей
cd frontend && npm install
cd ../backend && npm install

# Запуск
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev
```

## Окружение

См. `.env.example` для настройки переменных окружения.

## API

См. `/docs/api.md` для документации API.
