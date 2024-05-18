import { useState } from "react";
import api from "../../utils/api";

export default function Invite() {

    const [formData, setFormData] = useState({email: ""});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Inviting:', formData);
        try {
            const { data } = await api.post('/invite/', formData);

            // Notificar exito notificacion al usuario
            console.log(data);

        }
        catch (error) {
            console.error(error.response.data.error);
        }
    }

    return (
        <>
           
            <form 
                className="flex flex-col w-1/2 mx-auto xl:max-w-xl mt-20 p-12 gap-3 bg-white rounded-lg shadow-lg"
                onSubmit={handleSubmit}>
                
                <h1>Invitar</h1>
                <p>Invita a otros usuarios a la plataforma</p>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Invite</button>
            </form>
        </>
    )
}