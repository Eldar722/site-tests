"""
cars.py — устаревший файл с хардкоженными данными.
Данные теперь читаются напрямую из data/cars.js через jsx_parser.parse_cars().
Этот файл оставлен для обратной совместимости.
"""
from src.jsx_parser import parse_cars

# Ленивая загрузка из JSX при первом обращении
def get_cars():
    return parse_cars()
