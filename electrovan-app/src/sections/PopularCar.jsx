import PopularCard from '../components/PopularCard';
import { popularcar } from '../data/popularcar';

function PopularCar({ onOpenModal }) {
    return (
        <section className='catalog-section'>
            <div className='container'>
                <div className='catalog-title'>
                    <div className='text-display-xl'>
                        Наши популярные модели
                    </div>
                </div>
            </div>
            <PopularCard popularcar={popularcar} onOpenModal={onOpenModal}/>
        </section>
    );
}

export default PopularCar;