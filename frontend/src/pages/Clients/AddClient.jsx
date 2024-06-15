import { useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import Select from "react-select";
import { useToast } from "rc-toastr";

export default function AddEditClient({ handleModalClose, setShowModal, clients, clientToEdit }) {
    const { toast } = useToast();
    const [client, setClient] = useState({
        name: clientToEdit ? clientToEdit.name :'',
        email: clientToEdit ? clientToEdit.email :'',
        phone: clientToEdit ? clientToEdit.phone :'',
        client_type: clientToEdit ? clientToEdit.client_type : 'comprador'
    });

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
            toast.error("Debe introducir un método de contacto");
            
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
                        setClient({
                            name: '',
                            email: '',
                            phone: '',
                            client_type: 'comprador'
                        })
                    } else {
                        toast.error('Error al editar el cliente');
                        
                    }
                } catch (error) {
                    toast.error('Error al editar el cliente');
                    
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
                    toast.error("Ya existe un cliente con ese correo o teléfono");
                    return;
                }
               
                try {
                    const response = await api.post('/clients/', client );

                    if (response.status === 201) {
                        handleModalClose();
                        setClient({
                            name: '',
                            email: '',
                            phone: '',
                            client_type: 'comprador'
                        })
                    } else {
                        toast.error('Ha ocurrido un error al añadir el cliente');

                    }
                } catch (error) {
                    toast.error('Ha ocurrido un error al añadir el cliente');

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
                        
                    </form>
                </div>
            </div>
        </>
    )
}