import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Форматирование числа с пробелами
function fmt(n) {
    return Math.floor(n).toLocaleString("ru-RU");
}

// Данные блоков
const benefitData = [
    {
        title: "Стоимость топлива на 100 км",
        electro: { label: "Электро", value: 950, suffix: " ₸", prefix: "= ", barWidth: "35%" },
        diesel: { label: "Дизель", value: 5000, suffix: " ₸", prefix: "= ", barWidth: "100%" },
    },
    {
        title: "Расходы на ТО в год",
        electro: { label: "Электро", value: 100000, suffix: " ₸", prefix: "= ", barWidth: "35%" },
        diesel: { label: "Дизель", value: 500000, suffix: " ₸", prefix: "= ", barWidth: "100%" },
    },
    {
        title: "Ресурс двигателя",
        electro: { label: "Электро", value: 1, suffix: " млн км", prefix: "", barWidth: "100%" },
        diesel: { label: "Дизель", value: 300, suffix: " тыс км", prefix: "", barWidth: "30%" },
    },
];

function BenefitBox({ data, index }) {
    const boxRef = useRef(null);
    const elBarRef = useRef(null);
    const dslBarRef = useRef(null);
    const elValRef = useRef(null);
    const dslValRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: boxRef.current,
                    start: "top 80%",
                    once: true,
                },
            });

            // Fade-in самого блока
            tl.from(boxRef.current, {
                opacity: 0,
                y: 28,
                duration: 0.5,
                ease: "power2.out",
                delay: index * 0.12,
            });

            // Анимация баров
            tl.fromTo(
                elBarRef.current,
                { width: "0%" },
                { width: data.electro.barWidth, duration: 1.4, ease: "power3.out" },
                "<0.1"
            );
            tl.fromTo(
                dslBarRef.current,
                { width: "0%" },
                { width: data.diesel.barWidth, duration: 1.8, ease: "power3.out" },
                "<"
            );

            // Счётчик Электро
            const elObj = { val: 0 };
            tl.to(elObj, {
                val: data.electro.value,
                duration: 1.4,
                ease: "power3.out",
                onUpdate() {
                    if (elValRef.current)
                        elValRef.current.textContent = `${data.electro.prefix}${fmt(elObj.val)}${data.electro.suffix}`;
                },
            }, "<");

            // Счётчик Дизель
            const dslObj = { val: 0 };
            tl.to(dslObj, {
                val: data.diesel.value,
                duration: 1.8,
                ease: "power3.out",
                onUpdate() {
                    if (dslValRef.current)
                        dslValRef.current.textContent = `${data.diesel.prefix}${fmt(dslObj.val)}${data.diesel.suffix}`;
                },
            }, "<");
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="benefit-box" ref={boxRef}>
            <span className="text-body-lg">{data.title}</span>

            <div className="benefit-comparison electro">
                <div className="comparison-header">
                    <span className="benefit-text text-body-lg text-blue-200">{data.electro.label}</span>
                    <span ref={elValRef} className="benefit-total-sum text-body-lg text-blue-200">0</span>
                </div>
                <div ref={elBarRef} className="comparison-line" style={{ width: "0%" }} />
            </div>

            <div className="benefit-comparison diesel">
                <div className="comparison-header">
                    <span className="benefit-text text-body-lg">{data.diesel.label}</span>
                    <span ref={dslValRef} className="benefit-total-sum text-body-lg">0</span>
                </div>
                <div ref={dslBarRef} className="comparison-line" style={{ width: "0%" }} />
            </div>
        </div>
    );
}

function Benefits() {
    const sectionRef = useRef(null);
    const mileageRef = useRef(null);
    const savingsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Счётчик пробега
            const mObj = { val: 0 };
            gsap.to(mObj, {
                val: 3000,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
                onUpdate() {
                    if (mileageRef.current)
                        mileageRef.current.textContent = `*Расчёт при среднем пробеге ${fmt(mObj.val)} км / мес`;
                },
            });

            // Счётчик экономии
            const sObj = { val: 0 };
            gsap.to(sObj, {
                val: 425990,
                duration: 2,
                ease: "power3.out",
                scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
                onUpdate() {
                    if (savingsRef.current)
                        savingsRef.current.textContent = `–${fmt(sObj.val)} ₸`;
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="page-blue" ref={sectionRef}>
            <div className="container">
                <div className="section-heading">
                    <h2 className="section-title text-heading-xl text-white-base">Электричество или Дизель</h2>
                    <p className="section-description text-body-md text-white-base">Почему электричество будет выгоднее?</p>
                </div>
                <div className="benefits-group">
                    {benefitData.map((item, i) => (
                        <BenefitBox key={i} data={item} index={i} />
                    ))}
                </div>
            </div>
            <div className="calculation-group">
                <div className="average-calculation">
                    <p ref={mileageRef} className="text-caption">*Расчёт при среднем пробеге 0 км / мес</p>
                </div>
                <div className="total-calculation">
                    <p className="text-body-lg">Итог за месяц: <span ref={savingsRef} className="text-blue-200">–0 ₸</span> расходов</p>
                </div>
            </div>
        </section>
    );
}

export default Benefits;