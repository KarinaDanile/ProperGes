import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useToast } from "rc-toastr";
import { capitalize } from "../utils/property_utils";
import { useState, useEffect } from "react";


const Home = () => {
    const {user} = useContext(AuthContext);
    const {toast} = useToast(); 

    const [loading, setLoading] = useState(true);
    const [pendingVisits, setPendingVisits] = useState([]) 
    const [pendingOffers, setPendingOffers] = useState([]);
    const [hasVisits, setHasVisits] = useState(false);


    useEffect(() => {

    }, []);

    return (
        <>
            <div className="flex max-h-full flex-col gap-2 items-center p-6 bg-gray-100">
                <h1>Bienvenido/a{user && <span>, {capitalize(user)}</span>}</h1>
                <span>Este es tu dashboard, ahora mismo está un poco vacío</span>
                <button 
                    className="bg-blue-100 p-2 rounded" 
                    onClick={() => toast.success("success message")}>Prueba toast</button>
            </div>

            <div className="px-16 xl:px-40 gap-4 grid grid-cols-2">
                <div className="flex flex-col gap-6 py-10">
                    <div className="flex h-24 bg-gray-50 px-10  gap-10 items-center justify-between">
                        <h1>Ofertas por resolver</h1>
                    </div>
                    <div className="bg-white w-fit p-7 rounded-lg shadow-lg">
                        No hay ofertas pendientes
                    </div>

                </div>
                <div className="flex flex-col gap-6 py-10">
                    <div className="flex h-24 bg-gray-50 px-10  gap-10 items-center justify-between">
                        <h1>Visitas pendientes</h1>
                    </div>
                    <div className="bg-white w-fit p-7 rounded-lg shadow-lg">
                        No hay visitas pendientes
                    </div>
                </div>
            </div>
      
        
        </>
    )
}

export default Home;