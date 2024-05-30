import { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { formatDateTimeString, capitalize } from "../../utils/property_utils";
import ConfirmModal2 from "../../utils/ConfirmModal2";
import { isPastVisit } from "../../utils/visits_utils";
import { FaRegEdit } from "react-icons/fa";

export default function Visits() {

    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const [actionType, setActionType] = useState(null);

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


    useEffect(() => {
        const getVisits = async () => {
            try {
                const res = await api.get('/visits/');
                setVisits(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        getVisits();
    }, [])


    return (
        <div className="p-10">
            <h1>Visits</h1>
            {
                loading ? <Spinner /> 
                : (
                    <>

                        <div style={{}}
                            
                        >
                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha y hora</th>
                                        <th>Propiedad</th>
                                        <th>Dirección</th>
                                        <th>Cliente</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                        <th>Comentarios</th>
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
                                            <td>{capitalize(visit.visit_state)}</td>
                                            <td>
                                                <div className="flex gap-1 justify-center">
                                                    <button
                                                        className="text-blue-900 text-lg hover:border border-blue-900 p-1 rounded-md hover:shadow-md"

                                                    >
                                                        <FaRegEdit />
                                                    </button>

                                                    {visit.visit_state !== 'realizada' && visit.visit_state !== 'cancelada' && (
                                                        <>
                                                            <button
                                                                className="btn-save"
                                                                disabled={!isPastVisit(visit.start)}
                                                                onClick={() => {
                                                                    openConfirmModal(visit.visit_id, 'realizada');
                                                                }}
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                className="btn-cancel"
                                                                onClick={() => {
                                                                    openConfirmModal(visit.visit_id, 'cancelada');
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                </div>
                                            </td>
                                            <td className="truncate">{visit.comments}</td>
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

        </div>
    )
}
