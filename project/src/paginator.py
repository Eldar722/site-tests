"""
paginator.py — логика пагинатора.
Правила отображения страниц читаются из Paginator.jsx через jsx_parser.
"""

from src.jsx_parser import get_page_numbers_from_jsx, parse_paginator_rule


def get_page_numbers(total_pages: int, current_page: int) -> list:
    """
    Возвращает список номеров страниц для отображения.
    Логика полностью воспроизводит getPages() из Paginator.jsx.
    Правила (окно, first/last) читаются из реального JSX-файла.
    """
    return get_page_numbers_from_jsx(total_pages, current_page)


def can_go_prev(current_page: int) -> bool:
    return current_page > 1


def can_go_next(current_page: int, total_pages: int) -> bool:
    return current_page < total_pages
