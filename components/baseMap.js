import React, { useState, useRef, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
const Leaflet = require('leaflet');

const BaseMap = ({ mapLocations }) => {
  const mapCenter = [500, 500]
  const imageBounds = [[0, 0], [1000, 1000]]

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
      crs={Leaflet.CRS.Simple}
    >

      <ImageOverlay
        url="../images/wagdiemap.jpeg"
        bounds={imageBounds}
      />

      <Marker
        position={[540, 400]}
        icon={ourLocationIcon}
      ></Marker>

      {mapLocations.map(({ title, coordinates, path }) => (
        <Marker
          key={title}
          position={coordinates}
          icon={locationIcon}
        >
          <Popup
            closeButton={false}
          >
            <a
              href={path}>
              {title}
            </a>
          </Popup>
        </Marker>
      ))
      }

    </MapContainer >
  )
}

export default BaseMap