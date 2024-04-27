
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { baseURL } from '../utils/constants';

const Logout = ({setauth}) => {
    const navigate = useNavigate();
    

    const logout = async () => {
        let refresh_token = {
            refresh_token: Cookies.get('refresh_token')
        }
        console.log(refresh_token)
        try{
            const {data} = await 
            axios.post(`${baseURL}/logout/`, refresh_token);
            console.log(data)
            setauth(false);
            Cookies.remove('access_token');
            Cookies.remove('refresh_Token');
            navigate('/');
        }
        catch (error) {
            console.error('Error logging out:', error);
        }
    }

    useEffect(() => {
        logout();
    }, []);
    
    return(
        <div>
            <h1>Logging out...</h1>
        </div>
    )
    

}

export default Logout;