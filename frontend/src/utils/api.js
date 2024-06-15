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

export const updateUser = async (userId, data) => {
    try {
        const res = await api.patch(`/agents/${userId}/`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const res = await api.delete(`/agents/${userId}/delete/`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getCities = async () => {
    try {
        const res = await api.get('/places/');
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getClients = async () => {
    try{
        const res = await api.get('/clients/');
        return res.data;
    } catch (error) {
        throw error;
    }   
}

export const getClient = async (id) => {
    try{
        const res = await api.get(`/clients/${id}/`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getClientProperties = async (id) => {
    try{
        const res = await api.get(`/clients/${id}/properties/`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getClientVisits = async (id) => {
    try{
        const res = await api.get(`/clients/${id}/visits/`);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const getProperty = async (id) => {
    try{
        const res = await api.get(`/properties/${id}/`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const updateClientState = async (id, data) => {
    try {
        const res = await api.patch(`/clients/${id}/`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getOwners = async () => {
    try {
        const res = await api.get('/owners/');
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const deleteClient = async (id) => {
    try {
        const res = await api.delete(`/clients/${id}/`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const deleteProperty = async (id) => {
    try {
        const res = await api.delete(`/properties/${id}/`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function getPlaces(query) {
    try {
        const res = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
            {
                params: {
                    access_token: import.meta.env.VITE_TOKEN,
                }
            }
        );
        return res.data.features;
    } catch (error) {
        console.error("Error getting places:", error);
    }
}