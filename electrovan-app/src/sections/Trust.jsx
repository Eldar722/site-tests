import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Trust() {
    const sectionRef = useRef(null);
    const mileageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Счётчик 0 → 50 000 км
            const obj = { val: 0 };
            gsap.to(obj, {
                val: 50000,
                duration: 2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
                onUpdate() {
                    if (mileageRef.current) {
                        mileageRef.current.textContent =
                            Math.floor(obj.val).toLocaleString("ru-RU") + " км";
                    }
                },
            });

            // Fade-in + slide-up для блоков
            gsap.from(".trust-animate", {
                opacity: 0,
                y: 32,
                duration: 0.7,
                ease: "power2.out",
                stagger: 0.18,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="page-blue" ref={sectionRef} id="guarantee">
            <div className="container">
                <div className="section-heading">
                    <h2 className="section-title text-heading-xl text-white-base">Гарантия и сервисное сопровождение</h2>
                    <p className="section-description text-body-md text-white-base">Поддержка, ремонт и гарантия на всём сроке эксплуатации</p>
                </div>
                <div className="trust-group">

                    <div className="big-box-trust trust-animate">
                        <h3 className="trust-box-heading text-heading-lg text-white-base">Гарантия</h3>
                        <span ref={mileageRef} className="trust-box-main-text text-heading-xl text-blue-300">
                            0 км
                        </span>
                        <p className="trust-box-secondary-text text-body-md text-white-base">
                            Все ключевые системы электротранспорта под гарантией на протяжении всего пробега или срока обслуживания.
                        </p>
                    </div>

                    <div className="small-boxes-trust">
                        <div className="small-box-trust trust-animate">
                            <h3 className="trust-box-heading text-heading-lg text-white-base">Сервис</h3>
                            <span className="trust-box-main-text text-body-lg text-blue-300">Быстро. Качественно. Официально.</span>
                            <p className="trust-box-secondary-text text-caption text-white-base">Оперативный ремонт, оригинальные комплектующие и сертифицированные специалисты.</p>
                        </div>
                        <div className="small-box-trust trust-animate">
                            <h3 className="trust-box-heading text-heading-lg text-white-base">Поддержка</h3>
                            <span className="trust-box-main-text text-body-lg text-blue-300">На связи 24/7</span>
                            <p className="trust-box-secondary-text text-caption text-white-base">Техническая помощь и консультации в любое время — без ожиданий и очередей.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Trust;