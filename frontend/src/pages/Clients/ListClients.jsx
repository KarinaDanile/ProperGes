import { useState, useEffect } from "react"
import { getClients, deleteClient } from "../../utils/api";
import AddEditClient from "./AddClient";
import ConfirmModal from "../../components/ConfirmModal";

export default function ListClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    const getActiveClients = () => {
        try  {
            getClients().then((data) => {
                setClients(data);
                console.log(data)
            }
            ).catch((error) => {
                console.error(error);
            }).finally(() =>{
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getActiveClients();
    }, []);

    const handleModalClose = () => {
        setShowModal(false);
        getActiveClients();
    }


    const handleEditClient = (client) => {
        setClientToEdit(client);
        setShowModal(true);
    }

    const handleDeleteClient = (client) => {
        deleteClient(client.client_id).then(() => {
            getActiveClients();
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <>

            { showModal ? 
            <AddEditClient 
                clients={clients} 
                clientToEdit={clientToEdit} 
                handleModalClose={handleModalClose} 
                setShowModal={setShowModal} 
            /> 
        
            : (
                <>
                <ConfirmModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteClient}
                client={clientToDelete}  
                accion="Eliminar registro"
                mensaje="¿Estás seguro que deseas eliminar este cliente? Esta acción no se puede deshacer."  
            />

            <div className="flex gap-10 items-center justify-between">
                <h1 className="p-5">Clientes</h1>
                <button
                    onClick={() => {
                        setShowModal(true)
                        setClientToEdit(null)
                    }}
                >  Añadir cliente</button>
            </div>

            { loading ? <h2>Loading...</h2>
            : (
                <>
                    { !clients.length
                        ? <span>No hay clientes en este momento</span>
                        : 
                        (<div className="tableWrapper">
                            
                            <table border={1}>
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Correo electrónico</th>
                                        <th>Teléfono</th>
                                        <th>Tipo Cliente</th>
                                        <th>Activo</th>
                                        <th></th>
                                       
                                    </tr>
                                </thead>
                                <tbody>
                                    { clients.map(client => (
                                        <tr key={client.client_id}>
                                            <td> <b>{client.name}</b> </td>
                                            <td> {client.email} </td>
                                            <td> {client.phone} </td>
                                            <td> {client.client_type} </td>
                                            <td> {client.is_active ? 'Si' : 'No'} </td>
                                            <td className="flex"> <button onClick={() => handleEditClient(client)} className="text-sm">Editar</button>
                                                <button onClick={() => {
                                                    setClientToDelete(client);
                                                    setIsDeleteModalOpen(true);
                                            }} className="bg-red-600 ml-4 text-sm hover:bg-red-800">Eliminar</button> </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>)
                    }
                </>
            )}
                </>
            )}
            
            
            
        </>
    )
}