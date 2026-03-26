import PropTypes from 'prop-types';
import batteryIcon from '../../assets/images/icons/battery-icon.svg';
import routeIcon from '../../assets/images/icons/route-icon.svg';
import vanIcon from '../../assets/images/icons/van-icon.svg';
import tengeIcon from '../../assets/images/icons/tengeDark-icon.svg';

function SingleCard({ car, onSelect }) {
    return (
        <div className='card'>
            <div className='card-img-wrap'>
                <img src={car.image} alt={`${car.brand} ${car.model}`} className='card-img' />
            </div>
            <div className='card-titles'>
                <div className='text-body-lg card-inner-title'>{car.brand} {car.model}</div>
                <div className='text-caption title-in card-inner-description'>{car.capacity}</div>
                <div className='catalog-line'></div>
                <div className='card-params'>
                    <div className='one-param text-body-md'>
                        <img src={batteryIcon} alt='battery-icon' />
                        {car.battery}
                    </div>
                    <div className='one-param text-body-md'>
                        <img src={routeIcon} alt='route-icon' />
                        {car.range}
                    </div>
                    <div className='one-param text-body-md'>
                        <img src={vanIcon} alt='van-icon' />
                        {car.weight}
                    </div>
                </div>
                <div className='catalog-line'></div>
                <div className='card-price'>
                    <div className='card-cost text-caption'>
                        от {car.price} <img src={tengeIcon} alt='tenge-icon' />
                    </div>
                    <button className='card-button text-caption' onClick={() => onSelect(car)}>
                        Посмотреть детали
                    </button>
                </div>
            </div>
        </div>
    );
}

SingleCard.propTypes = {
    car: PropTypes.shape({
        id: PropTypes.number,
        brand: PropTypes.string,
        model: PropTypes.string,
        capacity: PropTypes.string,
        battery: PropTypes.string,
        range: PropTypes.string,
        weight: PropTypes.string,
        price: PropTypes.string,
        image: PropTypes.string,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default SingleCard;
