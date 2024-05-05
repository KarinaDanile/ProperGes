import { useState } from "react";
import api from "../utils/api";

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
           
            if (data.error) {
                console.log(data.error)
                return;
            }
            // Notificar exito notificacion al usuario
            console.log(data);

        }
        catch (error) {
            console.error('Error inviting:', error);
        }
    }

    return (
        <>
            <h1>Invite</h1>
            <p>Invite other users to join the platform</p>
            <form onSubmit={handleSubmit}>
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