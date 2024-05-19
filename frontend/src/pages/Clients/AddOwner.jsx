import { useState, useEffect } from "react";
import api from "../../utils/api";
import { getClients } from "../../utils/api";

export default function AddOwner({ handleModalClose, setShowModal, newOwner }) {
    
    const [owner, setOwner] = useState({
        name : newOwner ? newOwner.name : '',
        email: '',
        phone: '',
        client_type: 'vendedor'
    });

    const [ clients, setClients ] = useState([]);

    useEffect(() => {   
        try  {
            getClients().then((data) => {
                setClients(data);
                console.log(data)
            }
            ).catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
        }
    },[]);

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setOwner({
            ...owner,
            [e.target.name]: e.target.value,
        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        // comprobar si hay por un correo o un telefono
        if (!owner.email && !owner.phone) {
            setError("Debe introducir un método de contacto");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        } else {
                // comprobar si el ownere ya existe con la info recuperada en el front
                const ownerExists = () => {
                    if(owner.email !== "") {
                        return clients.find(c => c.email === owner.email);
                    }
                    if(owner.phone !== "") {
                        return clients.find(c => c.phone === owner.phone);
                    }
                    return false;
                }
                if (ownerExists()) {
                    setError("Ya existe un ownere con ese correo o teléfono");
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
                    return;
                }
                console.log(owner)
                try {
                    const response = await api.post('/clients/', owner );

                    if (response.status === 201) {
                        handleModalClose();
                    } else {
                        setError('Ha ocurrido un error en el post');
                        setTimeout(() => {
                            setError(null);
                        }, 2000);
                    }
                } catch (error) {
                    setError('Ha ocurrido un error al añadir el ownere');
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
                }
                      
        }
    }

    return (
        <>
            <div className="formWrapper">
                <div className="addForm">
                    <h3 className="text-xl border-b-2 mb-4">Añadir nuevo propietario</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Nombre: {" "}
                                <input
                                    value={owner.name}
                                    onChange={handleChange}
                                    type="text"
                                    name="name"
                                    required
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Correo electrónico: {" "}
                                <input
                                    value={owner.email}
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Teléfono: {" "}
                                <input
                                    value={owner.phone}
                                    onChange={handleChange}
                                    type="tel"
                                    name="phone"
                                />
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Tipo de cliente: {" "}
                                <select name="owner_type" required value={owner.client_type} onChange={handleChange}>
                                    <option value="comprador">Comprador</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="ambos">Vendedor y comprador</option>
                                </select>
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                            >Cerrar</button>

                            <button 
                                type="submit"
                            >Guardar
                            </button>
                        </div>
                        

                        {error && <><br /> <div className="text-red-600 border border-red-600 border-dashed p-2">{error}</div></>}

                    </form>
                </div>
                
            </div>


            
        </>
    )
}