"""
catalog.py — CatalogStore на Python.
Данные и константы берутся напрямую из JSX/JS исходников через jsx_parser.
"""

import math
from src.jsx_parser import parse_cars, parse_items_per_page


class CatalogStore:
    """
    Хранилище каталога: фильтрация по категории и пагинация.
    Воспроизводит логику useCatalogStore.js (Zustand).

    Данные (список машин, ITEMS_PER_PAGE) читаются из реальных
    JS-файлов фронтенда через jsx_parser.
    """

    def __init__(self, cars: list | None = None, items_per_page: int | None = None):
        # Если данные не переданы явно — берём из JSX-исходников
        self._cars = cars if cars is not None else parse_cars()
        self.items_per_page = items_per_page if items_per_page is not None else parse_items_per_page()
        self.active_category = "Все"
        self.current_page = 1

    # ── Фильтрация ─────────────────────────────────────────────────────────

    def set_category(self, category: str) -> None:
        """Сменить активную категорию и сбросить пагинацию на 1."""
        self.active_category = category
        self.current_page = 1

    def get_filtered_cars(self) -> list:
        """Вернуть список машин по активной категории."""
        if self.active_category == "Все":
            return self._cars
        return [c for c in self._cars if c["category"] == self.active_category]

    # ── Пагинация ──────────────────────────────────────────────────────────

    def set_page(self, page: int) -> None:
        self.current_page = page

    def get_total_pages(self) -> int:
        filtered = self.get_filtered_cars()
        if not filtered:
            return 0
        return math.ceil(len(filtered) / self.items_per_page)

    def get_current_cars(self) -> list:
        filtered = self.get_filtered_cars()
        start = (self.current_page - 1) * self.items_per_page
        return filtered[start: start + self.items_per_page]
