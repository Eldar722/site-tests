"""
test_paginator.py — тесты логики пагинатора.

Правила отображения страниц читаются напрямую из:
  src/components/Paginator.jsx — условие внутри getPages()

Python воспроизводит ту же логику через jsx_parser.get_page_numbers_from_jsx().
"""

import pytest
from src.paginator import get_page_numbers, can_go_prev, can_go_next
from src.jsx_parser import parse_paginator_rule


# ── Проверка парсинга правил из Paginator.jsx ─────────────────────────────────

class TestPaginatorRuleFromJSX:

    def test_rule_extracted_from_paginator_jsx(self):
        """Правила успешно читаются из Paginator.jsx."""
        rule = parse_paginator_rule()
        assert "window_left" in rule
        assert "window_right" in rule
        assert "always_first" in rule
        assert "always_last" in rule

    def test_always_shows_first_and_last(self):
        """Paginator.jsx всегда показывает первую и последнюю страницы."""
        rule = parse_paginator_rule()
        assert rule["always_first"] is True, (
            "Paginator.jsx должен всегда показывать первую страницу (i === 1)"
        )
        assert rule["always_last"] is True, (
            "Paginator.jsx должен всегда показывать последнюю страницу (i === totalPages)"
        )

    def test_window_is_at_least_1(self):
        """Окно вокруг текущей страницы — минимум ±1 (из Paginator.jsx)."""
        rule = parse_paginator_rule()
        assert rule["window_left"] >= 1
        assert rule["window_right"] >= 1


# ── get_page_numbers (воспроизводит getPages() из Paginator.jsx) ──────────────

class TestGetPageNumbers:

    def test_shows_page_1_when_current_is_1(self):
        pages = get_page_numbers(total_pages=3, current_page=1)
        assert 1 in pages

    def test_shows_all_pages_when_total_is_3(self):
        """Три страницы — все видны, нет «...»."""
        pages = get_page_numbers(total_pages=3, current_page=2)
        assert pages == [1, 2, 3]

    def test_returns_empty_for_zero_total_pages(self):
        assert get_page_numbers(total_pages=0, current_page=1) == []

    def test_always_includes_first_and_last_page(self):
        """Соответствует условию i === 1 || i === totalPages из Paginator.jsx."""
        pages = get_page_numbers(total_pages=10, current_page=5)
        assert 1 in pages
        assert 10 in pages

    def test_shows_ellipsis_between_non_adjacent_pages(self):
        """«...» появляется между несмежными страницами — как в JSX."""
        pages = get_page_numbers(total_pages=10, current_page=1)
        assert "..." in pages

    def test_shows_two_ellipsis_in_middle(self):
        """В середине диапазона — два «...» (до и после текущей группы)."""
        pages = get_page_numbers(total_pages=10, current_page=5)
        assert pages.count("...") == 2

    def test_no_ellipsis_when_all_pages_adjacent(self):
        """Без пропусков — без «...»."""
        pages = get_page_numbers(total_pages=3, current_page=2)
        assert "..." not in pages

    def test_includes_neighbors_matching_paginator_jsx_window(self):
        """
        Соседние страницы включаются по правилу из Paginator.jsx:
        i >= currentPage - N && i <= currentPage + N
        """
        rule = parse_paginator_rule()
        left = rule["window_left"]
        right = rule["window_right"]
        current = 5
        pages = get_page_numbers(total_pages=10, current_page=current)
        for offset in range(1, left + 1):
            assert (current - offset) in pages, (
                f"Страница {current - offset} должна быть видна (window_left={left})"
            )
        for offset in range(1, right + 1):
            assert (current + offset) in pages, (
                f"Страница {current + offset} должна быть видна (window_right={right})"
            )

    def test_single_page_returns_just_1(self):
        """Одна страница — только [1]."""
        pages = get_page_numbers(total_pages=1, current_page=1)
        assert pages == [1]

    def test_ellipsis_not_at_start_or_end(self):
        """«...» не может быть первым или последним элементом."""
        for total in [5, 10, 20]:
            for current in [1, total // 2, total]:
                pages = get_page_numbers(total_pages=total, current_page=current)
                if pages:
                    assert pages[0] != "...", f"«...» не должно быть первым (total={total}, current={current})"
                    assert pages[-1] != "...", f"«...» не должно быть последним (total={total}, current={current})"


# ── can_go_prev / can_go_next ─────────────────────────────────────────────────

class TestNavigation:

    def test_cannot_go_prev_on_first_page(self):
        """Кнопка «назад» отключена на первой странице — disabled={currentPage === 1}."""
        assert can_go_prev(current_page=1) is False

    def test_can_go_prev_on_second_page(self):
        assert can_go_prev(current_page=2) is True

    def test_cannot_go_next_on_last_page(self):
        """Кнопка «вперёд» отключена на последней — disabled={currentPage === totalPages}."""
        assert can_go_next(current_page=3, total_pages=3) is False

    def test_can_go_next_before_last_page(self):
        assert can_go_next(current_page=2, total_pages=3) is True

    def test_single_page_cannot_go_in_either_direction(self):
        """При одной странице обе кнопки недоступны."""
        assert can_go_prev(current_page=1) is False
        assert can_go_next(current_page=1, total_pages=1) is False
