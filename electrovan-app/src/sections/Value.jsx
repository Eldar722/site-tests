import { useEffect, useRef } from "react";
import gsap from "gsap";

function Value() {
    const cardsRef = useRef([]);

    useEffect(() => {
        const animations = [];
        const isMobile = window.innerWidth <= 768;
        
        // Setup GSAP animations for all cards
        cardsRef.current.forEach((card) => {
            if (!card) return;

            const line = card.querySelector(".value-card-line");
            const anim = gsap.to(line, {
                scaleX: 1,
                duration: 0.4,
                ease: "power2.out",
                paused: true,
                transformOrigin: "left center",
            });

            const onEnter = () => {
                anim.play();
                card.classList.add('focused');
            };
            const onLeave = () => {
                anim.reverse();
                card.classList.remove('focused');
            };

            if (!isMobile) {
                // Desktop hover behavior
                card.addEventListener("mouseenter", onEnter);
                card.addEventListener("mouseleave", onLeave);
            }

            animations.push({ card, anim, onEnter, onLeave });
        });

        // Mobile Intersection Observer (scroll snapping trigger)
        let observer;
        if (isMobile) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const targetAnim = animations.find(a => a.card === entry.target);
                        if (targetAnim) {
                            if (entry.isIntersecting) {
                                targetAnim.onEnter();
                            } else {
                                targetAnim.onLeave();
                            }
                        }
                    });
                },
                {
                    root: document.querySelector('.value-block'),
                    threshold: 0.8 // Trigger when at least 80% of the card is visible (snapped in center)
                }
            );

            cardsRef.current.forEach((card) => {
                if (card) observer.observe(card);
            });
        }

        return () => {
            animations.forEach(({ card, anim, onEnter, onLeave }) => {
                card.removeEventListener("mouseenter", onEnter);
                card.removeEventListener("mouseleave", onLeave);
                anim.kill();
            });
            if (observer) observer.disconnect();
        };
    }, []);

    const handleCardClick = (index) => {
        if (window.innerWidth <= 768 && cardsRef.current[index]) {
            const container = document.querySelector('.value-block');
            const targetCard = cardsRef.current[index];
            if (container && targetCard) {
                // Calculate position to center the card
                const scrollPos = targetCard.offsetLeft - (container.clientWidth / 2) + (targetCard.clientWidth / 2);
                container.scrollTo({
                    left: scrollPos,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <section className="page-white">
            <div className="container">
                <div className="section-heading">
                    <h2 className="section-title text-heading-xl text-blue-300">Что вы получаете покупая у нас</h2>
                    <p className="section-description text-body-md text-blue-200">Конкретные выгоды и результаты, которые получает ваш бизнес. Измеримо, прозрачно, гарантировано.</p>
                </div>
                <div className="value-block">
                    <div className="value-card" ref={(el) => (cardsRef.current[0] = el)} onClick={() => handleCardClick(0)}>
                        <div className="value-card-line"></div>
                        <div className="number-block text-body-lg">01</div>
                        <div className="title-subtitle-block">
                            <h4 className="title-block text-heading-lg">Меньше поломок - Меньше расход</h4>
                            <p className="subtitle-block text-body-md">Простая конструкция с минимумом движущихся частей снижает затраты на обслуживание на 70%.</p>
                        </div>
                        <div className="advantages">
                            <p className="advantage text-caption">Экономия до 30% на расходах</p>
                            <p className="advantage text-caption">Окупаемость за 8-12 месяцев</p>
                        </div>
                    </div>
                    <div className="value-card" ref={(el) => (cardsRef.current[1] = el)} onClick={() => handleCardClick(1)}>
                        <div className="value-card-line"></div>
                        <div className="number-block text-body-lg">02</div>
                        <div className="title-subtitle-block">
                            <h4 className="title-block text-heading-lg">Бизнес без простоев</h4>
                            <p className="subtitle-block text-body-md">Ваши операции не остановятся из-за транспортных проблем. Гарантируем стабильность и быструю поддержку.</p>
                        </div>
                        <div className="advantages">
                            <p className="advantage text-caption">99.8% времени работы без сбоев</p>
                            <p className="advantage text-caption">Постоянная техническая поддержка</p>
                        </div>
                    </div>
                    <div className="value-card" ref={(el) => (cardsRef.current[2] = el)} onClick={() => handleCardClick(2)}>
                        <div className="value-card-line"></div>
                        <div className="number-block text-body-lg">03</div>
                        <div className="title-subtitle-block">
                            <h4 className="title-block text-heading-lg">Больше доверия — больше клиентов</h4>
                            <p className="subtitle-block text-body-md">Соответствие ESG-стандартам повышает значимость среди конкурентов и укрепляет доверие среди клиентов</p>
                        </div>
                        <div className="advantages">
                            <p className="advantage text-caption">Готовые отчёты для инвесторов</p>
                            <p className="advantage text-caption">Международные сертификаты</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Value;