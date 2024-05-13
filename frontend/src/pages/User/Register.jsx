import { useState } from "react";
import api from "../../utils/api";
import { baseURL } from "../../utils/constants";
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        password2: "",
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
                const {data} = await api.post(`${baseURL}/register/`, finalData);
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
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
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
                <button type="submit">Register</button>
            </form>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
        </>
    )
}