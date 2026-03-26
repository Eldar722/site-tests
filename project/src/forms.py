"""
forms.py — валидация формы заявки.
Паттерн телефона читается напрямую из CTAmodal.jsx через jsx_parser.
"""

from src.jsx_parser import validate_phone_from_jsx, parse_phone_pattern


class FormValidationError(ValueError):
    pass


def validate_phone(phone: str) -> bool:
    """
    Проверяет номер телефона по pattern из CTAmodal.jsx.
    Эквивалентно HTML-валидации браузера (pattern неявно = ^...$).
    """
    return validate_phone_from_jsx(phone)


def submit_application(name: str, phone: str) -> dict:
    """
    Обрабатывает заявку: проверяет имя и телефон.
    Возвращает {'success': True, 'name': ..., 'phone': ...} или кидает ошибку.
    """
    if not name or not name.strip():
        raise FormValidationError("Имя обязательно для заполнения")

    if not phone or not phone.strip():
        raise FormValidationError("Номер телефона обязателен")

    if not validate_phone(phone):
        raise FormValidationError("Неверный формат номера телефона")

    return {"success": True, "name": name.strip(), "phone": phone.strip()}
