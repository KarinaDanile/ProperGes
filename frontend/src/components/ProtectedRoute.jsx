import api from "../utils/api";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(null);
   

    const isExpired = (token) => {
        const decoded = jwtDecode(token);
        const tokenExp = decoded.exp;
        const now = Date.now() / 1000;
        return tokenExp < now;
    }

    const clearCookies = () => {
        Cookies.remove('access_token');
        //Cookies.remove('refresh_token');
    
    }

    useEffect(() => {   
        auth().catch((e) => {
            //console.error(e);
            setIsAuthorized(false)});
        if (isAuthorized === false){
            navigate('/login/')
        }
    });

    const refreshToken = async () => {
        const refresh_token = Cookies.get('refresh_token');

        if (isExpired(refresh_token)){
            setIsAuthorized(false);
            Cookies.remove('refresh_token');
            return;
        }
        try{
            const res = await api.post('/token/refresh/', { 
                refresh: refresh_token 
            });

            if (res.status === 200){
                Cookies.set('access_token', res.data.access, { sameSite: 'none'});
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            setIsAuthorized(false);
            return;
        }
    }

    const auth = async () => {
        const token = Cookies.get('access_token');
      
        if(!token){
            setIsAuthorized(false);
            return;
        }
        if (isExpired(token)){
            clearCookies();
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    }

    if (isAuthorized === null){
        return <div>Loading...</div>
    }

    return isAuthorized && children ;

}