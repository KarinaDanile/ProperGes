
import ReactMapGl, { Marker } from "react-map-gl";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const TOKEN = import.meta.env.VITE_DEFAULT_MAPBOX_TOKEN;

export default function PropertyMap({lat, long}) {
    const [viewport, setViewport] = useState({
        longitude: long,
        latitude: lat,
        zoom: 14
    });

    return(
        <div style={{ width:"100%", height:"100%"}}>
            <ReactMapGl
                {...viewport}
                width="100%"
                height="100%"
                mapboxAccessToken={TOKEN}
                onViewportChange={setViewport}
                transitionDuration={300}
                mapStyle={"mapbox://styles/mapbox/streets-v11"}
            >
                <Marker latitude={lat} longitude={long}>
                    <div className="text-2xl text-violet-800"><FaMapMarkerAlt /></div>
                </Marker>
            </ReactMapGl>
        </div>
    )

}