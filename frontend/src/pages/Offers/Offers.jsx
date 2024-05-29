import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { formatToCurrency, formatDateTimeString } from "../../utils/property_utils";


export default function Offers() {

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true)


    const handleAcceptOffer = (offer_id, client_id, property_id) => {
        
        // comprobar si el usuario está seguro
        
        const change = async () => {
            try {
                const res = await api.put(`/offers/${offer_id}/`, { offer_state: 'accepted' });
                console.log(res);
            } catch (error) {
                console.error(error);
            }
        }

        // change();

        

    
    }


    useEffect(() => {
        const getOffers = async () => {
            try {
                const res = await api.get('/offers/');
                setOffers(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        getOffers();
    }, [])


    return (
        <>

            {
                loading ? <Spinner />
                : (
                    <>
                        <div 
                            className="p-10" 
                            style={{ width: "1100px" }}
                        >
                            <h1>Ofertas</h1>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Fecha y hora</th>
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
                                            <td>{formatDateTimeString(offer.created)}</td>
                                            <td>
                                                <Link to={`/properties/${offer.property_id}`}>
                                                    {offer.property_address}
                                                </Link>
                                            </td>
                                            <td>{offer.client_iden}</td>
                                            <td>{formatToCurrency(offer.offered_price)}</td>
                                            <td>{offer.offer_state}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="btn-save"
                                                        onClick={handleAcceptOffer(offer.offer_id, offer.client_id, offer.property_id)}
                                                    >
                                                        Aceptar 
                                                    </button>
                                                    <button className="btn-cancel">
                                                        Rechazar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            }
        </>
    )
}