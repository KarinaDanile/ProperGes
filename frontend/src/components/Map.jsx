import ReactMapGl, { Marker } from 'react-map-gl';
import PointerIcon from '../assets/pointer.png';
import { useState } from 'react';

const TOKEN = import.meta.env.VITE_TOKEN

function Map({ longitude, latitude }) {
    const [viewport, setViewport] = useState({
        latitude,
        longitude,
        zoom: 16,
    });

    const [marker, setMarker] = useState({ 
        latitude,
        longitude,
    });

    return (
        <div className='map'>
            <ReactMapGl
                {...viewport}
                mapboxAccessToken={TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v12"
            >
                <Marker
                    latitude={marker.latitude}
                    longitude={marker.longitude}

                >
                    <img className='marker' src={PointerIcon} alt="Pointer" />
                </Marker>

            </ReactMapGl>
        </div>
    )
}

export default Map;