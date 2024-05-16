import { useState, useEffect } from "react"
import CreatableSelect, { useCreatable } from 'react-select/creatable';

export default function AddProperty({setShowModal}) {
    const [formData, setFormData] = useState({
        property_type: "",
        price: "",
        address: "",
        city: "",
        province: "",
        state: "",
        beds: "",
        baths: "",
        sqft: "",
        owner: "",
    });

    const [ owners, setOwners ] = useState([]);
    const [ value, setValue ] = useState(null);
    
    useEffect(() => {
        // fetch owners
        setOwners([
            { id: 1, name: 'John Doe', email: 'email@email.com', phone: '' },
            { id: 2, name: 'Jane Doe', email: '', phone: '388999111' },
            { id: 3, name: 'John Smith', email: 'email.com', phone: '33331111' },
            { id: 4, name: 'Jane Smith', email: 'ejals', phone: '' },
        ]);
    
    }, []);
    
    const type_options = [
        'Apartamento', 
        'Casa', 
        'Chalet', 
        'Duplex', 
        'Estudio', 
        'Local', 
        'Oficina',
        'Piso', 
        'Plaza de garaje', 
        'Solar', 
        'Trastero',
        'Villa', 
        'Otro'   
    ]
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // update owner
        console.log("value",value)
        console.log("value.id",value.id)
        
        
        formData.owner = value.id;
        
     
        console.log('Adding property:', formData);
      
        
        try {
            // const { data } = await api.post('/properties/', formData);
            // console.log(data);
        }
        catch (error) {
            console.error(error.response.data.error);
        }
    }


    const cleanForm = () => {
        setFormData({
            property_type: "",
            price: "",
            address: "",
            city: "",
            province: "",
            state: "",
            beds: "",
            baths: "",
            sqft: "",
            owner: "",
        });
    }

    const handleCreateNewOwner = (inputValue) => {
        // crear nuevo propietario y peticion a la API
        //setOwners([...owners, { value: inputValue, label: inputValue }]);
        console.log('Creating new owner:', inputValue);
      
        // abrir vista añadir cliente
        //llamada a la api 

        // actualizar todos los owners
        // obtener el id del nuevo owner recien creado buscando por nombre
        // si hay varias coincidencias, implementar un metodo para seleccionar el correcto
        // volviendo aqui actualizar el formData.owner con el id

        // getOwners();

        // getOwnerByName(inputValue);



        // Prueba
        const newOwner = { id: 5, name: inputValue, email: 'this is the new one', phone: '' };
        setOwners([ newOwner, ...owners ]);



        setValue(newOwner);
 
    }

    const customLabel = (option) => {
        if (option.__isNew__) {
            return 'Crear nuevo';
        }
        return (
            <>
                <div>{option.name}</div>
                <div>{option.phone}</div>
                <div>{option.email}</div>
            </>
        )
        
    }
 
    const formatCreateLabel = (inputValue) => 'Create new...';
 

    return (
        <div className="addPropertyForm">
            <h3>Add Property</h3>
            <span>Here you can add a new property</span>
            
            <form onSubmit={handleSubmit}>
                <label> Tipo de propiedad: {" "}
                    <select name="property_type" required value={formData.property_type} onChange={handleChange}>    
                        <option value="" disabled>Seleccione un tipo</option>
                        {type_options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}     
                    </select>
                </label>

                <label> Precio: {" "}
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label> Dirección: {" "}
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label> Ciudad: {" "}
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />  
                </label>
                <label> Provincia: {" "}
                    <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label> Región: {" "}
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label> Dormitorios: {" "}
                    <input
                        type="number"
                        name="beds"
                        value={formData.beds}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label> Baños: {" "}
                    <input
                        type="number"
                        name="baths"
                        value={formData.baths}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label> Metros cuadrados: {" "}
                    <input
                        type="number"
                        name="sqft"
                        value={formData.sqft}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label
                    style={{width: '50%'}}
                > Propietario: {" "}
                    <CreatableSelect 
                        isClearable 
                        isCreatable
                        value={value} 
                        onChange={(newValue) => setValue(newValue)} 
                        onCreateOption={handleCreateNewOwner} 
                        options={owners} 
                        noOptionsMessage={() => null}
                        formatOptionLabel={customLabel}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        getNewOptionData={(value, label) => ({ id: value, label: label, __isNew__: true}) }
                        createOptionPosition="first"
                        
                        
                    />               
                </label>
               
                
                <br />
                <button type="submit">Añadir propiedad</button>

            </form>
            
            
            
            
            
            
            <br />

            <button
                onClick={() => setShowModal(false)}
            >Cerrar</button>
        </div>
    )
}