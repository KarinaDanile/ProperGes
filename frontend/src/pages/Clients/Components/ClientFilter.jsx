import { useState } from "react";
import Select from "react-select";

const ClientFilter = ({ onFilter }) => {
    const [filter, setFilter] = useState({
        client_type: '',
        is_active: true,
        search: ''
    });
    const [selectedClientType, setSelectedClientType] = useState(null);

    const client_type_options = [
        {value:'comprador', label: 'Comprador'},
        {value: 'vendedor', label: 'Vendedor'},
        {value: 'ambos', label: 'Comprador y vendedor'}, 
    ]
    

    const handleChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.checked
        });
    };

    const handleClientTypeChange = (selectedOption) => {
        setSelectedClientType(selectedOption);
        setFilter({
            ...filter,
            client_type: selectedOption ? selectedOption.value : ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filter);
        
    };

    
    
   
    return (
        <div className="bg-gray-200 p-10 px-24 xl:px-60">
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
                <div className="flex items-center gap-2">
                    <Select 
                        options={client_type_options}
                        className="w-44 "
                        value={selectedClientType}
                        onChange={handleClientTypeChange}
                        placeholder="Tipo de cliente"
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
                </div>
                
            
                

                <div className="flex items-center gap-2">
                    <label htmlFor="is_active">Activo</label>
                    <input
                        className="my-input"
                        type="checkbox"
                        name="is_active"
                        checked={filter.is_active}
                        onChange={handleCheckboxChange}
                    />
                </div>      

                
                <button 
                    className="btn-edit hover:shadow border m-0 border-gray-400 p-2 rounded" 
                    type="submit"
                >Filtrar</button>

                <button
                    className="btn-edit hover:shadow border m-0 -ml-3 border-gray-400 p-2 rounded"
                    onClick={() => {
                        setFilter({
                            client_type: '',
                            is_active: true,
                            search: ''
                        })
                        setSelectedClientType(null);
                    }}
                >Limpiar</button>
            </form>
        </div>
    );

}

export default ClientFilter;