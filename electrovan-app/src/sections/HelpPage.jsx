import batteryLightIcon from '../assets/images/icons/batteryLight-icon.svg';
import routeLightIcon from '../assets/images/icons/routeLight-icon.svg';
import vanLightIcon from '../assets/images/icons/vanLight-icon.svg';

function HelpPage() {
    return (
        <section className="help-section" id="help">
            <div className="container">
                <div className="help-title text-heading-xl">
                    Как сделать правильный <span>выбор?</span>
                </div>
                <div className='help-content'>
                    <div className='help-categories'>
                        <div className='recommend-items text-heading-lg'>
                            <img src={batteryLightIcon} alt='battery-icon' />
                            кВт*ч
                        </div>
                        <div className='text-heading-lg'>Оптимальная батарея для определенных целей</div>
                        <div className='text-body-lg'>
                            <span>
                                Важно иметь представление какой размер батареи будет для вас достаточным,
                                обычно от нее зависит какое расстояние проедет машина
                            </span>
                        </div>
                    </div>
                    <div className='help-categories'>
                        <div className='recommend-items text-heading-lg'>
                            <img src={routeLightIcon} alt='route-icon' />
                            километры
                        </div>
                        <div className='text-heading-lg'>Расстояние, которое проедет авто</div>
                        <div className='text-body-lg'>
                            <span>
                                Обычно расстояние нужное для определенных целей меняется,
                                из-за чего нужно иметь представление какое расстояние преодалевается
                            </span>
                        </div>
                    </div>
                    <div className='help-categories'>
                        <div className='recommend-items text-heading-lg'>
                            <img src={vanLightIcon} alt='van-icon' />
                            тонны
                        </div>
                        <div className='text-heading-lg'>Нужная вместимость с учетом цели</div>
                        <div className='text-body-lg'>
                            <span>
                                Нужно понимать, что именно вы хотите перевозить и в каком размере.
                                Например - 8 человек или вес - до 2 тонн
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HelpPage;