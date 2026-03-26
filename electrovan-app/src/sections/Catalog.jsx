import { useRef, useEffect } from 'react';
import CatalogCard from '../components/catalog/CatalogCard.jsx';
import Paginator from '../components/Paginator';
import Brands from '../components/BrandsCarousel';
import { useCatalogStore } from '../store/useCatalogStore.js';

const CATEGORIES = ['Все', 'Грузовые', 'Пассажирские', 'Грузо-пассажирские'];

function Catalog({ onOpenModal }) {
    const activeCategory = useCatalogStore((s) => s.activeCategory);
    const activeBrand    = useCatalogStore((s) => s.activeBrand);
    const currentPage    = useCatalogStore((s) => s.currentPage);
    const setCategory    = useCatalogStore((s) => s.setCategory);
    const setPage        = useCatalogStore((s) => s.setPage);
    const getCurrentCars = useCatalogStore((s) => s.getCurrentCars);
    const getTotalPages  = useCatalogStore((s) => s.getTotalPages);

    const catalogRef = useRef(null);
    const wrapperRef = useRef(null);
    const lineRef    = useRef(null);

    const moveLine = (buttonElement) => {
        if (!buttonElement || !wrapperRef.current || !lineRef.current) return;
        const buttonRect  = buttonElement.getBoundingClientRect();
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        lineRef.current.style.left  = buttonRect.left - wrapperRect.left + 'px';
        lineRef.current.style.width = buttonRect.width + 'px';
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (wrapperRef.current) {
                const activeButton = wrapperRef.current.querySelector(`button[data-category="${activeCategory}"]`);
                if (activeButton) {
                    moveLine(activeButton);
                }
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [activeCategory]);

    const handlePageChange = (page) => {
        setPage(page);
        requestAnimationFrame(() => {
            catalogRef.current?.scrollIntoView({ block: 'start' });
        });
    };

    const handleCategoryChange = (cat, e) => {
        moveLine(e.currentTarget);
        setCategory(cat);
    };

    return (
        <section className="catalog-section" id="catalog">
            <div className="container">
                <div className="cat-title">
                    <div className="text-display-xl">
                        Интересен какой то определенный <span className="cat-brand">бренд?</span>
                    </div>
                </div>
                <Brands />
                <div className='full-catalog' ref={catalogRef}>
                    <div className='text-display-xl'>Наш полный каталог</div>
                    <div className='catalog-help text-heading-lg'>
                        Не знаете как выбрать правильно?
                        <button
                            className='help-button'
                            onClick={() => {
                                const el = document.getElementById('help');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Помощь в выборе
                        </button>
                    </div>
                    <div className='cat-wrapp' ref={wrapperRef}>
                        <div className='catalog-categories text-heading-lg'>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    data-category={cat}
                                    onClick={(e) => handleCategoryChange(cat, e)}
                                    className={activeCategory === cat ? 'active' : ''}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className='under-line'>
                            <div className='top-line' ref={lineRef}></div>
                        </div>
                    </div>
                    <CatalogCard cars={getCurrentCars()} onOpenModal={onOpenModal} />
                </div>
                <Paginator
                    totalPages={getTotalPages()}
                    currentPage={currentPage}
                    setCurrentPage={handlePageChange}
                />
            </div>
        </section>
    );
}


export default Catalog;
