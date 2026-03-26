# Electrovan — Python Tests (JSX-linked)

Тесты написаны на Python, но **работают с реальными JSX/JS исходниками** проекта Electrovan.

## Как это работает

```
Electrovan-master/
└── electrovan-app/src/
    ├── data/cars.js              ← список машин
    ├── store/useCatalogStore.js  ← ITEMS_PER_PAGE
    ├── components/CTAmodal.jsx   ← pattern валидации телефона
    ├── components/Paginator.jsx  ← логика getPages()
    └── sections/Catalog.jsx      ← список CATEGORIES

electrovan-python-tests/          ← этот репозиторий
└── src/
    ├── jsx_parser.py  ← читает и парсит JSX/JS файлы
    ├── catalog.py     ← CatalogStore (данные из cars.js)
    ├── paginator.py   ← get_page_numbers (правила из Paginator.jsx)
    └── forms.py       ← validate_phone (pattern из CTAmodal.jsx)
```

Модуль `jsx_parser.py` парсит JSX/JS файлы и извлекает:
- **Список машин** из `data/cars.js` → используется в `CatalogStore`
- **`ITEMS_PER_PAGE`** из `useCatalogStore.js` → размер страницы
- **`CATEGORIES`** из `Catalog.jsx` → для тестов фильтрации  
- **`pattern`** из `CTAmodal.jsx` → для валидации телефона
- **Правила `getPages()`** из `Paginator.jsx` → окно ±N страниц

Если вы меняете логику в JSX — тесты автоматически это проверят.

## Структура проекта

```
├── src/
│   ├── jsx_parser.py   # парсинг JSX/JS файлов
│   ├── catalog.py      # CatalogStore
│   ├── paginator.py    # логика пагинатора
│   ├── forms.py        # валидация формы
│   └── cars.py         # заглушка (данные теперь в jsx_parser)
├── tests/
│   ├── test_catalog.py
│   ├── test_paginator.py
│   └── test_forms.py
└── .github/workflows/ci.yml
```

## Запуск

### 1. Расположите папки рядом

```
workspace/
├── Electrovan-master/          # frontend (распакуйте Electrovan-master.zip)
└── electrovan-python-tests/    # этот репозиторий
```

### 2. Установите зависимости

```bash
pip install pytest pytest-cov
```

### 3. Запустите тесты

```bash
cd electrovan-python-tests
pytest -v
```

### 4. С отчётом покрытия

```bash
pytest --cov=src --cov-report=term-missing
```

## Что тестируется

| Файл теста | JSX-источник | Что проверяется |
|---|---|---|
| `test_catalog.py` | `data/cars.js`, `useCatalogStore.js`, `Catalog.jsx` | Фильтрация, пагинация, данные машин |
| `test_forms.py` | `components/CTAmodal.jsx` | Паттерн телефона, валидация формы |
| `test_paginator.py` | `components/Paginator.jsx` | Логика getPages(), навигация |
