import { useState, useEffect } from 'react';

const navLinks = [
        { desktop: 'Направления', mobile: 'Направления', href: "#directions"},
        { desktop: 'Каталог', mobile: 'Перейти в каталог', href: "#catalog"},
        { desktop: 'Помощь', mobile: 'Помощь в выборе', href: "#help"},
        { desktop: 'Гарантии', mobile: 'Условия гарантии', href: "#guarantee"},
        { desktop: 'Контакты', mobile: 'Наши контакты', href: "#contacts"},
];

function Header({ onOpenModal }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80);
        const handleResize = () => setIsMobile(window.innerWidth <= 768);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        return () => { 
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
            <span className={`logo text-heading-xl ${isMobileMenuOpen ? 'logo--menu-open' : ''}`}>ElectroVan</span>
            <nav className={`nav ${isMobileMenuOpen ? 'nav--open' : ''}`}>
                {navLinks.map((link) => (
                    <a
                        key={link.desktop}
                        href={link.href}
                        className="nav-link text-body-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {isMobile ? link.mobile : link.desktop}
                    </a>
                ))}
                <button className="cta-btn text-body-lg cta-btn--mobile" onClick={onOpenModal}>Оставить заявку</button>
            </nav>
            <button className="cta-btn text-body-lg cta-btn--desktop" onClick={onOpenModal}>Оставить заявку</button>
            
            <button 
                className={`menu-btn ${isMobileMenuOpen ? 'menu-btn--open' : ''}`} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
    );
}

export default Header;