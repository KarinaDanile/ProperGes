
import { useEffect, useState } from "react";
import { getCities } from "../../../utils/api";
import { NumericFormat } from 'react-number-format';

const FilterForm = ({ onFilter }) => {
    const [filter, setFilter] = useState({
        place : '',
        beds: '',
        baths: '',
        price_min : '',
        price_max : '',
        search: ''
    });

    const [places, setPlaces] = useState([]);

    useEffect(() => {   
        getCities()
            .then((data) => {
                console.log(data)
                setPlaces(data);
            }).catch((error) => {
                console.error(error);
            });

    }, []);

    const handleChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('filter:', filter)
        onFilter(filter);
    };

    /*

    */

    return (
        <form className="flex flex-row flex-wrap justify-center mt-4 p-12 gap-3 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit}>
            <h1>Filtrar</h1>
            <input
                type="text"
                name="search"
                value={filter.search}
                placeholder="Búsqueda"
                onChange={handleChange}
            />
            <select
                className="bg-white border border-gray-300 p-2 rounded-md" 
                name="place" value={filter.place} onChange={handleChange}>
                <option  value="">{""}</option>
                {places.map((place, index) => (
                    <option key={index} value={place}>{place}</option>
                ))}
            </select>
            <input
                type="number"
                name="beds"
                value={filter.beds}
                placeholder="Dormitorios"
                onChange={handleChange}
            />
            <input
                type="number"
                name="baths"
                value={filter.baths}
                placeholder="Baños"
                onChange={handleChange}
            />
            <NumericFormat
                name="price_min"
                value={filter.price_min}
                placeholder="Precio mínimo"
                onValueChange={(values) => {
                    const {formattedValue, value} = values;
                    setFilter({
                        ...filter,
                        price_min: value
                    });
                }}
                thousandSeparator={true}
                suffix={'€'}
                allowNegative={false}
            />
            <NumericFormat
                name="price_max"
                value={filter.price_max}
                placeholder="Precio máximo"
                onValueChange={(values) => {
                    const {formattedValue, value} = values;
                    setFilter({
                        ...filter,
                        price_max: value
                    });
                }}
                thousandSeparator={true}
                suffix={'€'}
                allowNegative={false}
                           
            />
            
            <button className="btn-edit border m-0 border-gray-400 p-2 rounded" type="submit">Filtrar</button>
        </form>
    );

}

export default FilterForm;