import { useState } from 'react';
import './assets/styles/global.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HeroSection from './sections/Hero.jsx'
import ValueSection from './sections/Value.jsx'
import BenefitsSection from './sections/Benefits.jsx'
import TrustSection from './sections/Trust.jsx'
import CatalogSection from './sections/Catalog.jsx'
import CTASection from './sections/CTA.jsx'
import HelpPageSection from './sections/HelpPage.jsx'
import PopularCarSection from './sections/PopularCar.jsx'
import DirectionsSection from './sections/Directions.jsx'
import CTAmodal from './components/CTAmodal.jsx'

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isToastClosing, setIsToastClosing] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleFormSubmit = () => {
        setShowToast(true);
        setIsToastClosing(false);

        // Start closing animation after 3.7s
        setTimeout(() => {
            setIsToastClosing(true);
            // Completely remove from DOM after animation (300ms)
            setTimeout(() => {
                setShowToast(false);
                setIsToastClosing(false);
            }, 300);
        }, 3700);
    };

    return (
        <>
            {showToast && (
                <div className={`toast ${isToastClosing ? 'toast--closing' : ''}`}>
                    Заявка отправлена! Мы свяжемся с вами в ближайшее время.
                </div>
            )}

            {isModalOpen && (
                <CTAmodal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}

            <div className="hero-wrapper">
                <Header onOpenModal={() => setIsModalOpen(true)} />
                <HeroSection onOpenModal={() => setIsModalOpen(true)} />
            </div>
            <ValueSection />
            <DirectionsSection id="directions" />
            <PopularCarSection onOpenModal={() => setIsModalOpen(true)}/>
            <CatalogSection id="catalog" onOpenModal={() => setIsModalOpen(true)} />
            <BenefitsSection />
            <HelpPageSection id="help" />
            <TrustSection id="guarantee" />
            <CTASection onOpenModal={() => setIsModalOpen(true)} />
            <Footer id="contacts" onOpenModal={() => setIsModalOpen(true)}/>
        </>
    );
}

export default App;