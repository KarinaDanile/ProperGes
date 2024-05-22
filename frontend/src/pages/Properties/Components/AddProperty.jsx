import { useState, useEffect, useCallback } from "react"
import CreatableSelect from 'react-select/creatable';
import { NumericFormat } from 'react-number-format';
import AutoCompleteInput from "./AddressInput";
import "mapbox-gl/dist/mapbox-gl.css";
import { getOwners } from "../../../utils/api";
import AddOwner from "../../Clients/AddOwner";
import api from "../../../utils/api";
import { useDropzone } from "react-dropzone";


export default function AddProperty({setShowModal, updateProperties}) {
    const [ conApi, setConApi ] = useState(true);
    const [formData, setFormData] = useState({
        property_type: "apartamento",
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
        description: "",
        images: [],
    });
    const [ error, setError ] = useState(null);
    const [ owners, setOwners ] = useState([]);
    const [ value, setValue ] = useState(null); // owner value from creatable select
    const [ showOwnerCreate, setShowOwnerCreate ] = useState(false);
    const [ newOwner, setNewOwner ] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [ files, setFiles ] = useState([]);

    useEffect(() => {
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
        formData.owner = value.client_id;
        formData.property_type = formData.property_type.toLowerCase();
     
        const formDataFinal = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                files.forEach(file => {
                    formDataFinal.append('images', file);
                });
            } else {
                formDataFinal.append(key, formData[key])
            };
        });
        console.log('Adding property:', formDataFinal);
        try {
            const response = await api.post('/properties/', formDataFinal, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            console.log(response)
            if (response.status === 201) {
                setShowModal(false);
                updateProperties();
            } else {
                setError('Ha ocurrido un error en el post');
                setTimeout(() => {
                    setError(null);
                }, 2000);
            }
        } catch (error) {
            setError('Ha ocurrido un error al añadir la propiedad');
            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    }

    const cleanForm = () => {
        setFormData({
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
    }

    const handleCreateNewOwner = (inputValue) => {
        setNewOwner({
            ...newOwner,
            name: inputValue,
        })
        setShowOwnerCreate(true);
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
        console.log('files',files)
        if(acceptedFiles?.length){
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles.map(file => 
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
 
    return (
        <div className="formWrapper">
        <div className="addForm">
        { showOwnerCreate ? 
        <AddOwner 
            newOwner={newOwner} 
            handleModalClose={handleModalClose} 
            setShowModal={setShowOwnerCreate} 
        /> 
        : (
            <>

            <h3 className="text-xl border-b-2 mb-4">Añadir nueva propiedad</h3>
            
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
                                <option key={option} value={option}>{option}</option>
                            ))}     
                        </select>
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
                
                <div className="form-group">
                    <label> Dirección:
                        { conApi ? 
                        <AutoCompleteInput
                        formData={formData}
                        setFormData={setFormData}
                    /> : (
                        <input
                            className="w-full"
                            type="text"
                            placeholder="Input de dirección temporal"
                            name="streetAndNumber"
                            value={formData.streetAndNumber}
                            onChange={handleChange}
                            required
                        />
                        )
                    }
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
                    <button className="btn-add" type="submit">Añadir propiedad</button>
                    
                    <button
                        className="btn-cancel"
                        onClick={() => setShowModal(false)}
                    >Cerrar</button>
                </div>

                {error && <><br /> <div className="text-red-600 border border-red-600 border-dashed p-2">{error}</div></>}


            </form>

            <br />

            </>
        )
        }
            
            
            
        </div>
    </div>
    )
}