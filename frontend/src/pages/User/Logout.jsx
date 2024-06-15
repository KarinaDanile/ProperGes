
import Cookies from 'js-cookie';
import { useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../utils/constants';
import { useToast } from 'rc-toastr';

const Logout = () => {
    const navigate = useNavigate();
    const {toast} = useToast();
    const {setUser} = useContext(AuthContext);

    const logout = async () => {
        const refresh_token = {
            refresh_token: Cookies.get('refresh_token')
        }
        if (!refresh_token.refresh_token){
            setUser(null);
            navigate('/login/');
            return;
        }
        try{
            const {data} = await 
            axios.post(`${baseURL}/logout/`, refresh_token);
            if (data.error) {
                toast.error("Error cerrando sesión")
                return;
            }
            localStorage.clear();
            Cookies.remove('access_token',  { sameSite: 'none' });
            Cookies.remove('refresh_token', { sameSite: 'none' });
            setUser(null);
            navigate('/login/');
        }
        catch (error) {
            console.error('Error logging out:', error);
        }
    }

    useEffect(() => {
        logout();
    }, []);
    
    return(
        <div></div>
    )
    

}

export default Logout;