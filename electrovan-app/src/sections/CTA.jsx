import FeedbackIcon from '../assets/images/icons/mail-icon.svg?react';

function CTA({ onOpenModal }) {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-block">
                    <div className="cta-title text-display-xl">
                        Готовы приобрести себе <span>электротранспорт?</span>
                    </div>
                    <div className="feedback-title text-body-md">
                        Мы поможем подобрать оптимальное решение для вашего бизнеса и ответим на все вопросы.
                    </div>
                    <button className="cta-button text-heading-lg" onClick={onOpenModal}>
                        Оставьте заявку
                        <FeedbackIcon alt='mail-icon' />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CTA;