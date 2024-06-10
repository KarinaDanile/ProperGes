
import { useEffect, useState } from "react";
import { getCities } from "../../../utils/api";
import { NumericFormat } from 'react-number-format';
import Select from 'react-select';

const FilterForm = ({ onFilter }) => {
    const [filter, setFilter] = useState({
        place : '',
        property_type: '',
        beds: '',
        baths: '',
        price_min : '',
        price_max : '',
        search: ''
    });

    const [places, setPlaces] = useState([]);
    const propertyTypes = [
        {value: 'apartamento', label: 'Apartamento'},
        {value: 'casa', label: 'Casa'},
        {value: 'chalet', label: 'Chalet'},
        {value: 'duplex', label: 'Duplex'},
        {value: 'estudio', label: 'Estudio'},
        {value: 'local', label: 'Local'},
        {value: 'oficina', label: 'Oficina'},
        {value: 'piso', label: 'Piso'},
        {value: 'solar', label: 'Solar'},
        {value: 'trastero', label: 'Trastero'},
        {value: 'villa', label: 'Villa'},
        {value: 'otro', label: 'Otro'}
    ];
    const [selectedPropertyType, setSelectedPropertyType] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const handlePropertyTypeChange = (selectedOption) => {
        setSelectedPropertyType(selectedOption);
        setFilter({
            ...filter,
            property_type: selectedOption ? selectedOption.value : ''
        });
    };

    const handlePlaceChange = (selectedOption) => {
        setSelectedPlace(selectedOption);
        setFilter({
            ...filter,
            place: selectedOption ? selectedOption.value : ''
        });
    }

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

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevState) => ({
            ...prevState,
            [name]: Number(value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('filter:', filter)
        onFilter(filter);
    };
    
   
    return (
        <form 
            className="flex flex-row mt-4 flex-wrap justify-center p-12 gap-3 bg-white rounded-lg shadow-lg" 
            onSubmit={handleSubmit}        
        >
            <h1>Filtros</h1>
            <input
                className="my-input"
                type="text"
                name="search"
                value={filter.search}
                placeholder="Búsqueda"
                onChange={handleChange}
            />
            
            <Select
                options={propertyTypes}
                className="w-44 "
                value={selectedPropertyType}
                onChange={handlePropertyTypeChange}
                placeholder="Tipo propiedad"
                isClearable
                styles={{
                    indicatorSeparator: () => {},
                    control: (styles) => ({
                        ...styles,
                        borderRadius: '0.375rem',
                        borderColor: '#cbd5e0',
                        height: '40px',
                        '&:hover': {
                            borderColor: '#cbd5e0',
                        }
                    }),
                    valueContainer: (styles) => ({
                        ...styles,
                        height: '40px',
                        padding: '0 6px',
                    }),
                    input: (provided, state) => ({
                        ...provided,
                        padding: 0,
                        margin: 0,
                    }),
                    indicatorsContainer: (styles) => ({
                        ...styles,
                        height: '40px',
                    }),
                    placeholder: (styles) => ({
                        ...styles,
                        color: '#A0AEC0',
                    }),
                }}
            />
            
            <Select
                className="w-44"
                options={places.map((place) => ({value: place, label: place}))}
                value={selectedPlace}
                
                onChange={handlePlaceChange}
                placeholder="Localidad"
                isClearable
                styles={{
                    indicatorSeparator: () => {},
                    control: (styles) => ({
                        ...styles,
                        borderRadius: '0.375rem',
                        borderColor: '#cbd5e0',
                        height: '40px',
                        '&:hover': {
                            borderColor: '#cbd5e0',
                        }
                    }),
                    valueContainer: (styles) => ({
                        ...styles,
                        height: '40px',
                        padding: '0 6px',
                    }),
                    input: (provided, state) => ({
                        ...provided,
                        padding: 0,
                        margin: 0,
                    }),
                    indicatorsContainer: (styles) => ({
                        ...styles,
                        height: '40px',
                    }),
                    placeholder: (styles) => ({
                        ...styles,
                        color: '#A0AEC0',
                    }),
                }}
                
            />

            
            
            <input
                className="my-input"
                type="number"
                name="beds"
                value={filter.beds}
                placeholder="Dormitorios"
                onChange={handleChange}
            />
            <input
                className="my-input"
                type="number"
                name="baths"
                value={filter.baths}
                placeholder="Baños"
                onChange={handleChange}
            />
            <div>

            
                <div className="flex flex-row gap-3">
                    <NumericFormat
                        className="my-input"
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
                        className="my-input"
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
                </div>
                         

            </div>
            
            <button 
                className="btn-edit border m-0 border-gray-400 p-2 rounded" 
                type="submit"
            >Filtrar</button>

            <button
                className="btn-edit border m-0 border-gray-400 p-2 -ml-3 rounded"
                onClick={() => {
                    setFilter({
                        place : '',
                        property_type: '',
                        beds: '',
                        baths: '',
                        price_min : '',
                        price_max : '',
                        search: ''
                    })
                    setSelectedPlace(null);
                    setSelectedPropertyType(null);
                }}
            >Limpiar</button>
        
        </form>
    );

}

export default FilterForm;