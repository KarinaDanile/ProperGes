import Cookies from 'js-cookie';

export const baseURL = "http://localhost:8000/api"

export const access_token = Cookies.get('access_token');
export const refresh_token = Cookies.get('refresh_token');

export const headers = {
    "Content-Type": "application/json",
}