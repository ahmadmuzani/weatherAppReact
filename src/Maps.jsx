import React, { useState, useEffect } from 'react';
// import H from 'react-here-maps'; // atau impor sesuai dengan pustaka yang Anda gunakan
import H from '@here/maps-api-for-javascript';
const MapComponent = ({ lat, lon }) => {
    useEffect(() => {
        const sLocation = (event) => {
            if (event.key === 'Enter') {
                if (map.current) {
                    const latMaps = data.coord ? data.coord.lat : null;
                    const lonMaps = data.coord ? data.coord.lon : null;

                    // Update center and marker position
                    map.current.setCenter({ lat: latMaps, lng: lonMaps });
                    marker.current.setGeometry(new H.geo.Point(latMaps, lonMaps));
                }
            }
        };

        // ... (code lainnya)

        // Check if the map object has already been created
        if (!map.current) {
            // ... (code lainnya)

            const newMap = new H.Map(mapRef.current, rasterTileLayer, {
                pixelRatio: window.devicePixelRatio,
                center: {
                    lat: -6.232600212097168,
                    lng: 106.90339660644531,
                },
                zoom: 14,
            });

            // Add panning and zooming behavior to the map
            const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));

            // Set the map object to the reference
            map.current = newMap;

            // Create a marker
            const marker = new H.map.Marker({ lat: -6.232600212097168, lng: 106.90339660644531 });
            map.current.addObject(marker);

            // Set marker to the reference
            marker.current = marker;
        }

        // ... (code lainnya)

        // Dependencies array
        [apikey, data.coord.lat, data.coord.lon]
    });

    return (
        <div
            ref={(m) => setMap(m)}
            style={{ height: '400px', width: '100%' }}
            center={{ lat, lng: lon }}
            zoom={14}
        />
    );
};

export default MapComponent;
