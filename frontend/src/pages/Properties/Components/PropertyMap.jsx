
import ReactMapGl from "react-map-gl";
import { useState } from "react";

const TOKEN = import.meta.env.VITE_DEFAULT_MAPBOX_TOKEN;

export default function PropertyMap() {
    const [viewport, setViewport] = useState({
        longitude: -0.827998,
        latitude: 37.801033,
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
            />
        </div>
    )

}