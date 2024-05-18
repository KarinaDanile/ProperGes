import { useState, useEffect } from "react"
import CreatableSelect from 'react-select/creatable';
import AutoCompleteInput from "./AddressInput";
import "mapbox-gl/dist/mapbox-gl.css";
import { getOwners } from "../../utils/api";

export default function AddProperty({setShowModal}) {
    const [formData, setFormData] = useState({
        property_type: "",
        price: "",
        streetAndNumber: "",
        city: "",
        region: "",
        postcode: "",
        country: "",
        latitude: "",
        longitude: "",
        beds: "",
        baths: "",
        sqft: "",
        owner: "",
    });


    const [ owners, setOwners ] = useState([]);
    const [ value, setValue ] = useState(null);
    
    useEffect(() => {
        // getOwners();
        getOwners().then((data) => {
            setOwners(data);
            console.log(data)
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            console.log('Owners loaded');
        });
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

        console.log("formData",formData)
        console.log("address",address.value) // el input
        
        
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
 
 

    return (
        <div className="formWrapper">
        <div className="addForm">
            <h3 className="text-xl border-b-2 mb-4">Añadir nueva propiedad</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label> Tipo de propiedad: {" "}
                        <select name="property_type" required value={formData.property_type} onChange={handleChange}>    
                            <option value="" disabled> - - - - - - - - - - </option>
                            {type_options.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}     
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label> Precio: {" "}
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">

                    <AutoCompleteInput
                        formData={formData}
                        setFormData={setFormData}

                    />

                </div>
              
              
                <div className="form-group">
                    <label> Dormitorios: {" "}
                        <input
                            type="number"
                            name="beds"
                            value={formData.beds}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label> Baños: {" "}
                        <input
                            type="number"
                            name="baths"
                            value={formData.baths}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label> Metros cuadrados: {" "}
                        <input
                            type="number"
                            name="sqft"
                            value={formData.sqft}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
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
                            required
                            
                        />               
                    </label>
                </div>
                
                <br />
                <div className="flex justify-between flex-row-reverse">
                    <button type="submit">Añadir propiedad</button>
                    
                    <button
                        onClick={() => setShowModal(false)}
                    >Cerrar</button>
                </div>
            </form>

            <br />
            
        </div>
    </div>
    )
}