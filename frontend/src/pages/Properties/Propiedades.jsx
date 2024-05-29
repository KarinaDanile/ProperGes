import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import AddProperty from "./Components/AddProperty";
import Spinner from "../../components/Spinner";
import { capitalize, formatToCurrency, formatDateString, limitLines } from "../../utils/property_utils";
import { IoBed } from "react-icons/io5";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { LiaToiletSolid } from "react-icons/lia";
import FilterForm from "./Components/FilterForm";
import api from "../../utils/api";  

export function Propiedades() {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewState, setViewState] = useState('list');
    const [filters, setFilters] = useState({});

    const navigate = useNavigate();

    const handleRowClick = (id) => {
        navigate(`/properties/${id}/`);
    }
    
    const getProperties = (filters) => {
        console.log(filters);
        const params = new URLSearchParams(filters).toString();
        api.get(`/properties/?${params}`)
            .then((response) => {
                console.log(response.data)
                setPropiedades(response.data);
            }).catch((error) => {
                console.error(error);
            }).finally(() =>{
                setLoading(false);
            });
    }


    const handlefilterChange = (filters) => {
        console.log('setting filters', filters)
        setFilters(filters);
    }

    useEffect(() => {   
        getProperties({});
    }, []);
    
    useEffect(() => {   
        getProperties(filters);
    }, [filters]);
    

    return (
        <>
            { showModal ? <AddProperty updateProperties={getProperties} setShowModal={setShowModal} /> 
            : (
                <>
                    <div className="flex h-24 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-between">
                        <h1 className="p-5">Propiedades</h1>
                        <button
                            className="btn-add"
                            onClick={() => setShowModal(true)}
                        >Añadir propiedad
                        </button> 
                    </div>
                    <div className="bg-gray-200 p-10 px-24 xl:px-60 flex flex-col-reverse">
                                <div >
                                    <FilterForm onFilter={handlefilterChange} />
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        className="btn-edit border border-gray-400 p-2 rounded"
                                        onClick={() => setViewState('grid')}
                                    >
                                        Grid
                                    </button>
                                    <button 
                                        className="btn-edit border border-gray-400 p-2 rounded"
                                        onClick={() => setViewState('list')}    
                                    >
                                        List
                                    </button>
                                </div>
                            </div>
                { loading ? <Spinner />
                : (
                    <>
                        { !propiedades.length 
                            ? <h1 className="text-center mt-24">No hay propiedades en este momento</h1> 
                            : 
                            <>

                            { viewState === 'grid' &&
                                
                                <div className="flex justify-center flex-wrap gap-6 p-10 px-20 2xl:px-68">
                                    { propiedades.map(propiedad => (
                                        <div 
                                            key={propiedad.property_id}
                                            onClick={() => handleRowClick(propiedad.property_id)}
                                            className="flex flex-col w-80 gap-2 p-4 border border-gray-200  rounded-lg cursor-pointer"
                                        >
                                            <div className="w-full h-40 bg-blue-50 flex items-center justify-center"
                                                style={ {backgroundImage: propiedad.images.length > 0 && `url(${propiedad.images[0].image})`, backgroundSize: 'cover', backgroundPosition: 'center' } }
                                            >
                                            </div>
                                            <div className="text-xl ">
                                                {formatToCurrency(propiedad.price)}
                                            </div>
                                            <div className="font-light text-base ">
                                                {propiedad.place_name}
                                            </div>
                                            <div className="flex flex-row gap-10">
                                                <div className="flex gap-1 items-center">
                                                    <IoBed />{propiedad.beds} 
                                                </div>
                                                <div className="flex gap-1 items-center">
                                                    <LiaToiletSolid />{propiedad.baths}
                                                </div>
                                                <div className="flex gap-1 items-center">
                                                    < TfiRulerAlt2 />{propiedad.sqft + 'm²'} 
                                                </div>
                                            </div>
                                            <div className="description truncate">
                                                {propiedad.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            
                            }

                            { viewState === 'list' &&
                                <div className="tableWrapper mt-4 mb-20">
                                <table border={1} >
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>Tipo</th>
                                        <th>Precio</th>
                                        <th>Dirección</th>
                                        <th>Dormitorios</th>
                                        <th>Baños</th>
                                        <th>Superficie</th>
                                        <th>Disponible</th>
                                        <th>Fecha Alta</th>
                                        <th>Actualización</th>
                                        <th>Descripción</th>
                                        
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { propiedades.map(propiedad => (
                                        <tr 
                                            key={propiedad.property_id}
                                            onClick={() => handleRowClick(propiedad.property_id)}
                                        >
                                            <td className="p-2 "> 
                                            { propiedad.images.length > 0 ? 
                                                <img
                                                    className="w-20 h-auto min-w-full min-h-full" 
                                                    src={propiedad.images[0].image} 
                                                    alt="property" />
                                            :
                                                <img 
                                                    className="w-20 h-auto min-w-full min-h-full" 
                                                    src="https://via.placeholder.com/70" 
                                                    alt="placeholder" /> 
                                            }     
                                                </td>
                                            <td> {capitalize(propiedad.property_type)} </td>
                                            <td> {formatToCurrency(propiedad.price)} </td>
                                            <td className="truncated-text"> {propiedad.city || propiedad.place_name || "Sin definir"} </td>
                                            <td> {propiedad.beds} </td>
                                            <td> {propiedad.baths} </td>
                                            <td> {propiedad.sqft + " m²"} </td>
                                            <td> {propiedad.is_available ? "Si" : "No"} </td>
                                            <td> {formatDateString(propiedad.list_date)} </td>
                                            <td> {formatDateString(propiedad.update)} </td>
                                            <td className="truncated-text"> {limitLines(propiedad.description)} </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table> 
                            </div>
                            }

                            
                            </>
                        }
                    </>
                )}
                </>
            )}
        </>
    )
}