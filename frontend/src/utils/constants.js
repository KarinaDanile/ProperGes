import Cookies from 'js-cookie';

export const baseURL = import.meta.env.VITE_API_URL;

export const access_token = Cookies.get('access_token');
export const refresh_token = Cookies.get('refresh_token');

export const headers = {
    "Content-Type": "application/json",
}