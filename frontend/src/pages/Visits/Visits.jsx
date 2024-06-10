import { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { formatDateTimeString, capitalize } from "../../utils/property_utils";
import ConfirmModal2 from "../../utils/ConfirmModal2";
import { isPastVisit } from "../../utils/visits_utils";
import { MdOutlineCancel } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import AddEditVisit from "./AddEditVisit";

export default function Visits() {

    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [visitToEdit, setVisitToEdit] = useState(null);

    const openConfirmModal = (visit_id, actionType) => {
        setSelectedVisitId(visit_id);
        setActionType(actionType);
        setConfirmModalOpen(true);
    }

    const handleConfirmVisit = async (confirmed) => {
        if (confirmed && selectedVisitId) {
            try {
                const res = await api.patch(`/visits/${selectedVisitId}/`, { visit_state: actionType });
                const updatedVistiIndex = visits.findIndex(visit => visit.visit_id === selectedVisitId);
                const updatedVisits = [...visits];
                updatedVisits[updatedVistiIndex] = res.data;
                setVisits(updatedVisits);
            } catch (error) {
                console.error(error);
            }
        }
        setConfirmModalOpen(false);
        setSelectedVisitId(null);
        setActionType(null);
    };

    const getVisits = async () => {
        try {
            const res = await api.get('/visits/');
            setVisits(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getVisits();
    }, [])

 

    return (
        <>
            {showCreateModal ? (
                <AddEditVisit
                    onClose={() => setShowCreateModal(false)}
                    onVisitCreated={() => {
                        getVisits();
                    }}
                    visitToEdit={visitToEdit}
                />
            )
            : (
                <>
                
                {
                    loading ? <Spinner /> 
                    : (
                        <>

                            <div className="flex h-24 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h1 className="p-5">Visitas</h1>
                                    <button className="btn-edit border border-gray-300 rounded p-2 h-10 bg-white hover:shadow">
                                        <Link to="/calendar" className="">Volver</Link>
                                    </button>
                                </div>
                                <button
                                    className="btn-add"
                                    onClick={() => {
                                        setShowCreateModal(true)
                                        
                                    }}
                                >  Añadir visita</button>
                            </div>
                            <div className="tableWrapper"
                                
                            >
                                <table className="my-table">
                                    <thead>
                                        <tr>
                                            <th>Fecha y hora</th>
                                            <th>Propiedad</th>
                                            <th>Dirección</th>
                                            <th>Cliente</th>
                                            <th>Agente</th>
                                            <th>Estado</th>
                                            <th>Comentarios</th>
                                            <th>Acciones</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visits.map((visit, index) => (
                                            <tr key={index}>
                                                <td>{formatDateTimeString(visit.start)}</td>
                                                <td>{visit.property_reference}</td>
                                                <td>
                                                    <Link to={`/properties/${visit.property_id}`}>
                                                        {visit.property_address}
                                                    </Link>
                                                </td>
                                                <td >{visit.client_iden}</td>
                                                <td>{capitalize(visit.agent_name)}</td>
                                                <td>{capitalize(visit.visit_state)}</td>
                                                <td>{visit.comments}</td>
                                                <td>
                                                    <div className="flex gap-1 justify-center items-center">
                                                       
                                                        {visit.visit_state !== 'realizada' && visit.visit_state !== 'cancelada' && (
                                                            <>
                                                                <button
                                                                    className="p-2 text-xl text-green-700 border border-transparent hover:border-gray-400 rounded-md hover:shadow-md"
                                                                    hidden={!isPastVisit(visit.start)}
                                                                    onClick={() => {
                                                                        openConfirmModal(visit.visit_id, 'realizada');
                                                                    }}
                                                                ><GrStatusGood />
                                                                </button>
                                                                <button
                                                                    className="p-2 text-xl text-red-800 border border-transparent hover:border-gray-400 rounded-md hover:shadow-md"
                                                                    onClick={() => {
                                                                        openConfirmModal(visit.visit_id, 'cancelada');
                                                                    }}
                                                                ><MdOutlineCancel />
                                                                </button>
                                                            </>
                                                        )}
                                                         <button
                                                            className="text-blue-900 text-lg border border-transparent hover:border-gray-400 border-blue-900 p-2 rounded-md hover:shadow-md"
                                                            onClick={() => {
                                                                setVisitToEdit(visit);
                                                                setShowCreateModal(true);
                                                            }}
                                                        ><FaRegEdit />
                                                        </button>
                                                    </div>
                                                </td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    <ConfirmModal2
                        accion={`${actionType === 'realizada' ? 'Confirmar' : 'Cancelar'} visita`}
                        mensaje={`¿Estás seguro de que deseas marcar la visita como ${actionType === 'realizada' ? 'realizada' : 'cancelada'}?`}
                        isOpen={confirmModalOpen}
                        onClose={() => setConfirmModalOpen(false)}
                        onConfirm={handleConfirmVisit}
                    />
                </>
            )}
        </>
    )
}
