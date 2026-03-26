import WhatsappIcon from "../assets/images/socials/whatsapp.svg"
import TelegramIcon from "../assets/images/socials/telegram.svg"

function Footer({ onOpenModal }) {
    return (
        <footer className="page-blue" id="contacts">
            <div className="container">
                <div className="footer-container">
                    <div className="footer-brand">
                        <span className="footer-logo text-display-xl text-white-base">ElectroVan</span>
                        <ul className="footer-feature text-white-base text-caption">
                            <li>Коммерческий электротранспорт для бизнеса.</li>
                            <li>Снижение затрат на эксплуатацию до 70%.</li>
                            <li>Надежность и простое обслуживание.</li>
                        </ul>
                    </div>
                    <div className="footer-socials">
                        <h3 className="footer-title text-white-base text-heading-lg">Соц. сети</h3>
                        <ul className="social-list">
                            <li>
                                <a href="#" className="social-link">
                                    <img src={WhatsappIcon} alt="Whatsapp" className="social-link-icon" />
                                    <span className="social-link-text text-body-lg text-white-base">Whatsapp</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link">
                                    <img src={TelegramIcon} alt="Telegram" className="social-link-icon" />
                                    <span className="social-link-text text-body-lg text-white-base">Telegram</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-contacts">
                        <h3 className="footer-title text-heading-lg text-white-base">Контакты</h3>
                        <a href="tel:+77777777777" className="footer-phone text-body-lg text-white-base">+7 777 777 77 77</a>
                        <a href="mailto:info@electrovan.kz" className="footer-email text-body-lg text-white-base">info@electrovan.kz</a>
                        <button className="footer-cta-btn text-body-lg" onClick={onOpenModal}>Рассчитать экономию</button>
                        <div className="footer-warranty text-white-base">Гарантия до <strong>50 000 км</strong></div>
                    </div>
                </div>
                <hr className="footer-divider" />
                <div className="footer-bottom">
                    <p className="footer-copyright">&copy; 2026 ElectroVan</p>
                    <div className="footer-legal">
                        <a href="#">Политика конфиденциальности</a>
                        <a href="#">Пользовательское соглашение</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;