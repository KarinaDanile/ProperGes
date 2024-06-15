import { useNavigate, useParams } from "react-router-dom";
import { formatToCurrency } from "../../utils/property_utils";
import ImageSlider from "./Components/Slider";
import { IoBed } from "react-icons/io5";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { LiaToiletSolid } from "react-icons/lia";
import { CiCircleAlert } from "react-icons/ci";
import { LiaEuroSignSolid } from "react-icons/lia";
import { CiImageOff } from "react-icons/ci";
import PropertyMap from "./Components/PropertyMap";
import { useState, useEffect } from "react";
import EditProperty from "./Components/EditProperty";
import { getClient, getProperty, deleteProperty } from "../../utils/api";
import Spinner from "../../components/Spinner";
import { capitalize, formatDateString } from "../../utils/property_utils";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useToast } from "rc-toastr";

export default function PropertyDetails() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const { id }  = useParams();
    const [property, setProperty] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showEditForm, setShowEditForm] = useState(false);
    
    const handleEditProperty = () => {
        setShowEditForm(true);
    }

    const updateProperty = (data) => {
        setProperty(data);
    }

    const handleDeteleProperty = () => {
        deleteProperty(id)
        .then(() => {
            navigate('/properties/');
        })
        .catch((error) => {
            toast.error("Error al eliminar la propiedad");
        })
    }

    const getAvailabilityClass = (availability) => {
        switch (availability) {
            case 'reservada':
                return 'text-orange-500';
            default:
                return 'text-red-500';
        }
    };

    useEffect(() => {
        getProperty(id)
            .then((data) => {
                setProperty(data);
                if(data.owner){
                    return getClient(data.owner);
                }
            })
            .then((ownerData) => {
                setOwner(ownerData);
            })
            .catch((error) => {
                toast.error("Error al cargar la propiedad");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [id]);

    
    return (
        <>

        {showEditForm ? <EditProperty property={property} updateProperty={updateProperty} setShowEditForm={setShowEditForm} />
        :
            (
                <>

                {loading ? <Spinner/> 
                
                : (

                    <div className='flex flex-col items-center justify-center'>
                        <div className="flex w-full h-24 bg-gray-100 px-16 xl:px-60 gap-10 items-center justify-between ">
                            <button 
                                className="btn-edit border border-gray-300 rounded p-2 h-10 bg-white hover:shadow" 
                                onClick={() => navigate('/properties/')}
                            >
                                Volver
                            </button>
                            <div className="flex  gap-3">
                                <button 
                                    onClick={handleEditProperty}
                                    className="flex items-center gap-1 border rounded-md hover:shadow bg-white p-2 border-gray-300">
                                    <FaRegEdit /> Editar
                                </button>
                                <button 
                                    onClick={handleDeteleProperty}
                                    className="flex items-center gap-1 border rounded-md hover:shadow bg-white p-2 border-gray-300">
                                    <RiDeleteBinLine /> Eliminar
                                </button>
                            </div>
                            
                        </div>

                        {!property ? (
                            <div className='flex flex-col items-center justify-center'>
                                <h1 className='text-3xl font-bold mt-4'>Propiedad no encontrada</h1>
                            </div>
                        ): (
                            <>
                                <div className="flex lg:flex-row flex-wrap xl:flex-nowrap flex-col gap-6 p-10" style={{width:"90%", height:"auto"}}>


                                {
                                    property.availability !== 'disponible' &&
                                    <div className={`flex px-3 items-center gap-3 text-xl font-normal ${getAvailabilityClass(property.availability)} `}>
                                        <CiCircleAlert />
                                        <p>Propiedad Vendida</p>
                                    </div>
                                }
                                <div className="flex flex-col flex-wrap bg-white align-center border rounded-2xl "
                                   style={{minWidth:"60%", maxWidth:"800px", height:"auto"}}
                                >
                                    <div className="images flex w-full justify-center border border-slate-100 p-6 rounded-t-2xl">
                                        <div style={{width:"100%", height:"420px", padding:"16px"}}>
                                            {property.images && property.images.length > 0
                                                ? property.images.length > 1 
                                                    ? <ImageSlider images={property.images}/>
                                                    : <div className="w-full h-full" style={ {backgroundImage: `url(${property.images[0].image})`, backgroundSize: 'cover', backgroundPosition: 'center' } }></div>
                                                
                                                : <div 
                                                    className="w-full h-full flex justify-center items-center text-7xl text-gray-500 bg-slate-200"
                                                    >
                                                    <CiImageOff />  
                                                </div>
                                            }
                                        </div>                            
                                    </div>
                                    <div>
                                        <h2 className="text-2xl px-10 py-2">
                                            {capitalize(property.property_type)} en {property.place}
                                        </h2>
                                    </div>
                                    <div className="p-10 py-5 flex items-center gap-10">
                                        <div className="text-2xl font-normal">
                                            {formatToCurrency(property.price)}
                                        </div>
                                        <div className="font-light text-base ">
                                            {property.place_name}
                                        </div>
                                        
                                    </div>
                                    <div className="basic-info p-4 py-3 px-10 flex flex-row gap-5">
                                        <div className="flex border p-5  bg-white/50 rounded-md items-center gap-3">
                                            <IoBed/>{property.beds} 
                                        </div>
                                        <div className="flex border p-5 bg-white/50  rounded-md items-center gap-3">
                                            <LiaToiletSolid/>{property.baths}
                                        </div>
                                        <div className="flex border p-5  bg-white/50  rounded-md items-center gap-3">
                                            <TfiRulerAlt2/>{property.sqft + 'm²'} 
                                        </div>
                                        <div className="flex border p-5  bg-white/50  rounded-md items-center gap-3">
                                            <LiaEuroSignSolid />
                                            {property.is_negotiable ? 'Negociable' : 'No negociable'}
                                        </div>
                                    </div>

                                    <div className="description px-10 py-5 pb-10">
                                        {property.description}
                                    </div>
                                    <div className="px-10 py-5 border-t ">
                                        <div>Última actualización: {formatDateString(property.update)}</div>
                                        <div>Fecha creación: {formatDateString(property.list_date)}</div>
                                        <div>{property.reference}</div>
                                    </div>
                                
                                </div>
                                <div className="flex flex-col sm:items-center lg:items-start gap-6"
                                    
                                >
                                    <div 
                                        className=" p-5 border bg-white border-gray-200 w-full rounded-2xl" 
                                        
                                    >
                                        <h2
                                            className="text-xl font-normal px-5 py-2 border-b border-gray-200"
                                        >Información del propietario</h2>
                                        <div
                                            className="p-3"
                                        >
                                            <p 
                                                className="font-normal cursor-pointer text-blue-500 hover:text-blue-700"
                                                onClick={() => navigate(`/clients/${owner.client_id}`)}
                                            >{owner && owner.name}</p>
                                            <p>Datos de contacto:</p>
                                            <p>{owner && owner.email}</p>
                                            <p>{owner && owner.phone}</p>
                                        </div>
                                    </div>
                                    <div style={{width:"500px", height:"300px"}}>
                                        <PropertyMap lat={property.latitude} long={property.longitude} />
                                    </div>
                                </div>
                                
                                </div>
                            </>

                        )}
                    </div>

                )
                
                
                }
                    
                </>

            )
        }

       
        </>
    )

}