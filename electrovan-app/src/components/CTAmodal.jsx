import { useState } from 'react';
import crossIcon from '../assets/images/icons/cross-icon.svg';

function CTAmodal({ onClose, onSubmit }) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleClose();
        onSubmit();
    };

    return (
        <section className={`modal-section${isClosing ? ' modal-section--closing' : ''}`} onClick={handleClose}>
            <div className="container">
                <div className="modalcta-back" onClick={(e) => e.stopPropagation()}>
                    <button className='modal-close' onClick={handleClose}>
                        <img src={crossIcon} alt='cross-icon' />
                    </button>
                    <div className="modalcta-title text-display-xl">
                        Оставить заявку на <span>рассмотрение</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modalcta-graphs">
                            <div className="one-graph">
                                <div className="graph-title text-heading-lg">Ваше имя</div>
                                <input
                                    type='text'
                                    className="text-graph text-body-lg"
                                    placeholder="Введите имя.."
                                />
                            </div>
                            <div className="one-graph">
                                <div className="graph-title text-heading-lg">Номер телефона</div>
                                <input
                                    type='tel'
                                    name='phone'
                                    className="text-graph text-body-lg"
                                    placeholder="Введите номер телефона.."
                                    pattern="[\+]?[78]?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}"
                                    required
                                />
                            </div>
                            <button type='submit' className="feedback-button text-heading-lg">
                                Оставить заявку
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default CTAmodal;