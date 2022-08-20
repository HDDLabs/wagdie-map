import React, { useState, useRef, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
const Leaflet = require('leaflet');

const Map = () => {
  const mapCenter = [500, 500]
  const imageBounds = [[0, 0], [1000, 1000]]

  const mapLocations = [
    { name: "The Church of Her", coordinates: [520, 467] },
    { name: "Putrid Forest", coordinates: [545, 540] },
    { name: "Crow's Den", coordinates: [480, 517] },
    { name: "Stalwart Fortress", coordinates: [535, 390] },
    { name: "Ruined Kingdoms of Yore", coordinates: [500, 395] },
    { name: "The Wound", coordinates: [515, 200] },
    { name: "Desolate Wastes", coordinates: [520, 280] },
    { name: "Prisons of Yore", coordinates: [480, 320] },
    { name: "Grand Elevator", coordinates: [580, 320] },
  ];

  const ourLocationIcon = Leaflet.icon({
    iconUrl: '../images/mapicons/icon_youarehere.png',
    iconSize: [120, 106]
  });

  const locationIcon = Leaflet.icon({
    iconUrl: '../images/mapicons/icon_location.png',
    iconSize: [40, 40]
  });

  return (
    <MapContainer
      center={mapCenter}
      zoom={2}
      maxZoom={3}
      minZoom={1}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      crs={Leaflet.CRS.Simple} >

      <ImageOverlay
        url="../images/wagdiemap.jpeg"
        bounds={imageBounds}
      />

      <Marker position={[524, 450]} icon={ourLocationIcon}></Marker>

      {mapLocations.map(({ name, coordinates }) => (
        <Marker
          key={name}
          position={coordinates}
          icon={locationIcon}
        >
          <Popup>
            {name}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  )
}

export default Map