import { useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import Select from "react-select";

export default function AddEditClient({ handleModalClose, setShowModal, clients, clientToEdit }) {
    
    const [client, setClient] = useState({
        name: clientToEdit ? clientToEdit.name :'',
        email: clientToEdit ? clientToEdit.email :'',
        phone: clientToEdit ? clientToEdit.phone :'',
        client_type: clientToEdit ? clientToEdit.client_type : 'comprador'
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setClient({
            ...client,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // comprobar si hay por un correo o un telefono
        if (!client.email && !client.phone) {
            setError("Debe introducir un método de contacto");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        } else {
            if(clientToEdit) {
                // comprobar si se han hecho cambios
                if (client.name === clientToEdit.name && client.email === clientToEdit.email && client.phone === clientToEdit.phone && client.client_type === clientToEdit.client_type) {
                    handleModalClose();
                    return;
                }

                try {
                    const response = await api.put(`/clients/${clientToEdit.client_id}/`, client );

                    if (response.status === 200) {
                        handleModalClose();
                    } else {
                        setError('Ha ocurrido un error en el put');
                        setTimeout(() => {
                            setError(null);
                        }, 2000);
                    }
                } catch (error) {
                    setError('Ha ocurrido un error al editar el cliente');
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
                }

            } else {
                // comprobar si el cliente ya existe con la info recuperada en el front
                const clientExists = () => {
                    if(client.email !== "") {
                        return clients.find(c => c.email === client.email);
                    }
                    if(client.phone !== "") {
                        return clients.find(c => c.phone === client.phone);
                    }
                    return false;
                }
                if (clientExists()) {
                    setError("Ya existe un cliente con ese correo o teléfono");
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
                    return;
                }
                console.log(client)
                try {
                    const response = await api.post('/clients/', client );

                    if (response.status === 201) {
                        handleModalClose();
                    } else {
                        setError('Ha ocurrido un error en el post');
                        setTimeout(() => {
                            setError(null);
                        }, 2000);
                    }
                } catch (error) {
                    setError('Ha ocurrido un error al añadir el cliente');
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
                }
            }            
        }
    }

    return (
        <>
            <div className="formWrapper">
                <div className="addForm">
                    <h3 className="text-xl border-b-2 mb-4">Añadir nuevo cliente</h3>
                    
                    <form onSubmit={handleSubmit} >
                        <div className="form-group">
                            <label>
                                Nombre: {" "}
                                <input
                                    value={client.name}
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
                                    value={client.email}
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
                                    value={client.phone}
                                    onChange={handleChange}
                                    type="tel"
                                    name="phone"
                                />
                            </label>
                        </div>
                        
                        <div className="form-group">
                            <label>
                                Tipo de cliente: {" "}
                                <select name="client_type" required value={client.client_type} onChange={handleChange}>
                                    <option value="comprador">Comprador</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="ambos">Vendedor y comprador</option>
                                </select>
                            </label>
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowModal(false)}
                            >Cerrar</button>

                            <button 
                                className="btn-save"
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