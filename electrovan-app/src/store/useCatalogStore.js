import { create } from 'zustand';
import { cars } from '../data/cars.js';

const ITEMS_PER_PAGE = 12;

export const useCatalogStore = create((set, get) => ({
    // --- Данные ---
    cars,

    // --- Фильтрация по категории ---
    activeCategory: 'Все',

    setCategory: (category) => set({
        activeCategory: category,
        currentPage: 1,
    }),

    // --- Фильтрация по бренду ---
    activeBrand: null,

    setBrand: (brand) => {
        const current = get().activeBrand;
        set({
            activeBrand: current === brand ? null : brand,
            currentPage: 1,
        });
    },

    // --- Пагинация ---
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE,

    setPage: (page) => set({ currentPage: page }),

    // --- Вычисляемые значения ---
    getFilteredCars: () => {
        const { cars, activeCategory, activeBrand } = get();
        let filtered = cars;

        if (activeBrand) {
            filtered = filtered.filter((car) => car.brand === activeBrand);
        }

        if (activeCategory !== 'Все') {
            filtered = filtered.filter((car) => car.category === activeCategory);
        }

        return filtered;
    },

    getCurrentCars: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredCars();
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    },

    getTotalPages: () => {
        const filtered = get().getFilteredCars();
        return Math.ceil(filtered.length / get().itemsPerPage);
    },
}));
