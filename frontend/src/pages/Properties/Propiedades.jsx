import { useState, useEffect } from "react"
import { getProperties } from "../../utils/api";
import AddProperty from "./AddProperty";

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

    return (
        <>
            { showModal && <AddProperty setShowModal={setShowModal} /> }
            
            <h1>Propiedades</h1>
            <button
                className="absolute right-5"
                onClick={() => setShowModal(true)}
            >Añadir propiedad
            </button> <br />
            
            { loading ? <h2>Loading...</h2> 
            : (
                <>
                    { !propiedades.length 
                        ? <span>No hay propiedades en este momento</span> 
                        : <table border={1}>
                            <tr>
                                <th>Propiedad</th>
                                <th>Descripción</th>
                                <th>Ubicación</th>
                                <th>Precio</th>
                            </tr>
                            { propiedades.map(propiedad => (
                                <tr key={propiedad.id} style={{border:'1px solid black'}}>
                                    <td> <b>{propiedad.name}</b> </td>
                                    <td> {propiedad.description} </td>
                                    <td> {propiedad.location} </td>
                                    <td> {propiedad.price} </td>
                                </tr>
                            ))}
                        </table> 
                    }
                </>
            )}

            
            <p>Y todo el resultado:</p>
            <pre>{JSON.stringify(propiedades, null, 2)}</pre>

        </>
    )
}