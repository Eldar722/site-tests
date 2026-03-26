"""
jsx_parser.py — читает JSX/JS файлы проекта Electrovan и извлекает
бизнес-логику в виде Python-объектов, чтобы тесты работали с реальными
исходниками, а не с копиями данных.
"""

import re
import json
import pathlib
from typing import Any

# Путь до фронтенда — ищем относительно этого файла или через ENV
_HERE = pathlib.Path(__file__).resolve().parent  # project/src/
_PROJECT_ROOT = _HERE.parent                      # project/
_REPO_ROOT = _PROJECT_ROOT.parent                 # корень репозитория site-tests/

_FRONTEND_CANDIDATES = [
    # Основной: electrovan-app/ рядом с project/ в одном репо (ваша структура)
    _REPO_ROOT / "electrovan-app" / "src",
    # Запасные для локальной разработки
    _REPO_ROOT / "electrovan_master" / "Electrovan-master" / "electrovan-app" / "src",
    _REPO_ROOT / "Electrovan-master" / "electrovan-app" / "src",
    _PROJECT_ROOT / "Electrovan-master" / "electrovan-app" / "src",
]

def _find_frontend_src() -> pathlib.Path:
    for candidate in _FRONTEND_CANDIDATES:
        if candidate.exists():
            return candidate.resolve()
    raise FileNotFoundError(
        "Не найдена папка src/ проекта Electrovan. "
        "Убедитесь, что Electrovan-master.zip распакован рядом с проектом.\n"
        f"Искали в: {[str(c) for c in _FRONTEND_CANDIDATES]}"
    )

FRONTEND_SRC = _find_frontend_src()


def read_file(relative_path: str) -> str:
    """Читает файл из src/ фронтенда."""
    path = FRONTEND_SRC / relative_path
    if not path.exists():
        raise FileNotFoundError(f"Файл не найден: {path}")
    return path.read_text(encoding="utf-8")


# ─────────────────────────────────────────────────────────────────────────────
# cars.js
# ─────────────────────────────────────────────────────────────────────────────

def parse_cars() -> list:
    """
    Парсит data/cars.js и возвращает список машин как Python-словари.
    Поддерживает: JS-комментарии (// и /* */), любые image-переменные,
    новые поля (fullPrice, usedIn, dimensions, volume, capacity и др.),
    произвольное количество машин.
    """
    source = read_file("data/cars.js")

    # 1. Убираем import-строки (одинарные и двойные кавычки)
    source = re.sub(r"import\s+\w+\s+from\s+'[^']+';?\n?", "", source)
    source = re.sub(r'import\s+\w+\s+from\s+"[^"]+";?\n?', "", source)

    # 2. Заменяем ВСЕ JS-переменные-картинки (camelCase с суффиксом Img/Bg/Icon)
    source = re.sub(
        r'\b([a-z][a-zA-Z0-9]*(?:Img|Bg|Icon|Image|Photo|Pic))\b',
        '"<image>"',
        source
    )

    # 3. Удаляем однострочные JS-комментарии: // ===== Geely =====
    source = re.sub(r"//[^\n]*", "", source)

    # 4. Удаляем многострочные JS-комментарии: /* ... */
    source = re.sub(r"/\*[\s\S]*?\*/", "", source)

    # 5. Извлекаем массив cars = [ ... ]
    m = re.search(r"export\s+const\s+cars\s*=\s*(\[[\s\S]+?\])\s*;", source)
    if not m:
        raise ValueError("Не удалось найти 'export const cars = [...]' в data/cars.js")

    array_str = m.group(1)

    # 6. Ключи без кавычек → с кавычками: brand: → "brand":
    array_str = re.sub(r'([{,\[]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:', r'\1"\2":', array_str)

    # 7. Одиночные кавычки → двойные
    array_str = re.sub(r"'([^']*)'", r'"\1"', array_str)

    # 8. Убираем trailing commas: ,} и ,]
    array_str = re.sub(r",(\s*[}\]])", r"\1", array_str)

    try:
        return json.loads(array_str)
    except json.JSONDecodeError as e:
        context = array_str[max(0, e.pos - 60): e.pos + 60]
        raise ValueError(
            f"Ошибка парсинга cars.js: {e.msg} (позиция {e.pos})\n"
            f"Контекст: {repr(context)}"
        )


# ─────────────────────────────────────────────────────────────────────────────
# useCatalogStore.js
# ─────────────────────────────────────────────────────────────────────────────

def parse_items_per_page() -> int:
    """Читает ITEMS_PER_PAGE из useCatalogStore.js."""
    source = read_file("store/useCatalogStore.js")
    m = re.search(r"const\s+ITEMS_PER_PAGE\s*=\s*(\d+)", source)
    if not m:
        raise ValueError("ITEMS_PER_PAGE не найден в useCatalogStore.js")
    return int(m.group(1))


def parse_categories() -> list[str]:
    """Читает список категорий из Catalog.jsx."""
    source = read_file("sections/Catalog.jsx")
    m = re.search(r"const\s+CATEGORIES\s*=\s*\[([^\]]+)\]", source)
    if not m:
        raise ValueError("CATEGORIES не найден в Catalog.jsx")
    raw = m.group(1)
    return re.findall(r"'([^']+)'", raw)


# ─────────────────────────────────────────────────────────────────────────────
# Paginator.jsx  — логика getPages()
# ─────────────────────────────────────────────────────────────────────────────

def parse_paginator_rule() -> dict:
    """
    Читает Paginator.jsx и возвращает словарь с правилами отображения страниц:
      - window: int  (сколько страниц показывать вокруг текущей, ±N)
      - always_first: bool
      - always_last: bool

    Из кода:
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1))
    → window = 1, always_first = True, always_last = True
    """
    source = read_file("components/Paginator.jsx")

    # Ищем условие внутри getPages
    m = re.search(
        r"i\s*>=\s*currentPage\s*-\s*(\d+)\s*&&\s*i\s*<=\s*currentPage\s*\+\s*(\d+)",
        source
    )
    left  = int(m.group(1)) if m else 1
    right = int(m.group(2)) if m else 1

    always_first = bool(re.search(r"i\s*===\s*1", source))
    always_last  = bool(re.search(r"i\s*===\s*totalPages", source))

    return {
        "window_left":  left,
        "window_right": right,
        "always_first": always_first,
        "always_last":  always_last,
    }


def get_page_numbers_from_jsx(total_pages: int, current_page: int) -> list[int | str]:
    """
    Воспроизводит логику getPages() из Paginator.jsx на Python,
    используя правила, прочитанные из реального JSX-файла.
    """
    rule = parse_paginator_rule()
    if total_pages <= 0:
        return []

    visible: list[int] = []
    for i in range(1, total_pages + 1):
        include = False
        if rule["always_first"] and i == 1:
            include = True
        if rule["always_last"] and i == total_pages:
            include = True
        if current_page - rule["window_left"] <= i <= current_page + rule["window_right"]:
            include = True
        if include:
            visible.append(i)

    result: list[int | str] = []
    for idx, page in enumerate(visible):
        if idx > 0 and page - visible[idx - 1] > 1:
            result.append("...")
        result.append(page)

    return result


# ─────────────────────────────────────────────────────────────────────────────
# CTAmodal.jsx  — паттерн валидации телефона
# ─────────────────────────────────────────────────────────────────────────────

def parse_phone_pattern() -> str:
    """
    Читает CTAmodal.jsx и возвращает строку-регулярку из атрибута pattern=...
    у поля ввода телефона.
    """
    source = read_file("components/CTAmodal.jsx")
    m = re.search(r'pattern="([^"]+)"', source)
    if not m:
        raise ValueError("Атрибут pattern не найден в CTAmodal.jsx")
    return m.group(1)


def validate_phone_from_jsx(phone: str) -> bool:
    """
    Валидирует номер телефона по pattern из CTAmodal.jsx.
    HTML-атрибут pattern неявно оборачивается в ^...$
    """
    pattern = parse_phone_pattern()
    return bool(re.fullmatch(pattern, phone.strip()))
