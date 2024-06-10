import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useToast } from "rc-toastr";
import { capitalize } from "../utils/property_utils";


import Offers from "./Offers/Offers";


const Home = () => {
    const {user} = useContext(AuthContext);
    const {toast} = useToast(); 

    return (
        <>
        <div className="flex max-h-full flex-col gap-2 items-center p-6 bg-gray-100">
            <h1>Bienvenido/a{user && <span>, {capitalize(user)}</span>}</h1>
            <span>Este es tu dashboard, ahora mismo está un poco vacío</span>
            <button 
                className="bg-blue-100 p-2 rounded" 
                onClick={() => toast.success("success message")}>Prueba toast</button>
        </div>

      
        <Offers />
        </>
    )
}

export default Home;