import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../utils/constants';

import Form from '../../components/Form';

/*const Login = ({setauth}) => {   

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        const user = {
            username: username,
            password: password
        };
        try {
            const { data } = await axios.post(`${baseURL}/login/`, user);
            
            if (data.error) {
                console.log(data.error)
                return;
            }

            Cookies.set('access_token', data.access_token);
            Cookies.set('refresh_token', data.refresh_token);
            setauth(true);
            navigate('/');
        }
        catch (error) {
            console.error('Error logging in:', error);
        }
    }
    return (
        <>
            <div>
                <h1>Login</h1>
                <form onSubmit={submit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login;
*/ 


export default function Login() {
    return <Form route="/login/" method="login" />;

}