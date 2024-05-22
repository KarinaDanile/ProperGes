import React, { useState } from 'react';
import api from '../../../utils/api';
import Spinner from '../../../components/Spinner';

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Changing password:', formData);
        try {
            const res = await api.patch('/change-password/', formData);
            console.log(res);
            setMessage(res.data.detail || "Contraseña cambiada con éxito")
        }
        catch (error) {
            if(error.response){
                setMessage(error.response.data.detail || "Error al modificar la contraseña")
            } else {
                setMessage("Error al cambiar la contraseña")
            }
        }
    }




    return (
        <>
            <form 
                className="flex flex-col w-1/2 mx-auto xl:max-w-xl mt-20 p-12 gap-3 bg-white rounded-lg shadow-lg"
                onSubmit={handleSubmit}>
                
                <h3>Cambia tu contraseña</h3>
                <input
                    type="password"
                    name="old_password"
                    value={formData.old_password}
                    placeholder="Contraseña actual"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    placeholder="Contraseña nueva"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Guardar</button>

                {loading && <Spinner />}
                {message && <div className='text-center font-light'>{message}</div>}

            </form>
        </>
    )

}