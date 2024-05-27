import axios from "axios";

const MAPQUEST_API_KEY = import.meta.env.VITE_MAPQUEST_TOKEN;

export const getCoordinates = async (address) => {
    const response = await axios.get('https://www.mapquestapi.com/geocoding/v1/address', {
        params: {
            key: MAPQUEST_API_KEY,
            location: address
        }
    });

    if(response.data && response.data.results && response.data.results[0].locations){
        const location = response.data.results[0].locations[0];
        return {
            latitude: location.latLng.lat,
            longitude: location.latLng.lng
        }
    } else {
        throw new Error('No se encontraron coordenadas para la dirección proporcionada');
    }
};
