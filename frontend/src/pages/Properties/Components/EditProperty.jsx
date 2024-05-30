import { useState, useEffect, useCallback } from "react"
import CreatableSelect from 'react-select/creatable';
import { NumericFormat } from 'react-number-format';
import { getCoordinates } from "../../../utils/getCoordinates";
import "mapbox-gl/dist/mapbox-gl.css";
import { getOwners } from "../../../utils/api";
import AddOwner from "../../Clients/AddOwner";
import api from "../../../utils/api";
import { useDropzone } from "react-dropzone";
import Spinner from "../../../components/Spinner";
import { capitalize } from "../../../utils/property_utils";

const EditProperty = ({ property, setShowEditForm, updateProperty}) => {
    
    
    const [ formData, setFormData ] = useState(property);
    console.log("fromdata",formData)

    const images = [...formData.images];
    const [ existingImages, setExistingImages ] = useState(images)
    console.log("existing images",existingImages)
    const [ imagesToDelete, setImagesToDelete ] = useState([]);
    console.log("images to delete",imagesToDelete)

    const [ loading, setLoading ] = useState(true);

    const [ error, setError ] = useState(null);
    const [ owners, setOwners ] = useState([]);
    const [ showOwnerCreate, setShowOwnerCreate ] = useState(false);
    const [ newOwner, setNewOwner ] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [ selectedClient, setSelectedClient ] = useState(null);
    const [ files, setFiles ] = useState([]);

    useEffect(() => {
        setLoading(true);
        getOwners().then((data) => {
            setOwners(data);
            const initialOwner = data.find(owner => owner.client_id === formData.owner);
            if(initialOwner){
                setSelectedClient({ value: initialOwner.client_id, label: initialOwner.iden_client });
            } else {
                setSelectedClient(null);
            }
        }).catch((error) => {
            console.error("Error loading owners", error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    
    const type_options = [
        'apartamento', 
        'casa', 
        'chalet', 
        'duplex', 
        'estudio', 
        'local', 
        'oficina',
        'piso', 
        'villa', 
        'otro'   
    ]

    const state_options = [
        'Buen estado',
        'Nuevo',
        'Reformado',
        'A reformar'
    ]
    
    const handleChange = useCallback((e) => {
        setFormData(prevFormData => ( {
            ...prevFormData,
            [e.target.name]: e.target.value,
        }));
    }, []);

    const handleNegotiableChange = (e) => {
        const { checked } = e.target;
        setFormData({
            ...formData,
            is_negotiable: checked,
        });
    }

   
     

    const mapStateToBackend = (value) => {
        switch(value) {
            case 'Buen estado':
                return 'buen_estado';
            case 'Nuevo':
                return 'nuevo';
            case 'Reformado':
                return 'reformado';
            case 'A reformar':
                return 'a_reformar';
            default:
                return 'buen_estado';
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        formData.owner = selectedClient.value;
        formData.property_type = formData.property_type.toLowerCase();

        try{
            const coordinates = await getCoordinates(formData.place_name);
            const updatedFormData = {
                ...formData,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            }
            
            const mappedState = mapStateToBackend(updatedFormData.state);
            const dataToSend = { ...updatedFormData, state: mappedState, imagesToDelete };
         
            const formDataFinal = new FormData();
            Object.keys(dataToSend).forEach(key => {
                if (key === 'images') {
                    files.forEach(file => {
                        formDataFinal.append('images', file);
                    });
                } else {
                    formDataFinal.append(key, dataToSend[key])
                };
            });
            console.log('Updating property:', formDataFinal);
            
            try{
                const response = await api.put(`/properties/${property.property_id}/`, formDataFinal);
                console.log(response);
                if (response.status === 200) {  
                    console.log("Property updated successfully");
                    updateProperty(response.data);
                }
                setShowEditForm(false);
            } catch (error){
                console.error("Error updating property", error);
                setError("Error actualizando la propiedad");
            }
        
        
        } catch (error) {
            console.error("Error obteniendo las coordenadas",error);
        }
    }

    const handleCreateNewOwner = (inputValue) => {
        setNewOwner({
            ...newOwner,
            name: inputValue,
        })
        setShowOwnerCreate(true);
    }

    
    const handleModalClose = () => {
        setShowOwnerCreate(false);
        getOwners().then((data) => {
            setOwners(data);
            console.log(data)
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            console.log('Owners loaded');
        });
    }

    const onDrop = useCallback(acceptedFiles => {
        console.log('accepted files',acceptedFiles);
        
        if(acceptedFiles?.length){
            const uniqueFiles = acceptedFiles.filter(file => !files.some(f => f.name === file.name));
            const duplicateFiles = acceptedFiles.filter(file => !uniqueFiles.includes(file));
            if(duplicateFiles.length > 0){
                alert(`Los siguientes archivos ya están seleccionados: ${duplicateFiles.map(file => file.name).join(', ')}`)
            }
            
            setFiles(previousFiles => [
                ...previousFiles,
                ...uniqueFiles.map(file => 
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            ])
        }
        
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop, 
        accept:{'image/*': []},
        maxSize: 1000000,
    });

    const removeFile = (name) => {
        setFiles(files => files.filter(file => file.name !== name));
    }

    const removeExistingImage = (id) => {
        setImagesToDelete([...imagesToDelete, id]);
        
        const updatedExistingImages = [...existingImages]
        const index = updatedExistingImages.findIndex(image => image.id === id);
        updatedExistingImages.splice(index, 1);
        setExistingImages(updatedExistingImages);
    }


 
    return (
        <>


        { loading ? <Spinner/> :
        (
            <>
            { showOwnerCreate ? 
                <AddOwner 
                    newOwner={newOwner} 
                    handleModalClose={handleModalClose} 
                    setShowModal={setShowOwnerCreate} 
                /> 
                : (
                    <>
                    <div className="formWrapper">
                        <div className="addForm">

                            <h3 className="text-xl border-b-2 mb-4">Editar propiedad</h3>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label> Tipo de propiedad: {" "}
                                        <select 
                                            name="property_type" 
                                            required 
                                            value={formData.property_type} 
                                            onChange={handleChange}   
                                        >    
                                            {type_options.map((option) => (
                                                <option key={option} value={option}>{capitalize(option)}</option>
                                            ))}     
                                        </select>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label> Estado de la propiedad: {" "}
                                        <select 
                                            name="state" 
                                            required 
                                            value={formData.state} 
                                            onChange={handleChange}   
                                        >    
                                            {state_options.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}     
                                        </select>
                                    </label>
                                </div>
                                
                                
                                <div className="form-group">
                                    <label> Propietario: {" "}
                                        
                                        <CreatableSelect 
                                            isClearable
                                            options={owners.map(owner => ({value: owner.client_id, label: owner.iden_client}))}
                                            value={selectedClient}
                                            onChange={(newValue) => setSelectedClient(newValue)}
                                            onCreateOption={handleCreateNewOwner}
                                            formatCreateLabel={(inputValue) => `Crear nuevo propietario: ${inputValue}`}
                                            placeholder="Selecciona o crea un propietario"
                                        />
                                    </label>
                                    
                                </div>

                                
                                <div className="form-group">
                                    <label> Dirección completa:
                                        <input 
                                            className="w-full"
                                            type="text" 
                                            name="place_name"
                                            value={formData.place_name}  
                                            onChange={handleChange}
                                        /> 
                                    </label>
                                    <label> Ciudad: 
                                        <input 
                                        className="w-full"
                                            type="text" 
                                            name="place"
                                            value={formData.place}
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label> Región: 
                                        <input 
                                        className="w-full"
                                            type="text" 
                                            value={formData.region}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                                            
                                <div className="form-group flex gap-4 flex-wrap">
                                    <label className="flex-1"> Precio: 
                                        <NumericFormat
                                            className="w-full"
                                            thousandSeparator={true}
                                            suffix={'€'}
                                            allowNegative={false}
                                            placeholder="Indique el precio"
                                            value={formData.price}
                                            onValueChange={(values) => {
                                                const {formattedValue, value} = values;
                                                setFormData({
                                                    ...formData,
                                                    price: value
                                                });
                                            }}
                                            required
                                        />
                                    </label>
                                
                                    <label className="flex-1"> Dormitorios: 
                                        <input
                                            className="w-full"
                                            type="number"
                                            placeholder="Indique un número"
                                            name="beds"
                                            value={formData.beds}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                
                                
                                    <label className="flex-1"> Baños:
                                        <input
                                            className="w-full"
                                            type="number"
                                            placeholder="Indique un número"
                                            name="baths"
                                            value={formData.baths}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                
                                
                                    <label className="flex-1"> Superficie construida:
                                        <input
                                            className="w-full"
                                            type="number"
                                            placeholder="Indique los m²"
                                            name="sqft"
                                            value={formData.sqft}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>

                                </div>
                                
                                <div className="form-group mt-2">
                                    <label> Año construcción: {" "}
                                        <input
                                            type="number"
                                            placeholder="Indique el año"
                                            name="year_built"
                                            value={formData.year_built}
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="flex checkbox-container items-center gap-1">
                                        <input
                                            type="checkbox"
                                            name="is_negotiable"
                                            checked = {formData.is_negotiable}
                                            value={formData.is_negotiable}
                                            onChange={handleNegotiableChange}
                                        />
                                        Precio negociable?
                                    
                                    </label>
                                
                                </div>
                                

                                <div className="form-group">    
                                <label>
                                        <textarea 
                                            className="w-full border border-gray-300 p-2 min-h-32 "
                                            placeholder="Escriba aquí la descripción de la propiedad..."
                                            name="description" 
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        ></textarea>
                                    </label>
                                </div>          
                                <div className="uploadContainer">
                                    <div  {...getRootProps({
                                        className:"bg-gray-100 p-6 w-44 border-2 border-dashed"
                                    })}>
                                        <input {...getInputProps()} />
                                        <p className="font-light text-gray-500 text-sm">Arrastra aquí las imágenes o haz click para seleccionarlas</p>
                                    </div>

                                    <div className="flex flex-wrap">
                                        {existingImages && existingImages.map((image) => (
                                            <div
                                                className="relative p-3"
                                                key={image.id}
                                            >
                                                <img
                                                    src={image.image}
                                                    alt="imagen existente"
                                                    width={100}
                                                    height={100}
                                                />
                                                <button
                                                    className="m-0 absolute top-0 p-1 right-0 bg-transparent rounded-full text-red-600 font-bold hover:text-2xl hover:bg-transparent"
                                                    type="button"
                                                    onClick={() => removeExistingImage(image.id)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))

                                        }

                                        {files.map((file) => (
                                            <div
                                                className="relative p-3"
                                                key={file.name} 
                                            >
                                                <img 
                                                    src={file.preview}
                                                    alt={file.name}
                                                    width={100}
                                                    height={100}
                                                    onLoad={() => {
                                                        URL.revokeObjectURL(file.preview);
                                                    }}
                                                />
                                                <button
                                                    className="m-0 absolute top-0 p-1 right-0 bg-transparent rounded-full text-red-600 font-bold hover:text-2xl hover:bg-transparent"
                                                    type="button"
                                                    onClick={() => removeFile(file.name)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                            
                                        ))}
                                    </div>
                                </div>

                                
                                <br />
                                <div className="flex justify-between flex-row-reverse">
                                    <button className="btn-add" type="submit">Guardar propiedad</button>
                                    
                                    <button
                                        className="btn-cancel"
                                        onClick={() => setShowEditForm(false)}
                                    >Cerrar</button>
                                </div>

                                {error && <><br /> <div className="text-red-600 border border-red-600 border-dashed p-2">{error}</div></>}


                            </form>

                            <br />
                        </div>
                    </div>
                    </>
                )
                }
                </>

        )
    }

       </>
    )
}

export default EditProperty;