"""
test_catalog.py — тесты CatalogStore.

Данные (список машин, ITEMS_PER_PAGE) читаются напрямую из:
  src/data/cars.js          — массив автомобилей
  src/store/useCatalogStore.js — константа ITEMS_PER_PAGE

Тесты не хранят моковые данные вручную: всё берётся из реальных JSX-исходников.
"""


import pytest
from src.catalog import CatalogStore
from src.jsx_parser import parse_cars, parse_items_per_page, parse_categories


# ── Фикстуры ──────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def jsx_cars():
    """Список машин из data/cars.js."""
    return parse_cars()


@pytest.fixture(scope="module")
def jsx_items_per_page():
    """ITEMS_PER_PAGE из useCatalogStore.js."""
    return parse_items_per_page()


@pytest.fixture(scope="module")
def jsx_categories():
    """CATEGORIES из Catalog.jsx (без «Все»)."""
    cats = parse_categories()
    return [c for c in cats if c != "Все"]


@pytest.fixture
def store(jsx_cars, jsx_items_per_page):
    """Свежий CatalogStore с данными из JSX перед каждым тестом."""
    return CatalogStore(cars=jsx_cars, items_per_page=jsx_items_per_page)


# ── Проверка парсинга JSX-данных ──────────────────────────────────────────────

class TestJSXDataParsing:

    def test_cars_loaded_from_cars_js(self, jsx_cars):
        """data/cars.js содержит хотя бы один автомобиль."""
        assert len(jsx_cars) > 0, "data/cars.js вернул пустой список"

    def test_each_car_has_required_fields(self, jsx_cars):
        """Каждый объект в cars.js имеет обязательные поля."""
        required = {"id", "brand", "model", "category", "price"}
        for car in jsx_cars:
            missing = required - car.keys()
            assert not missing, f"Машина {car.get('brand')} не имеет полей: {missing}"

    def test_items_per_page_is_positive_int(self, jsx_items_per_page):
        """ITEMS_PER_PAGE из useCatalogStore.js — положительное целое."""
        assert isinstance(jsx_items_per_page, int)
        assert jsx_items_per_page > 0

    def test_categories_loaded_from_catalog_jsx(self, jsx_categories):
        """CATEGORIES из Catalog.jsx содержит хотя бы одну категорию."""
        assert len(jsx_categories) > 0

    def test_all_car_categories_match_catalog_jsx(self, jsx_cars, jsx_categories):
        """Каждая категория машины из cars.js присутствует в CATEGORIES Catalog.jsx."""
        all_categories = set(jsx_categories) | {"Все"}
        for car in jsx_cars:
            assert car["category"] in all_categories, (
                f"Машина {car['brand']} имеет категорию '{car['category']}', "
                f"которой нет в CATEGORIES: {jsx_categories}"
            )


# ── get_filtered_cars ──────────────────────────────────────────────────────────

class TestGetFilteredCars:

    def test_returns_all_cars_when_category_is_all(self, store, jsx_cars):
        """При категории 'Все' возвращаются все машины из cars.js."""
        filtered = store.get_filtered_cars()
        assert len(filtered) == len(jsx_cars)

    def test_filters_by_each_category_from_catalog_jsx(self, store, jsx_cars, jsx_categories):
        """Фильтрация работает для каждой категории из CATEGORIES Catalog.jsx."""
        for cat in jsx_categories:
            store.set_category(cat)
            filtered = store.get_filtered_cars()
            expected_count = sum(1 for c in jsx_cars if c["category"] == cat)
            assert len(filtered) == expected_count, (
                f"Категория '{cat}': ожидалось {expected_count}, получено {len(filtered)}"
            )
            assert all(c["category"] == cat for c in filtered)

    def test_returns_empty_for_unknown_category(self, store):
        """Несуществующая категория возвращает пустой список."""
        store.set_category("НесуществующаяКатегория")
        assert store.get_filtered_cars() == []

    def test_filtered_cars_are_subset_of_all_cars(self, store, jsx_cars, jsx_categories):
        """Отфильтрованные машины — подмножество полного списка из cars.js."""
        for cat in jsx_categories:
            store.set_category(cat)
            filtered = store.get_filtered_cars()
            for car in filtered:
                assert car in jsx_cars


# ── set_category ───────────────────────────────────────────────────────────────

class TestSetCategory:

    def test_resets_page_to_1_on_category_change(self, store, jsx_categories):
        """set_category сбрасывает currentPage на 1 — как в useCatalogStore.js."""
        store.set_page(5)
        store.set_category(jsx_categories[0])
        assert store.current_page == 1

    def test_updates_active_category(self, store, jsx_categories):
        """active_category обновляется до нового значения."""
        store.set_category(jsx_categories[0])
        assert store.active_category == jsx_categories[0]

    def test_category_all_shows_full_catalog(self, store, jsx_cars):
        """После смены на другую и обратно на 'Все' — возвращаются все машины."""
        store.set_category("Грузовые")
        store.set_category("Все")
        assert len(store.get_filtered_cars()) == len(jsx_cars)


# ── get_total_pages ────────────────────────────────────────────────────────────

class TestGetTotalPages:

    def test_total_pages_with_real_items_per_page(self, store, jsx_cars, jsx_items_per_page):
        """Количество страниц рассчитывается на основе ITEMS_PER_PAGE из useCatalogStore.js."""
        import math
        expected = math.ceil(len(jsx_cars) / jsx_items_per_page)
        assert store.get_total_pages() == expected

    def test_returns_0_for_empty_category(self, store):
        """Нет машин — нет страниц."""
        store.set_category("НесуществующаяКатегория")
        assert store.get_total_pages() == 0

    def test_single_page_if_cars_fit(self, jsx_cars):
        """Если items_per_page >= числа машин — одна страница."""
        store = CatalogStore(cars=jsx_cars, items_per_page=len(jsx_cars) + 10)
        assert store.get_total_pages() == 1

    def test_ceiling_division(self, jsx_cars):
        """Потолочное деление: одна лишняя машина = новая страница."""
        store = CatalogStore(cars=jsx_cars, items_per_page=len(jsx_cars) - 1)
        assert store.get_total_pages() == 2


# ── get_current_cars ───────────────────────────────────────────────────────────

class TestGetCurrentCars:

    def test_first_page_starts_from_first_car(self, jsx_cars):
        """Первая страница начинается с первого автомобиля из cars.js."""
        store = CatalogStore(cars=jsx_cars, items_per_page=2)
        store.set_page(1)
        current = store.get_current_cars()
        assert current[0]["id"] == jsx_cars[0]["id"]

    def test_second_page_offset_correct(self, jsx_cars):
        """Вторая страница начинается с items_per_page+1 элемента."""
        ipp = 2
        store = CatalogStore(cars=jsx_cars, items_per_page=ipp)
        store.set_page(2)
        current = store.get_current_cars()
        assert current[0]["id"] == jsx_cars[ipp]["id"]

    def test_current_cars_not_exceed_items_per_page(self, store, jsx_items_per_page):
        """Количество машин на странице не превышает ITEMS_PER_PAGE."""
        current = store.get_current_cars()
        assert len(current) <= jsx_items_per_page

    def test_current_cars_respect_active_filter(self, store, jsx_categories):
        """Машины на странице соответствуют активному фильтру."""
        cat = jsx_categories[0]
        store.set_category(cat)
        for car in store.get_current_cars():
            assert car["category"] == cat
