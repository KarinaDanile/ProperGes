import { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { formatDateTimeString, capitalize } from "../../utils/property_utils";

export default function Visits() {

    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true)

    const handleConfirmVisit = (visit_id) => async () => {
        const confirmed = window.confirm('¿Estás seguro de que deseas marcar esta visita como realizada?');
        if (!confirmed) return;
        try {
            const res = await api.patch(`/visits/${visit_id}/`, { visit_state: 'realizada' });
            const updatedVistiIndex = visits.findIndex(visit => visit.visit_id === visit_id);
            const updatedVisits = [...visits];
            updatedVisits[updatedVistiIndex] = res.data;
            setVisits(updatedVisits);
        } catch (error) {
            console.error(error);
        }
    }

    const handleCancelVisit = (visit_id) => async () => {
        try {
            const res = await api.patch(`/visits/${visit_id}/`, { visit_state: 'cancelada' });
            const updatedVistiIndex = visits.findIndex(visit => visit.visit_id === visit_id);
            const updatedVisits = [...visits];
            updatedVisits[updatedVistiIndex] = res.data;
            setVisits(updatedVisits)
        } catch (error) {
            console.error(error);
        }
    }


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
                                                <div className="flex gap-1">
                                                    <button
                                                        className="btn-save"
                                                        onClick={handleConfirmVisit(visit.visit_id)}
                                                    >
                                                        Confirmar
                                                    </button>
                                                    <button
                                                        className="btn-cancel"
                                                        onClick={handleCancelVisit(visit.visit_id)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="truncate">{visit.comments}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            }
        </div>
    )
}
