"""
test_forms.py — тесты валидации формы заявки.

Паттерн телефона читается напрямую из:
  src/components/CTAmodal.jsx — атрибут pattern="..." у поля <input type="tel">

Python-логика в forms.py применяет тот же паттерн через re.fullmatch,
воспроизводя браузерную HTML-валидацию.
"""

import pytest
from src.forms import validate_phone, submit_application, FormValidationError
from src.jsx_parser import parse_phone_pattern


# ── Проверка парсинга паттерна из CTAmodal.jsx ────────────────────────────────

class TestPhonePatternFromJSX:

    def test_pattern_is_extracted_from_ctamodal_jsx(self):
        """Паттерн успешно читается из CTAmodal.jsx."""
        pattern = parse_phone_pattern()
        assert isinstance(pattern, str)
        assert len(pattern) > 0

    def test_pattern_contains_phone_structure(self):
        """Паттерн содержит признаки телефонного регулярного выражения."""
        pattern = parse_phone_pattern()
        # Паттерн должен допускать цифры и разделители
        assert "[0-9]" in pattern or r"\d" in pattern


# ── validate_phone (использует pattern из CTAmodal.jsx) ───────────────────────

class TestValidatePhone:

    @pytest.mark.parametrize("phone", [
        "+77001234567",
        "+7 700 123 45 67",
        "87001234567",
        "8(700)1234567",
        "8 700 123-45-67",
    ])
    def test_valid_phones_match_ctamodal_pattern(self, phone):
        """Корректные номера принимаются — как в браузерной валидации CTAmodal."""
        assert validate_phone(phone) is True, (
            f"Номер '{phone}' должен проходить паттерн из CTAmodal.jsx"
        )

    @pytest.mark.parametrize("phone", [
        "",
        "123",
        "abc",
        "+1234",
        "телефон",
    ])
    def test_invalid_phones_rejected_by_ctamodal_pattern(self, phone):
        """Некорректные номера отклоняются — как в браузерной валидации CTAmodal."""
        assert validate_phone(phone) is False, (
            f"Номер '{phone}' должен отклоняться паттерном из CTAmodal.jsx"
        )

    def test_same_pattern_used_in_jsx_and_python(self):
        """Python validate_phone использует тот же паттерн, что и CTAmodal.jsx."""
        import re
        pattern = parse_phone_pattern()
        # Проверяем один номер напрямую через паттерн из JSX
        assert re.fullmatch(pattern, "+77001234567") is not None
        assert re.fullmatch(pattern, "abc") is None


# ── submit_application ────────────────────────────────────────────────────────

class TestSubmitApplication:

    def test_valid_submission_returns_success(self):
        """Валидные данные → успешный ответ."""
        result = submit_application("Алия", "+77001234567")
        assert result["success"] is True
        assert result["name"] == "Алия"
        assert result["phone"] == "+77001234567"

    def test_strips_whitespace_from_name_and_phone(self):
        """Пробелы по краям обрезаются."""
        result = submit_application("  Алия  ", "  +77001234567  ")
        assert result["name"] == "Алия"
        assert result["phone"] == "+77001234567"

    # [TDD] тест написан до реализации
    def test_raises_error_if_name_is_empty(self):
        """Пустое имя → FormValidationError."""
        with pytest.raises(FormValidationError, match="Имя обязательно"):
            submit_application("", "+77001234567")

    def test_raises_error_if_name_is_whitespace(self):
        """Имя из пробелов → FormValidationError."""
        with pytest.raises(FormValidationError):
            submit_application("   ", "+77001234567")

    # [TDD] тест написан до реализации
    def test_raises_error_if_phone_is_empty(self):
        """Пустой телефон → FormValidationError."""
        with pytest.raises(FormValidationError, match="телефон"):
            submit_application("Алия", "")

    def test_raises_error_if_phone_invalid_per_ctamodal_pattern(self):
        """Номер, не проходящий паттерн из CTAmodal.jsx → FormValidationError."""
        with pytest.raises(FormValidationError, match="формат"):
            submit_application("Алия", "не_номер")

    def test_phone_validation_consistent_with_jsx_pattern(self):
        """validate_phone и submit_application используют один и тот же паттерн."""
        valid_phone = "+77001234567"
        assert validate_phone(valid_phone) is True
        result = submit_application("Тест", valid_phone)
        assert result["success"] is True
