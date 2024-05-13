import { useContext, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { AuthContext } from '../context/UserContext';

export default function Form({route, method}) {
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
                Cookies.set('access_token', data.access_token, { expires: 1, sameSite: 'none', secure: true});
                Cookies.set('refresh_token', data.refresh_token, { expires: 1, sameSite: 'none', secure: true});
                setUser(data.user)
                navigate('/');
            } else {
                navigate('/login/');
            }

        } catch (error) {
            setError(error.response.data.error)
            setTimeout(() => {
                setError(null);
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

    const name = method === "login" ? "Login" : "Register";

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>{name}</h1>
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
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">{name}</button>
            </form>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
        </>
    );
}
