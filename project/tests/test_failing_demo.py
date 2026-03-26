"""
test_failing_demo.py — НАМЕРЕННО ПРОВАЛЬНЫЕ ТЕСТЫ.

Цель: убедиться, что CI/тестраннер правильно обнаруживает и репортит фейлы.
Каждый тест помечен XFAIL-комментарием и содержит описание того,
почему он должен упасть и какой именно вид ошибки ожидается.

ВАЖНО: эти тесты НЕ должны быть исправлены. Они существуют только как
       проверка работоспособности системы репортинга ошибок.
"""

import math
import pytest
from src.forms import validate_phone, submit_application, FormValidationError
from src.catalog import CatalogStore
from src.paginator import get_page_numbers, can_go_prev, can_go_next
from src.jsx_parser import parse_cars, parse_items_per_page


# ═══════════════════════════════════════════════════════════════════════════════
# БЛОК 1: Провальные тесты форм
# ═══════════════════════════════════════════════════════════════════════════════

class TestFormsFailing:
    """Намеренно неправильные тесты validate_phone и submit_application."""

    # ── Вид ошибки: AssertionError (неверное ожидание) ──────────────────────

    def test_FAIL_valid_phone_returns_false(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] validate_phone('+77001234567') должен вернуть True,
        но тест ожидает False → AssertionError.
        """
        result = validate_phone("+77001234567")
        assert result is False, "Этот тест намеренно проверяет неверный результат"

    def test_FAIL_empty_string_is_valid_phone(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Пустая строка — невалидный номер, но тест ждёт True
        → AssertionError.
        """
        assert validate_phone("") is True

    def test_FAIL_abc_passes_validation(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] 'abc' — заведомо неверный номер.
        Тест ошибочно ожидает успех → AssertionError.
        """
        assert validate_phone("abc") is True

    # ── Вид ошибки: неверное значение в возвращаемом словаре ────────────────

    def test_FAIL_submit_returns_wrong_name(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] submit_application возвращает name='Алия',
        но тест ищет 'Болат' → AssertionError.
        """
        result = submit_application("Алия", "+77001234567")
        assert result["name"] == "Болат"

    def test_FAIL_submit_success_is_false(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] 'success' должен быть True, тест проверяет False
        → AssertionError.
        """
        result = submit_application("Тест", "+77001234567")
        assert result["success"] is False

    # ── Вид ошибки: исключение не выброшено там, где ожидалось ──────────────

    def test_FAIL_valid_name_raises_error(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Корректные данные НЕ вызывают FormValidationError,
        но pytest.raises ждёт исключения → Failed (DID NOT RAISE).
        """
        with pytest.raises(FormValidationError):
            submit_application("Нормальное Имя", "+77001234567")

    # ── Вид ошибки: неправильный тип ────────────────────────────────────────

    def test_FAIL_validate_phone_returns_string(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] validate_phone возвращает bool, тест ждёт str
        → AssertionError.
        """
        result = validate_phone("+77001234567")
        assert isinstance(result, str), f"Получено {type(result)}, ожидалось str"


# ═══════════════════════════════════════════════════════════════════════════════
# БЛОК 2: Провальные тесты каталога
# ═══════════════════════════════════════════════════════════════════════════════

class TestCatalogFailing:
    """Намеренно неправильные тесты CatalogStore."""

    @pytest.fixture
    def store(self):
        cars = parse_cars()
        ipp = parse_items_per_page()
        return CatalogStore(cars=cars, items_per_page=ipp)

    @pytest.fixture
    def all_cars(self):
        return parse_cars()

    # ── Вид ошибки: неверный подсчёт страниц ────────────────────────────────

    def test_FAIL_total_pages_is_always_1(self, store, all_cars):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] get_total_pages() возвращает реальное число страниц,
        тест ошибочно ожидает всегда 1 → AssertionError (если машин > ITEMS_PER_PAGE).
        """
        assert store.get_total_pages() == 1

    def test_FAIL_total_pages_formula_uses_floor(self, all_cars):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Тест использует math.floor вместо math.ceil —
        при нечётном количестве машин результат будет меньше реального
        → AssertionError.
        """
        ipp = parse_items_per_page()
        store = CatalogStore(cars=all_cars, items_per_page=ipp)
        # Намеренно неверная формула: floor вместо ceil
        wrong_expected = math.floor(len(all_cars) / ipp)
        assert store.get_total_pages() == wrong_expected

    # ── Вид ошибки: неверная фильтрация ──────────────────────────────────────

    def test_FAIL_filtered_count_equals_all(self, store, all_cars):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] После фильтрации по конкретной категории
        количество машин не равно общему числу (если категория не единственная)
        → AssertionError.
        """
        from src.jsx_parser import parse_categories
        cats = [c for c in parse_categories() if c != "Все"]
        if cats:
            store.set_category(cats[0])
            filtered = store.get_filtered_cars()
            # Намеренно ошибочное ожидание: фильтрация не меняет количество
            assert len(filtered) == len(all_cars)

    def test_FAIL_empty_category_returns_all_cars(self, store, all_cars):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Несуществующая категория должна вернуть [],
        тест ожидает все машины → AssertionError.
        """
        store.set_category("НесуществующаяКатегория_XYZ")
        assert len(store.get_filtered_cars()) == len(all_cars)

    # ── Вид ошибки: неверная пагинация ───────────────────────────────────────

    def test_FAIL_second_page_same_as_first(self, all_cars):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Вторая страница должна содержать ДРУГИЕ машины,
        тест ошибочно проверяет, что они одинаковые → AssertionError.
        """
        store = CatalogStore(cars=all_cars, items_per_page=2)
        page1 = store.get_current_cars()
        store.set_page(2)
        page2 = store.get_current_cars()
        assert page1 == page2, "Страницы должны совпадать (это неверно)"

    def test_FAIL_set_category_does_not_reset_page(self, store):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] set_category() сбрасывает current_page на 1,
        тест ожидает, что страница сохранится → AssertionError.
        """
        store.set_page(3)
        from src.jsx_parser import parse_categories
        cats = [c for c in parse_categories() if c != "Все"]
        if cats:
            store.set_category(cats[0])
            assert store.current_page == 3  # Намеренно неверно: должно быть 1

    # ── Вид ошибки: KeyError — обращение к несуществующему полю ──────────────

    def test_FAIL_cars_have_color_field(self, all_cars):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Поле 'color' не существует в данных cars.js
        → KeyError при обращении к car['color'].
        """
        for car in all_cars:
            _ = car["color"]  # KeyError: 'color'


# ═══════════════════════════════════════════════════════════════════════════════
# БЛОК 3: Провальные тесты пагинатора
# ═══════════════════════════════════════════════════════════════════════════════

class TestPaginatorFailing:
    """Намеренно неправильные тесты get_page_numbers, can_go_prev, can_go_next."""

    # ── Вид ошибки: неверное ожидание наличия «...» ──────────────────────────

    def test_FAIL_no_ellipsis_for_10_pages(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] При 10 страницах и текущей = 1 пагинатор показывает «...»,
        тест ошибочно ожидает его отсутствия → AssertionError.
        """
        pages = get_page_numbers(total_pages=10, current_page=1)
        assert "..." not in pages

    def test_FAIL_all_10_pages_visible_from_page_1(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Пагинатор не показывает все 10 страниц сразу
        (он скрывает дальние за «...»), но тест ожидает полный список
        → AssertionError.
        """
        pages = get_page_numbers(total_pages=10, current_page=1)
        # Намеренно неверное ожидание: все 10 чисел должны быть видны
        assert pages == list(range(1, 11))

    def test_FAIL_first_page_not_in_pages(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Первая страница всегда присутствует в результате,
        тест проверяет обратное → AssertionError.
        """
        pages = get_page_numbers(total_pages=10, current_page=5)
        assert 1 not in pages

    def test_FAIL_last_page_not_in_pages(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Последняя страница всегда присутствует,
        тест проверяет обратное → AssertionError.
        """
        pages = get_page_numbers(total_pages=10, current_page=5)
        assert 10 not in pages

    # ── Вид ошибки: неверная навигация ───────────────────────────────────────

    def test_FAIL_can_go_prev_on_first_page(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] На первой странице нельзя идти назад (False),
        тест ожидает True → AssertionError.
        """
        assert can_go_prev(current_page=1) is True

    def test_FAIL_cannot_go_next_on_second_page(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] На второй из трёх страниц можно идти вперёд (True),
        тест ожидает False → AssertionError.
        """
        assert can_go_next(current_page=2, total_pages=3) is False

    def test_FAIL_single_page_can_go_next(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] При одной странице can_go_next = False,
        тест ожидает True → AssertionError.
        """
        assert can_go_next(current_page=1, total_pages=1) is True

    # ── Вид ошибки: TypeError ─────────────────────────────────────────────────

    def test_FAIL_page_numbers_are_strings(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] Числа в списке — int, не str.
        Тест вызывает int() на «...», что вызывает ValueError → ERROR.
        """
        pages = get_page_numbers(total_pages=10, current_page=5)
        # Попытка конвертировать ВСЕ элементы, включая '...' → ValueError
        as_ints = [int(p) for p in pages]
        assert len(as_ints) == len(pages)

    # ── Вид ошибки: неверный подсчёт «...» ───────────────────────────────────

    def test_FAIL_three_ellipsis_in_middle(self):
        """
        [НАМЕРЕННЫЙ ФЕЙЛ] В середине диапазона должно быть два «...»,
        тест ожидает три → AssertionError.
        """
        pages = get_page_numbers(total_pages=10, current_page=5)
        assert pages.count("...") == 3


# ═══════════════════════════════════════════════════════════════════════════════
# БЛОК 4: Технические ошибки (ERROR, не FAILED)
# ═══════════════════════════════════════════════════════════════════════════════

class TestErrorDemo:
    """Тесты, которые завершаются с ERROR (исключение вне assert), а не FAILED."""

    def test_FAIL_divide_by_zero(self):
        """
        [НАМЕРЕННЫЙ ERROR] ZeroDivisionError — тест не упадёт на assert,
        а просто выбросит исключение → pytest пометит как ERROR.
        """
        cars = parse_cars()
        # Намеренное деление на ноль
        result = len(cars) / 0
        assert result > 0

    def test_FAIL_index_out_of_range(self):
        """
        [НАМЕРЕННЫЙ ERROR] Обращение к несуществующему индексу → IndexError.
        """
        cars = parse_cars()
        # Берём элемент за пределами списка
        _ = cars[len(cars) + 999]

    def test_FAIL_wrong_argument_type(self):
        """
        [НАМЕРЕННЫЙ ERROR] get_page_numbers ожидает int, передаём None → TypeError.
        """
        result = get_page_numbers(total_pages=None, current_page=1)
        assert result == []
