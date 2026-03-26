import { useState, useEffect } from 'react';

function useCountUp(target, duration = 1600, delay = 600) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const id = setTimeout(() => {
            const start = performance.now();
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - (1 - p) ** 3; // easeOutCubic
                setValue(Math.round(eased * target));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, delay);
        return () => clearTimeout(id);
    }, [target, duration, delay]);
    return value;
}

function Hero({ onOpenModal }) {
    const km = useCountUp(50000, 1800, 600);
    const economy = useCountUp(70, 1400, 800);

    return (
        <section className="section-hero">
            <div className="container hero-content">
                <div className="main-text-container">
                    <h1 className="main-text-hero text-display-xl">
                        <span className="highlight">Электро</span> транспорт -
                        <br />наше реальное
                        <br />будущее
                    </h1>
                </div>
                <div className="sub-text-container">
                    <p className="sub-text-hero text-body-md">Хороший вариант для бизнеса. То что нужно, для коммерческих целей с <span className="alt-highlight">большой</span> выгодой.</p>
                </div>
                <div className="hero-buttons">
                    <button className="hero-cta-button text-body-lg" onClick={onOpenModal}>Оставить заявку</button>
                    <button
                        className="catalog-button text-body-lg"
                        onClick={() => {
                            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Перейти к каталогу
                    </button>
                </div>
                <hr className="line-under-cta" />
                <div className="statistics">
                    <div className="block-of-statistic">
                        <div className="number-of-statistic text-heading-xl">
                            {km.toLocaleString('ru-RU')}
                        </div>
                        <div className="thing-of-statistic text-caption">км гарантии</div>
                    </div>
                    <div className="block-of-statistic">
                        <div className="number-of-statistic text-heading-xl">{economy}%</div>
                        <div className="thing-of-statistic text-caption">экономии</div>
                    </div>
                    <div className="block-of-statistic">
                        <div className="number-of-statistic text-heading-xl">24/7</div>
                        <div className="thing-of-statistic text-caption">поддержка</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
