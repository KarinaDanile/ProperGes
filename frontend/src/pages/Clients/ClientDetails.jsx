import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { getClient, getClientProperties, getClientVisits } from "../../utils/api";
import { formatDateString, capitalize, formatToCurrency, formatDateTimeString } from "../../utils/property_utils";
import { FaUser, FaEnvelope, FaPhone, FaTag, FaCalendarAlt } from 'react-icons/fa';
import { IoMdNotifications } from "react-icons/io";
import { useToast } from "rc-toastr";


const ClientDetails = () => {
    const navigate = useNavigate();
    const {toast} = useToast();
    const { id }  = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [properties, setProperties] = useState([]);
    const [visits, setVisits] = useState([]);
    const [visibleVisits, setVisibleVisits] = useState(2);
    const [loadingMore, setLoadingMore] = useState(false);
    
    useEffect(() => {
        Promise.all([
            getClient(id),
            getClientVisits(id)
        ])
        .then(([clientData, visitsData]) => {

            setClient(clientData);
            setVisits(visitsData);
            if(clientData.client_type === 'vendedor' || clientData.client_type === 'ambos') {
                setIsOwner(true);
                return getClientProperties(id)
            } else {
                return Promise.resolve([]);
            }
        })
        .then((propertiesData)=> {
            setProperties(propertiesData);
        })
        .catch((error) => {
            toast.error("Error al cargar los datos del cliente");
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id]);

    const handleLoadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleVisits(visibleVisits + 5);
            setLoadingMore(false);
        
        }, 500);
    };


    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="flex h-24 bg-gray-50 px-16 xl:px-40 gap-10 items-center justify-between">
                        <button
                            className="btn-edit border border-gray-400 rounded p-2 bg-white hover:shadow"
                            onClick={() => {
                                navigate('/clients')
                            }}
                        >
                            Volver
                        </button>    
                    </div>
                    <div className="flex flex-col gap-6 px-16 xl:px-40 py-10">
                        <div className="bg-white min-w-fit flex flex-col lg:flex-row lg:justify-around lg:items-center p-6 pt-9 rounded-lg shadow-lg">
                            <div className="flex items-center gap-4 mb-6">
                                <FaUser className="text-3xl text-gray-600" />
                                <div>
                                    <h2 className="text-xl font-semibold">Nombre</h2>
                                    <p className="text-gray-700">{client.name}</p>
                                </div>
                            </div>
                            {client.email && (
                                <div className="flex items-center gap-4 mb-6">
                                    <FaEnvelope className="text-2xl text-gray-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold">Correo Electrónico</h2>
                                        <p className="text-gray-700">{client.email}</p>
                                    </div>
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-center gap-4 mb-6">
                                    <FaPhone className="text-2xl text-gray-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold">Teléfono</h2>
                                        <p className="text-gray-700">{client.phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-6">
                                <FaTag className="text-2xl text-gray-600" />
                                <div>
                                    <h2 className="text-xl font-semibold">Tipo de Cliente</h2>
                                    <p className="text-gray-700">{capitalize(client.client_type)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <IoMdNotifications className="text-3xl text-gray-600" />
                                <div>
                                    <h2 className="text-xl font-semibold">Activo</h2>
                                    <p className="text-gray-700">{client.is_active ? "Si" : "No"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <FaCalendarAlt className="text-2xl text-gray-600" />
                                <div>
                                    <h2 className="text-xl font-semibold">Fecha de Creación</h2>
                                    <p className="text-gray-700">{formatDateString(client.created)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-16 xl:px-40 gap-4 grid grid-cols-2">
                        {visits.length > 0 && (
                            <div className="flex flex-col gap-6  py-10">
                                <div className="bg-white w-fit p-7 rounded-lg shadow-lg">
                                <h1 className="text-2xl mb-3 font-bold">Visitas del Cliente</h1>
                                    {visits.slice(0, visibleVisits).map((visit) => (
                                        <div key={visit.visit_id} className="mb-4">
                                            <h2 
                                                className="text-xl font-semibold hover:text-blue-800 hover:cursor-pointer"
                                                onClick={() => navigate(`/properties/${visit.property_id}`)}
                                            >{visit.property_reference}</h2>
                                            <p className="text-gray-700">{formatDateTimeString(visit.start)}</p>
                                            <p className="text-gray-700">Dirección: {visit.property_address}</p>
                                            <p className="text-gray-700">Estado: {visit.visit_state} </p>
                                            {visit.comments &&
                                                <p className="text-gray-700">Comentarios: {visit.comments}</p>
                                            }
                                        </div>
                                    ))}
                                    {visibleVisits < visits.length && (
                                        <div className="flex justify-center">
                                            <button 
                                                className="btn-edit border border-gray-400 rounded p-2 bg-white hover:shadow"
                                                onClick={handleLoadMore}
                                            >
                                                {loadingMore ? "Cargando..." : "Cargar más"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {isOwner && (
                            <div className="flex flex-col gap-6 py-10">
                                <div className="bg-white w-fit p-7 rounded-lg shadow-lg">
                                    <h1 className="text-2xl mb-3 font-bold">Propiedades</h1>
                                    {properties.length > 0 ? (
                                        properties.map((property) => (
                                            <div key={property.property_id} className="mb-4">
                                                <h2 
                                                    className="text-xl font-semibold hover:text-blue-800 hover:cursor-pointer"
                                                    onClick={() => navigate(`/properties/${property.property_id}`)}
                                                >{property.reference}</h2>
                                                <p className="text-gray-700">Dirección: {property.place_name}</p>
                                                <p className="text-gray-700">Precio: {formatToCurrency(property.price)}</p>
                                                <p className="text-gray-700">Disponibilidad: {capitalize(property.availability)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-700">Este cliente no tiene propiedades.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

        </div>
    )
}

export default ClientDetails;