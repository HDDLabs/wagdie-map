import React, { useState, useRef, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
import MapInfo from '../components/mapInfo';
const Leaflet = require('leaflet');

const BaseMap = ({ mapLocations }) => {
  const [selectedSite, setSelectedSite] = useState({
    title: "We Are All Going To Die",
    details: ""
  });
  const handleSiteClick = (site) => {
    setSelectedSite(site);
  }

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
      <MapInfo
        title={selectedSite && selectedSite.title}
        details={selectedSite && selectedSite.details}
      >
      </MapInfo>

      <ImageOverlay
        url="../images/wagdiemap.jpeg"
        bounds={imageBounds}
      />

      <Marker
        position={[540, 400]}
        icon={ourLocationIcon}
      ></Marker>

      {mapLocations.map((location) => (
        <Marker
          key={location.title}
          position={location.htmlcoordinates}
          icon={locationIcon}
          eventHandlers={{
            click: (e) => {
              handleSiteClick(location)
            },
          }}
        >
          <Popup
            closeButton={false}
          >
            <a
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