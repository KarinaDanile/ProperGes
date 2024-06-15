import { useState, useEffect } from "react";
import api from "../../utils/api";
import { getClients } from "../../utils/api";
import { useToast } from "rc-toastr";

export default function AddOwner({ handleModalClose, setShowModal, newOwner }) {
    const { toast } = useToast();
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
                
            }
            ).catch((error) => {
                toast.error("Error al cargar los propietarios");
            })
        } catch (error) {
            toast.error("Error al cargar los datos");
        }
    },[]);

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
            toast.error("Debe introducir un método de contacto");
            return;
        } else {
                // comprobar si el owner ya existe con la info recuperada en el front
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
                    toast.error("Ya existe un propietario con ese correo o teléfono");
                    return;
                }
                
                try {
                    const response = await api.post('/clients/', owner );

                    if (response.status === 201) {
                        handleModalClose();
                    } else {
                        toast.error('Ha ocurrido un error al añadir al propietario');
                    }
                } catch (error) {
                    toast.error('Ha ocurrido un error al añadir al propietario');
                };    
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
                                className="btn-cancel"
                                onClick={() => setShowModal(false)}
                            >Cerrar</button>

                            <button 
                                type="submit"
                                className="btn-save"
                            >Guardar
                            </button>
                        </div>
                        
                    </form>
                </div>
                
            </div>


            
        </>
    )
}