import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { formatToCurrency, formatDateString, capitalize } from "../../utils/property_utils";
import AddOffer from "./AddOffer";
import ConfirmModal2 from "../../utils/ConfirmModal2";
import { FaRegEdit } from "react-icons/fa";

export default function Offers() {

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [offerToEdit, setOfferToEdit] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [selectedOfferId, setSelectedOfferId] = useState(null);

    const openConfirmModal = (offer_id, actionType) => {
        setSelectedOfferId(offer_id);
        setActionType(actionType);
        setConfirmModalOpen(true);
    }

    const handleConfirmOffer = async (confirmed) => {
        if (confirmed && selectedOfferId) {
            try {
                const res = await api.patch(`/offers/${selectedOfferId}/`, { offer_state: actionType });
                const updatedOfferIndex = offers.findIndex(offer => offer.offer_id === selectedOfferId);
                const updatedOffers = [...offers];
                updatedOffers[updatedOfferIndex] = res.data;
                setOffers(updatedOffers);
            } catch (error) {
                console.error(error);
            }
        }
        setConfirmModalOpen(false);
        setSelectedOfferId(null);
        setActionType(null);
    };


    const getOffers = async () => {
        try {
            const res = await api.get('/offers/');
            setOffers(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getOffers();
    }, [])


    return (
        <>
            { showModal ? 
                <AddOffer 
                    onClose={() => setShowModal(false)}
                    onOfferCreated={() => {
                        getOffers();
                    }}
                    offerToEdit={offerToEdit}
                /> 
            : (
                <>
                {
                    loading ? <Spinner />
                    : (
                        <>
                            <div className="flex h-24 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-between">
                                <h1 className="p-5">Ofertas</h1>
                                <button
                                    className="btn-add"
                                    onClick={() => setShowModal(true)}
                                >Crear oferta
                                </button> 
                            </div>
                                
                                <div className="tableWrapper">
                                    <table className="my-table2">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Propiedad</th>
                                                <th>Cliente</th>
                                                <th>Oferta</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {offers.map((offer, index) => (
                                                <tr key={index}>
                                                    <td>{formatDateString(offer.created)}</td>
                                                    <td>
                                                        <Link to={`/properties/${offer.property}`}>
                                                            {offer.property_address}
                                                        </Link>
                                                    </td>
                                                    <td>{offer.client_iden}</td>
                                                    <td>{formatToCurrency(offer.offered_price)}</td>
                                                    <td>{capitalize(offer.offer_state)}</td>
                                                    <td>
                                                        
                                                           <div className="flex gap-2 justify-center">

                                                            {offer.offer_state === 'pendiente' && (
                                                                <>
                                                                    <button 
                                                                        className="btn-save  hover:bg-slate-50"
                                                                        onClick={() => {
                                                                            openConfirmModal(offer.offer_id, 'aceptada');
                                                                        }}
                                                                    >
                                                                        Aceptar 
                                                                    </button>
                                                                    <button 
                                                                        className="btn-cancel hover:bg-slate-50"
                                                                        onClick={() => {
                                                                            openConfirmModal(offer.offer_id, 'rechazada');
                                                                        }}
                                                                    >
                                                                        Rechazar
                                                                    </button>
                                                                    <button 
                                                                        className="p-2 border border-gray-300 rounded  hover:shadow-md transition duration-300 ease-in-out hover:bg-slate-50"
                                                                        onClick={() => {
                                                                            openConfirmModal(offer.offer_id, 'cancelada');
                                                                        }}
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                    </>
                                                                )}
                                                                <button
                                                                    className="text-blue-900 text-xl border border-transparent hover:border-gray-400  p-2 rounded-md hover:shadow-md"
                                                                    onClick={() => {
                                                                        setOfferToEdit(offer);
                                                                        setShowModal(true);
                                                                    }}
                                                                    ><FaRegEdit />
                                                                    <tool-tip role="tooltip">
                                                                        Editar visita
                                                                    </tool-tip>
                                                                </button>
                                                            </div> 
                                                            
                                                       
                                                         
                                                        
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            <ConfirmModal2
                                accion={`Oferta ${actionType}`}
                                mensaje={`¿Estás seguro de que deseas marcar la oferta como ${actionType}?`}
                                isOpen={confirmModalOpen}
                                onClose={() => setConfirmModalOpen(false)}
                                onConfirm={handleConfirmOffer}
                            />
                        </>
                    )
                }
                </>
            )}
        </>
    )
}