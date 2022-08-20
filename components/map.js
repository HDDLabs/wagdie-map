import React, { useState, useRef, useEffect } from "react";
import { MapContainer, ImageOverlay, SVGOverlay, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
const Leaflet = require('leaflet');

const Map = () => {
  const center = [500, 500]
  const bounds = [[0, 0], [1000, 1000]]

  return (
    <MapContainer
      center={center}
      zoom={2}
      maxZoom={6}
      minZoom={0}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      crs={Leaflet.CRS.Simple} >

      <ImageOverlay
        url="../images/wagdiemap.jpeg"
        bounds={bounds}
      />

      <Marker
        position={[40.8054, -74.0241]}
        draggable={true}
        animate={true}
      >
        <Popup>
          Hey ! you found me
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map