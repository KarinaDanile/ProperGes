import { useState, useEffect } from "react"
import { getProperties } from "../../utils/api";
import AddProperty from "./AddProperty";
import Spinner from "../../components/Spinner";

export function Propiedades() {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {   
        getProperties().then((data) => {
            setPropiedades(data);
        }).catch((error) => {
            console.error(error);
        }).finally(() =>{
            setLoading(false);
        });
        
    }, []);

    const handleNewProperty = () => {
        console.log('New property')
        AddProperty();
    }

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const formatToCurrency = (number, locale = 'es-ES', currency = 'EUR') => {
        return parseFloat(number).toLocaleString(locale, {
            style: 'currency',
            currency: currency
        });
    }

    const formatDateString = (string) => {
        const date = new Date(string);
        return date.toLocaleDateString();
    }

    const limitLines = (string, limit = 3) => {
        if (!string) return '';
        return string.split('\n').slice(0, limit).join('\n');
    }
    

    return (
        <>
            { showModal ? <AddProperty setShowModal={setShowModal} /> 
            : (
                <>
                    <div className="flex mx-12 justify-between">
                        <h1 className="mt-12">Propiedades</h1>
                        <button
                            className="mt-12"
                            onClick={() => setShowModal(true)}
                        >Añadir propiedad
                        </button> 
                    </div>
                { loading ? <Spinner />
                : (
                    <>
                        { !propiedades.length 
                            ? <span>No hay propiedades en este momento</span> 
                            : 
                            <div className="tableWrapper">
                                <table border={1}>
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
                                        <th>Descripción</th>
                                        
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { propiedades.map(propiedad => (
                                        <tr 
                                            key={propiedad.property_id}
                                            onClick={() => console.log('open property', propiedad)}
                                        >
                                            <td className="p-2"> <img className="w-16 max-w-full max-h-full" src="https://via.placeholder.com/70" alt="placeholder" /></td>
                                            <td> {capitalize(propiedad.property_type)} </td>
                                            <td> {formatToCurrency(propiedad.price)} </td>
                                            <td> {propiedad.city || propiedad.place_name || "Sin definir"} </td>
                                            <td> {propiedad.beds} </td>
                                            <td> {propiedad.baths} </td>
                                            <td> {propiedad.sqft + " m²"} </td>
                                            <td> {propiedad.is_available ? "Si" : "No"} </td>
                                            <td> {formatDateString(propiedad.list_date)} </td>
                                            <td> {limitLines(propiedad.description)} </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table> 
                            </div>
                        }
                    </>
                )}
                </>
            )}
        </>
    )
}