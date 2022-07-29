import React, { useState, useContext, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import AppContext from '../components/AppContext'
const Leaflet = require('leaflet');

const BaseMap = ({ mapLocations }) => {
  const { setSelectedLocation } = useContext(AppContext);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location)
  }

  const mapCenter = [500, 500]
  const imageBounds = [[0, 0], [1000, 1000]]

  const ourLocationIcon = Leaflet.icon({
    iconUrl: '../images/mapicons/icon_youarehere.png',
    iconSize: [120, 106],
    iconAnchor: [60, 96]
  });

  const locationIcon = Leaflet.icon({
    iconUrl: '../images/mapicons/icon_location.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
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
        url="../images/wagdiemap.png"
        bounds={imageBounds}
      />

      <Marker
        key={"location"}
        position={mapLocations.ourLocation.htmlcoordinates}
        icon={ourLocationIcon}
      ></Marker>

      {mapLocations.locations.map((location) => (
        <Marker
          key={location.title}
          position={location.htmlcoordinates}
          icon={locationIcon}
          eventHandlers={{
            click: (e) => {
              handleMarkerClick(location)
            },
          }}
        >
          <Popup
            closeButton={false}
          >
            <a
              rel="noreferrer"
              target="_blank"
              href={location.path}>
              {location.title}
            </a>
          </Popup>
        </Marker>
      ))
      }
    </MapContainer >
  )
}

export default BaseMap