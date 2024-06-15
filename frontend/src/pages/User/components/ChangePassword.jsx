import React, { useState } from 'react';
import api from '../../../utils/api';
import Spinner from '../../../components/Spinner';
import { useToast } from 'rc-toastr';

export default function ChangePassword() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
    });
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.patch('/change-password/', formData);
            if (res.status === 200) {
                toast.success("Contraseña cambiada con éxito")
            } 
            setFormData({
                old_password: "",
                new_password: "",
            });
            setLoading(false);
        }
        catch (error) {
            if(error.response.data.old_password){
                toast.error("La contraseña actual no es correcta")
            } else {
                toast.error("Error al cambiar la contraseña")
            }
            setLoading(false);
        }
    }




    return (
        <>
            <form 
                className="flex flex-col mb-10 w-96 mx-auto  mt-20 p-12 gap-3 bg-white rounded-lg shadow-lg"
              
                onSubmit={handleSubmit}>
                
                <h3 className="text-xl border-b-2 mt-3 mb-4">Cambiar contraseña</h3>
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
                <button className='btn-save w-fit self-center' type="submit">Guardar</button>

                
            </form>
            {loading && <Spinner />}
        </>
    )

}