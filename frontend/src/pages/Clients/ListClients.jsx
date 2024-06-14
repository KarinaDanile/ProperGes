import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { getClients, deleteClient, updateClientState } from "../../utils/api";
import AddEditClient from "./AddClient";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineNotifications } from "react-icons/md";
import { MdOutlineNotificationsOff } from "react-icons/md";
import ClientFilter from "./Components/ClientFilter";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { formatDateString, capitalize } from "../../utils/property_utils";
import api from "../../utils/api"; 


export default function ListClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [stateConfirmOpen, setStateConfirmOpen] = useState(false);
    const [clientUpdateState, setClientUpdateState] = useState(null)

    const [filters, setFilters] = useState({});
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [clientCount, setClientCount] = useState(0);
    const pageSize = 10;
    const [orderLoading, setOrderLoading] = useState(false);

    const navigate = useNavigate();

    const getActiveClients = () => {
        try  {
            const params = new URLSearchParams({
                ...filters,
                page: currentPage, page_size: pageSize, 
                ordering: sortOrder === 'asc' ? sortField : `-${sortField}`,
            }).toString();

            api.get(`/clients/?${params}`)
            .then((response) => {
                console.log(response.data)
                setClientCount(response.data.count);
                setClients(response.data.results);
                setTotalPages(Math.ceil(response.data.count / pageSize));
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
                
            }).catch((error) => {
                console.error(error);
            }).finally(() =>{
                setLoading(false);
                setOrderLoading(false);
            });
            
        } catch (error) {
            console.error(error);
        } 
    };

    const handlePageChange = (pageUrl) => {
        if (!pageUrl) return;

        setLoading(true);
        api.get(pageUrl)
            .then((response) => {
                const data = response.data;
                setClients(data.results);
                setTotalPages(Math.ceil(data.count / pageSize));
                setNextPage(data.next);
                setPrevPage(data.previous);
                setCurrentPage(pageUrl.includes('page=') ? parseInt(new URL(pageUrl).searchParams.get('page')) : 1);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    
    const handleRowClick = (id) => {
        navigate(`/clients/${id}/`);
    };

    useEffect(() => {
        getActiveClients();
    }, []);
    useEffect(() => {
        getActiveClients();
    }, [filters]);

    const handleModalClose = () => {
        setShowModal(false);
        getActiveClients();
    }


    const handleEditClient = (client, e) => {
        e.stopPropagation();
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
        setLoading(true);
        updateClientState(client.client_id, { is_active: !client.is_active }).then(() => {
            getActiveClients();
        }).catch((error) => {
            console.error(error);
        });
    }

    const handleFilterChange = (filters) => {
        console.log('client filters: ', filters);
        setFilters(filters);
        setCurrentPage(1);
    };
    
    const renderSortIcon = (field) => {
        if (sortField !== field) return <div className="text-gray-400"><FaSort /></div>;
        if (sortOrder === 'asc') return <div className="text-gray-400"><FaSortDown /></div>;
        return <div className="text-gray-400"><FaSortUp /></div>;
    };
    
    const handleSortChange = (field) => {
        const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newSortOrder);
        setFilters(prevFilters => ({...prevFilters }));
        setOrderLoading(true);
    };

    const handleToggleNotification = (client, e) => {
        e.stopPropagation();
        setClientUpdateState(client);
        setStateConfirmOpen(true);
    };

    const handleDeleteClientToggle = (client, e) => {
        e.stopPropagation();
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    };


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

                   

                { loading ? <Spinner />
                : (
                    <>

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
                        <div>
                            <ClientFilter onFilter={handleFilterChange}/>
                        </div>

                        { !clients.length
                            ? <h1 className="text-center mt-16">No hay clientes en este momento</h1>
                            : 
                            <div className="my-4 mb-10">
                                
                                <div className={`tableWrapper ${orderLoading ? 'opacity-80 pointer-events-none' : ''}`}>
                                    
                                    <table border={1} className="my-table2">
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSortChange('name')}>
                                                    <div>Cliente {renderSortIcon('name')}</div></th>
                                                <th onClick={() => handleSortChange('email')}>
                                                    <div>Correo electrónico {renderSortIcon('email')}</div></th>
                                                <th onClick={() => handleSortChange('phone')}>
                                                    <div>Teléfono {renderSortIcon('phone')}</div></th>
                                                <th onClick={() => handleSortChange('client_type')}>
                                                    <div>Tipo Cliente {renderSortIcon('client_type')}</div></th>
                                                <th onClick={() => handleSortChange('created')}>
                                                    <div>Alta {renderSortIcon('created')}</div></th>
                                                <th onClick={() => handleSortChange('is_active')}>
                                                    <div>Activo {renderSortIcon('is_active')}</div></th>
                                                <th>Acciones</th>
                                            
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { clients.map(client => (
                                                <tr 
                                                    key={client.client_id}
                                                    onClick={() => handleRowClick(client.client_id)}
                                                >
                                                    <td> <b>{client.name}</b> </td>
                                                    <td> {client.email} </td>
                                                    <td> {client.phone} </td>
                                                    <td> {client.client_type === "ambos" ? "Comprador y vendedor" : capitalize(client.client_type)} </td>
                                                    <td> {formatDateString(client.created)}</td>
                                                    <td> {client.is_active ? 'Si' : 'No'} </td>
                                                    <td> 
                                                    <div className="flex items-center justify-center">
                                                        <button onClick={(e) => handleEditClient(client, e)} 
                                                            className="text-xl border border-transparent hover:border-gray-400  p-2 rounded-md hover:shadow-md"
                                                        >
                                                            <FaRegEdit/>
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleToggleNotification(client, e)}
                                                            className="text-xl border border-transparent hover:border-gray-400  p-2 rounded-md hover:shadow-md">
                                                            { client.is_active ?  <MdOutlineNotificationsOff/> : <MdOutlineNotifications/>}
                                                        </button>
                                                        <button onClick={(e) => handleDeleteClientToggle(client, e)} 
                                                            className="text-red-500 hover:text-red-700 text-xl border border-transparent hover:border-gray-400  p-2 rounded-md hover:shadow-md"
                                                        >
                                                            <RiDeleteBinLine />
                                                        </button> 
                                                    </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    { clientCount > 10 &&
                                        <div className="pagination mt-6 flex justify-center items-center mb-20">
                                            <button
                                                onClick={() => handlePageChange(prevPage)}
                                                disabled={!prevPage}
                                                className="btn-edit border border-gray-400 p-2 rounded hover:bg-white"
                                            >
                                                Anterior
                                            </button>
                                            <span className="mx-2">{currentPage} de {totalPages}</span>
                                            <button
                                                onClick={() => handlePageChange(nextPage)}
                                                disabled={!nextPage}
                                                className="btn-edit ml-2 border border-gray-400 p-2 rounded hover:bg-white"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    }
                            
                                </div>
                            </div>
                        }
                    </>
                )}
                    </>
                )}
        </>
    )
}