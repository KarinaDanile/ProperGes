import { useLocation, useNavigate } from "react-router-dom";
import { formatToCurrency } from "../../utils/property_utils";
import ImageSlider from "./Components/Slider";
import { IoBed } from "react-icons/io5";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { LiaToiletSolid } from "react-icons/lia";
import PropertyMap from "./Components/PropertyMap";

export default function PropertyDetails() {
    const navigate = useNavigate();
    const state = useLocation();
    const property = state.state.property;

    console.log(property)
    

    return (

        <div className='flex flex-col items-center justify-center'>
            <div className="flex w-full h-24 bg-gray-100 px-16 xl:px-60 gap-10 items-center justify-between ">
                <button className="btn-edit" onClick={() => navigate('/properties/')}>Volver</button>
                <div className="flex bg-blue-100">
                    <button className="btn-edit">
                        Editar
                    </button>
                    <button className="btn-delete">
                        Eliminar
                    </button>
                </div>
                
            </div>

            {!property ? (
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-3xl font-bold mt-4'>Propiedad no encontrada</h1>
                </div>
            ): (
                <>
                    <div className="flex lg:flex-row flex-wrap items-center sm:flex-col gap-6 p-10" style={{width:"80%", height:"auto"}}>

                    <div className="flex flex-col bg-slate-50 align-center w-5/6 lg:w-4/6 border rounded-2xl ">
                        <div className="images flex justify-center border border-slate-100 p-6 rounded-t-2xl">
                            <div style={{width:"100%", height:"420px", padding:"16px"}}>
                                {property.images && <ImageSlider images={property.images}/>}
                            </div>                            
                        </div>
                        
                        <div className="p-10 flex items-center gap-10">
                            <div className="text-2xl">
                                {formatToCurrency(property.price)}
                            </div>
                            <div className="font-light text-base ">
                                {property.place_name}
                            </div>
                            
                        </div>
                        <div className="basic-info p-4 px-10 flex flex-row gap-16">
                            <div className="flex items-center gap-3">
                                <IoBed/>{property.beds} 
                            </div>
                            <div className="flex items-center gap-3">
                                <LiaToiletSolid/>{property.baths}
                            </div>
                            <div className="flex items-center gap-3">
                                <TfiRulerAlt2/>{property.sqft + 'm²'} 
                            </div>
                            
                        </div>
                        <div className="description p-10 ">
                            {property.description}
                        </div>
                       
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <div className="bg-red-200" style={{width:"400px", height:"200px"}}></div>
                        <div style={{width:"400px", height:"400px"}}>
                            <PropertyMap />
                        </div>
                    </div>
                    
                    </div>
                </>

            )}
        </div>
    )

}