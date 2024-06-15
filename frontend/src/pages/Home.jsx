import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useToast } from "rc-toastr";
import { capitalize, formatDateTimeString } from "../utils/property_utils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Spinner from "../components/Spinner";

const Home = () => {
    const {user} = useContext(AuthContext);
    const {toast} = useToast(); 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [agentVisitsPending, setAgentVisitsPending] = useState([]);
    const [hasVisits, setHasVisits] = useState(false);

    const [pendingOffers, setPendingOffers] = useState(0);
    const [activeClients, setActiveClients] = useState(0);
    const [visitsPending, setVisitsPending] = useState(0);
    const [propertyCount, setPropertyCount] = useState({
        total: 0,
        available: 0,
        reserved: 0,
        sold: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            const username = `${user}`;
            try {
                const visitsResponse = await api.get('/visits/pending/'); 
                const agentVisitsResponse = await api.get(`/visits/user/`, username);
                const offersResponse = await api.get('/offers/pending/');
                const clientsResponse = await api.get('/clients/active/');
                const propertiesResponse = await api.get('/properties/count/');

                setVisitsPending(visitsResponse.data.pending_visits);
                setAgentVisitsPending(agentVisitsResponse.data);
                setPendingOffers(offersResponse.data.pending_offers);
                setActiveClients(clientsResponse.data.active_clients);
                setPropertyCount(propertiesResponse.data.property_count);
                setHasVisits(agentVisitsResponse.data.length > 0);
                
            } catch (error) {
                console.error("Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    
   
    return (
        <>
            <div className="flex max-h-full px-16 xl:px-40 p-10 bg-gray-100">
                <h1>Bienvenido/a{user && <span>, {capitalize(user)}</span>}</h1>
                
               
            </div>

            {loading ? <Spinner /> : (
                <>

                <div className="px-16 mt-10 xl:px-40 gap-24 flex flex-row justify-center flex-wrap">
                    <div className="w-fit">
                        <div className="bg-white text-gray-700 w-40 p-7 rounded-lg shadow-lg">
                            <h1>{pendingOffers} </h1>
                            Ofertas pendientes
                        </div>
                    </div>
                    <div className=" w-fit">
                        <div className="bg-white text-gray-700 w-40 p-7 rounded-lg shadow-lg">
                            <h1>{activeClients} </h1>
                            Clientes activos
                        </div>
                    </div>
                    <div className="w-fit ">
                        <div className="bg-white text-gray-700 w-40 p-7 rounded-lg shadow-lg">
                            <h1>{propertyCount.available} </h1>
                            Propiedades disponibles
                        </div>
                    </div>
                    <div className="w-fit ">
                        <div className="bg-white text-gray-700 w-40 p-7 rounded-lg shadow-lg">
                            <h1>{visitsPending} </h1>
                            Visitas pendientes
                        </div>
                    </div>
                    {propertyCount.reserved > 0 && (
                        <div className="w-fit">
                            <div className="bg-white text-gray-700 w-40 p-7 rounded-lg shadow-lg">
                                <h1>{propertyCount.reserved} </h1>
                                Propiedades reservadas
                            </div>
                        </div>
                    )}
                    
                    
                </div>
                    {hasVisits && (
                        <div className="flex mt-4 flex-col gap-6 py-10">
                            <div className="px-16 xl:px-40 gap-24 flex flex-row flex-wrap">
                                <div className="bg-white text-gray-700 p-7 rounded-lg shadow-lg">
                                    <h1 className="mb-2">Tus próximas visitas </h1>
                                    {agentVisitsPending.map((visit, index) => (
                                     
                                        <div key={index} className="flex flex-col mb-3 ">
                                            <span><b>{formatDateTimeString(visit.start)}</b></span>
                                            <span
                                                className="hover:cursor-pointer"
                                                onClick={() => {
                                                    navigate(`/properties/${visit.property_id}`);
                                                }}
                                            >Dirección: {visit.property_address}</span>
                                            <span
                                                className="hover:cursor-pointer"
                                                onClick={() => {
                                                    navigate(`/clients/${visit.client_id}`);
                                                }}
                                            >Cliente: {visit.client_iden}</span>
                                            
                                        </div>
                                    )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            
        
        </>
    )
}

export default Home;