import { useState, useEffect } from "react"
import { getClients, deleteClient, updateClientState } from "../../utils/api";
import AddEditClient from "./AddClient";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";

export default function ListClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [stateConfirmOpen, setStateConfirmOpen] = useState(false);
    const [clientUpdateState, setClientUpdateState] = useState(null)

    const getActiveClients = () => {
        try  {
            getClients().then((data) => {
                setClients(data);
            }
            ).catch((error) => {
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
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

    const handleClientState = (client) => {
        updateClientState(client.client_id, { is_active: !client.is_active }).then(() => {
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
                    <ConfirmModal 
                        isOpen={stateConfirmOpen} 
                        onClose={() => setStateConfirmOpen(false)}
                        onConfirm={handleClientState}
                        client={clientUpdateState}  
                        accion="Cambiar estado de cliente"
                        mensaje="¿Estás seguro?"  
                    />

                    <div className="flex h-24 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-between">
                        <h1 className="p-5">Clientes</h1>
                        <button
                            className="btn-add"
                            onClick={() => {
                                setShowModal(true)
                                setClientToEdit(null)
                            }}
                        >  Añadir cliente</button>
                    </div>

                { loading ? <Spinner />
                : (
                    <>
                        { !clients.length
                            ? <h1 className="text-center mt-16">No hay clientes en este momento</h1>
                            : 
                            (<div className="tableWrapper">
                                
                                <table border={1} className="my-table">
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
                                                <td> 
                                                <div className="flex">
                                                    <button onClick={() => handleEditClient(client)} 
                                                        className="btn-edit">Editar</button>
                                                    <button
                                                        onClick={() => {
                                                            setClientUpdateState(client);
                                                            setStateConfirmOpen(true);
                                                        }}
                                                        className="btn-edit">
                                                        { client.is_active ? 'Baja' : 'Alta'}
                                                    </button>
                                                    <button onClick={() => {
                                                        setClientToDelete(client);
                                                        setIsDeleteModalOpen(true);
                                                }} className="btn-delete">Eliminar</button> 
                                                </div>
                                                </td>
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