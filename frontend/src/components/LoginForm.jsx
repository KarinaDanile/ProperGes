import { useContext, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { AuthContext } from '../context/UserContext';

export default function LoginForm({route, method}) {
    const {setUser} = useContext(AuthContext);

    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        {
            username: "",
            password: "",
        });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            const {data} = await api.post(route, formData);

            if (method === 'login') {
                Cookies.set('access_token', data.access_token, { sameSite: 'none'});
                Cookies.set('refresh_token', data.refresh_token, { sameSite: 'none' });
                setUser(data.user)
                navigate('/');
            } else {
                navigate('/login/');
            }

        } catch (error) {
            if ( error.isAxiosError && error.response ) { 
                setError(error.response.data.error)
            } else {
                setError(error.message)
            }
                
            setTimeout(() => {
                setError(null);
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

    const name = method === "login" ? "Iniciar sesión" : "Register";

    return (
        <>
            <div className="absolute bg-white w-screen h-screen left-0 top-0 flex flex-col items-center pt-20">
                <form 
                    className="h-1/2 w-96 border-2 rounded-3xl p-4 flex flex-col justify-center gap-3 items-center" 
                    onSubmit={handleSubmit}>
                    <h1 className="mb-6">{name}</h1>
                    <input
                        className="w-3/4 border-2 rounded-xl p-2"
                        type="text"
                        name="username"
                        value={formData.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    /> 
                    <br />
                    <input
                        className="w-3/4 border-2 rounded-xl p-2"
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <button type="submit">Acceder</button>
                </form>
                {loading && <div className="font-light text-lg mt-2 text-blue-700 " >Loading...</div>}
                {error && <div>{error}</div>}
            </div>
        </>
    );
}
