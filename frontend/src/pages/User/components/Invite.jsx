import { useState } from "react";
import api from "../../../utils/api";
import { useToast } from "rc-toastr";
import Spinner from "../../../components/Spinner";

export default function Invite() {

    const [formData, setFormData] = useState({email: ""});
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/invite/', formData);

            // Notificar exito notificacion al usuario
            toast.success('Invitación enviada con éxito')
        }
        catch (error) {
            toast.error('Ha ocurrido un error al enviar la invitación');
        }
        
        setLoading(false);
    
    }


    return (
        <>
           
            <form 
                className="flex flex-col w-1/2 mx-auto xl:max-w-xl mt-20 p-12 gap-3 bg-white rounded-lg shadow-lg"
                onSubmit={handleSubmit}>
                
                <h3 className="text-xl border-b-2 mt-3 mb-4">Invitación</h3>
                <p>Invita a otros usuarios a la plataforma</p>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <button className="btn-save w-fit self-center" type="submit">Invite</button>

                {loading && <Spinner />}
             
            </form>
        </>
    )
}