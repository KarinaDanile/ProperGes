// Axios interceptor

import Cookies from 'js-cookie';
import axios from 'axios';
import { baseURL } from './constants';

const api = axios.create({
    baseURL: baseURL
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


export default api;


export const getUsers = async () => {
    try {
        const res = await api.get('/agents/');
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getProperties = async () => {
    try {
        const res = await api.get('/properties/');
        return res.data;
    } catch (error) {
        throw error;
    }
}