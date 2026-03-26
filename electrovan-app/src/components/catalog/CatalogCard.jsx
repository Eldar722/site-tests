import { useState } from 'react';
import PropTypes from 'prop-types';
import SingleCard from './SingleCard.jsx';
import CatalogModal from './CatalogModal.jsx';

function CatalogCard({ cars = [], onOpenModal }) {
    const [selectedCar, setSelectedCar] = useState(null);

    return (
        <>
            <div className='catalog-cards'>
                {cars.map((car) => (
                    <SingleCard
                        key={car.id}
                        car={car}
                        onSelect={setSelectedCar}
                    />
                ))}
            </div>

            {selectedCar && (
                <CatalogModal
                    car={selectedCar}
                    onClose={() => setSelectedCar(null)}
                    onOpenCtaModal={onOpenModal}
                />
            )}
        </>
    );
}

CatalogCard.propTypes = {
    cars: PropTypes.array,
    onOpenModal: PropTypes.func,
};

export default CatalogCard;
