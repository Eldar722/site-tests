import RenaultIcon from '../assets/images/brands/renault-icon.svg?react';
import MercedesIcon from '../assets/images/brands/mercedes-icon.svg?react';
import GeelyIcon from '../assets/images/brands/geely-icon.svg?react';
import VolkswagenIcon from '../assets/images/brands/volkswagen-icon.svg?react';
import LixiangIcon from '../assets/images/brands/lixiang-icon.svg?react';
import backIcon from '../assets/images/icons/back-icon.svg';
import nextIcon from '../assets/images/icons/next-icon.svg';
import { useRef, useState } from 'react';
import { useCatalogStore } from '../store/useCatalogStore.js';

const brands = [
    { id: 1, name: "Geely", Icon: GeelyIcon },
    { id: 2, name: "Lixiang", Icon: LixiangIcon },
    { id: 3, name: "Volkswagen", Icon: VolkswagenIcon },
    { id: 4, name: "Renault", Icon: RenaultIcon },
    { id: 5, name: "Mercedes", Icon: MercedesIcon },
    { id: 6, name: "Geely", Icon: GeelyIcon },
    { id: 7, name: "Lixiang", Icon: LixiangIcon },
    { id: 8, name: "Volkswagen", Icon: VolkswagenIcon },
    { id: 9, name: "Renault", Icon: RenaultIcon },
    { id: 10, name: "Mercedes", Icon: MercedesIcon },
];

function BrandCarousel() {
    const activeBrand = useCatalogStore((s) => s.activeBrand);
    const setBrand = useCatalogStore((s) => s.setBrand);

    const scrollRef = useRef(null);
    const [activePage, setActivePage] = useState(0);
    const itemsPerPage = 5;
    const pages = Math.ceil(brands.length / itemsPerPage);

    const goToPage = (pageIndex) => {
        const container = scrollRef.current;
        if (!container) return;
        const itemWidth = container.children[0].offsetWidth + 50;
        const scrollLeft = pageIndex * itemsPerPage * itemWidth;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        setActivePage(pageIndex);
    };

    const scroll = (direction) => {
        if (direction === "left") goToPage(Math.max(activePage - 1, 0));
        else goToPage(Math.min(activePage + 1, pages - 1));
    };

    // Update indicator dot while user is swiping with finger
    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container) return;
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const ratio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const page = Math.round(ratio * (pages - 1));
        setActivePage(page);
    };

    const handleBrandClick = (brandName) => {
        setBrand(brandName);
        // Scroll to catalog after selecting brand
        requestAnimationFrame(() => {
            const catalog = document.querySelector('.full-catalog');
            if (catalog) catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    };

    return (
        <section className="brand-nuv">
            <div className='brand-carousel'>
                <div className='carousel-wrapper'>
                    <button className='scroll-btn' onClick={() => scroll("left")} disabled={activePage === 0}>
                        <img src={backIcon} alt='back-icon' />
                    </button>
                    <div className='scroll-carousel text-heading-lg' ref={scrollRef} onScroll={handleScroll}>
                        {brands.map((brand) => {
                            const Icon = brand.Icon;
                            return (
                                <button
                                    key={brand.id}
                                    className={`brand-button ${activeBrand === brand.name ? "active" : ""}`}
                                    onClick={() => handleBrandClick(brand.name)}
                                >
                                    <Icon className="brand-icon" />
                                    {brand.name}
                                </button>
                            );
                        })}
                    </div>
                    <button className='scroll-btn' onClick={() => scroll("right")} disabled={activePage === pages - 1}>
                        <img src={nextIcon} alt='next-icon' />
                    </button>
                </div>
                <div className="indicator">
                    {Array.from({ length: pages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`brand-indicator ${activePage === index ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BrandCarousel;