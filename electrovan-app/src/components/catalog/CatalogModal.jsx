import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import crossIcon from '../../assets/images/icons/cross-icon.svg';
import tengeIcon from '../../assets/images/icons/tengeDark-icon.svg';

function CatalogModal({ car, onClose, onOpenCtaModal }) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    // Lock background scroll while modal is open
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    return (
        <section
            className={`modal-section${isClosing ? ' modal-section--closing' : ''}`}
            onClick={handleClose}
        >
            <button className='modal-close' onClick={handleClose}>
                <img src={crossIcon} alt='cross-icon' />
            </button>
            <div className="modalcat-back" onClick={(e) => e.stopPropagation()}>
                <img src={car.modalImage} alt={`${car.brand} ${car.model}`} />
                <div className='modal-info'>
                    <div className='modal-title text-heading-xl'>
                        {car.brand} {car.model}
                    </div>
                    <div className='modal-subtitle text-body-lg'>
                        {car.description}
                    </div>
                    <div className='modal-used'>
                        <div className='modal-used-label text-caption'>Применяется в:</div>
                        <div className='modal-used-tags'>
                            {(car.usedIn ?? []).map((tag) => (
                                <span key={tag} className='modal-used-tag text-caption'>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className='specs'>
                        <div className='specs-row'>
                            <span className='label'>Грузоподъемность</span>
                            <span className='value'>{car.weight}</span>
                        </div>
                        <div className='specs-row'>
                            <span className='label'>Габариты (ДхШхВ)</span>
                            <span className='value'>{car.dimensions}</span>
                        </div>
                        <div className='specs-row'>
                            <span className='label'>Объем кузова</span>
                            <span className='value'>{car.volume}</span>
                        </div>
                        <div className='specs-row'>
                            <span className='label'>Емкость батареи</span>
                            <span className='value'>{car.battery}</span>
                        </div>
                        <div className='specs-row'>
                            <span className='label'>Запас хода</span>
                            <span className='value'>{car.range}</span>
                        </div>
                        <div className='specs-row'>
                            <span className='label'>Количество мест</span>
                            <span className='value'>{car.seats}</span>
                        </div>
                        <div className='specs-row'>
                            <span className='label'>Наличие гарантии</span>
                            <span className='value'>{car.warranty ? 'есть' : 'нет'}</span>
                        </div>
                    </div>
                    <div className='modal-specs-line'></div>
                    <div className='modal-end'>
                        <button className='guarantees-button text-caption'>
                            Условия гарантии
                        </button>
                        <div className='model-line'></div>
                        <div className='modal-price'>
                            <div className='modal-cost text-body-md'>
                                Стоимость: ~{car.fullPrice}
                                <img src={tengeIcon} alt='tenge-icon' />
                            </div>
                            <button
                                className='order-button'
                                onClick={() => {
                                    handleClose();
                                    setTimeout(() => onOpenCtaModal?.(), 350);
                                }}
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

CatalogModal.propTypes = {
    car: PropTypes.shape({
        brand: PropTypes.string,
        model: PropTypes.string,
        description: PropTypes.string,
        usedIn: PropTypes.arrayOf(PropTypes.string),
        weight: PropTypes.string,
        dimensions: PropTypes.string,
        volume: PropTypes.string,
        battery: PropTypes.string,
        range: PropTypes.string,
        seats: PropTypes.number,
        warranty: PropTypes.bool,
        fullPrice: PropTypes.string,
        modalImage: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onOpenCtaModal: PropTypes.func,
};

export default CatalogModal;
