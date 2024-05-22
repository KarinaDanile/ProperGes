import { useState, useEffect } from "react";
import api from "../../../utils/api";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        password2: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();
    const token = query.get('token');

    useEffect(() => {
        if (token) {
            setLoading(true);
            api.post(`/validate_invitation_token/`, {token: token})
                .then((res) => {
                    if (res.status === 200) {
                        setFormData({
                            ...formData,
                            email: res.data.email,
                        });
                    } else {
                        setError('Enlace no válido o expirado');
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setError('Error al validar enlace');
                    setLoading(false);
                });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // check password match
        if (formData.password !== formData.password2) {
            setError("Passwords do not match");
            setTimeout(() => {
                setError(null);
            }, 2000);
            setLoading(false);
            return;
        } else {
            // if match remove password2 from formData
            const { password2, ...finalData } = formData;
            try {
                const {data} = await api.post(`/register/`, finalData);
                console.log(data)
                navigate('/login/');
                
            } catch (error) {
                setError(error.response.data.error)
                console.log(error)
                setTimeout(() => {
                    setError(null);
                }, 2000);
            } finally {
                setLoading(false);
            }
        }
        
       
    };
    

    return (
        <>
            <form
                className="flex flex-col items-center p-4 rounded-lg shadow-lg w-1/2 mx-auto mt-20 gap-1 bg-white min-w-min max-w-sm" 
                onSubmit={handleSubmit}>                
                <h1 className="text-xl my-2 font-bold text-center w-full pb-2 "
                >Registro</h1>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                /> 
                <br />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleChange}
                /> 
                <br />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    placeholder="Phone"
                    onChange={handleChange}
                /> 
                <br />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    placeholder="Repeat password"
                    onChange={handleChange}
                    required
                />
                <br />
                <button
                    className="w-2/3 bg-blue-500 text-white rounded-lg p-2 my-3" 
                    type="submit">Enviar</button>
            </form>
            {loading 
            && <div
                className="text-blue-600 border border-blue-600 border-dashed p-2 mt-2 w-1/3 mx-auto rounded-lg shadow-lg bg-white"
                >Cargando...</div>}
            {error 
            && <div 
                className="text-red-600 border border-red-600 border-dashed p-2 mt-2 w-1/3 mx-auto rounded-lg shadow-lg bg-white"
            >{error}</div>}
        </>
    )
}