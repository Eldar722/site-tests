import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import cityIcon from '../assets/images/icons/cityIcon.svg';
import trackIcon from '../assets/images/icons/logisticIcon.svg';
import rentIcon from '../assets/images/icons/rentIcon.svg';
import tourismIcon from '../assets/images/icons/tourismIcon.svg';

gsap.registerPlugin(ScrollTrigger);

function DirCard() {
    const cardsContainerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.direct-card');
            
            // Staggered fade up animation for all cards when the block enters the viewport
            gsap.fromTo(cards, 
                {
                    opacity: 0,
                    y: 40
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2, // 0.2s delay between each card animating in
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cardsContainerRef.current,
                        start: "top 85%", // Trigger animation when container is 85% into viewport from top
                        toggleActions: "play none none none" // Play once
                    }
                }
            );
        }, cardsContainerRef);

        return () => ctx.revert(); // Cleanup GSAP animations
    }, []);

    return (
        <div className='directions-cards' ref={cardsContainerRef}>
            <div className='direct-card'>
                <img src={cityIcon} alt='city' />
                <div className='dircard-text text-heading-lg'>
                    Ремонт и строительство
                    <div className='text-caption'>
                        Оптимально для перевозки инструментов, отделочных материалов и выезда бригад. Экономия на топливе и готовность к работе 24/7 без ограничений въезда в центр.
                    </div>
                </div>
            </div>
            <div className='direct-card'>
                <img src={trackIcon} alt='city' />
                <div className='dircard-text text-heading-lg'>
                    Логистика и доставка
                    <div className='text-caption'>
                        Идеальное решение для «последней мили», интернет-магазинов и курьерских служб. Минимальная стоимость владения и бесшумная работа в жилых кварталах.
                    </div>
                </div>
            </div>
            <div className='direct-card'>
                <img src={tourismIcon} alt='city' />
                <div className='dircard-text text-heading-lg'>
                    Туризм и трансферы
                    <div className='text-caption'>
                        Комфортные и экологичные перевозки для отелей, баз отдыха и экскурсий. Бесшумность электротранспорта подчеркивает премиальность вашего сервиса.
                    </div>
                </div>
            </div>
            <div className='direct-card'>
                <img src={rentIcon} alt='city' />
                <div className='dircard-text text-heading-lg'>
                    Аренда и шеринг
                    <div className='text-caption'>
                        Гибкое решение для корпоративных автопарков, сервисов подписки и внутреннего пользования. Легкое управление парком и соответствие современным эко-стандартам.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DirCard;