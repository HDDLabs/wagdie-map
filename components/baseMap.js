import React, { useState, useRef, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import "leaflet-defaulticon-compatibility";
const Leaflet = require('leaflet');

const BaseMap = ({ data }) => {
  console.log(data)
  const mapCenter = [500, 500]
  const imageBounds = [[0, 0], [1000, 1000]]

  const mapLocations = [
    {
      id: 95,
      name: "The Church of Her",
      coordinates: [520, 467],
      link: "https://wagdie.wiki/locations/the_church_of_her"
    },
    {
      id: 96,
      name: "Stalwart Fortress",
      coordinates: [535, 390],
      link: "https://wagdie.wiki/locations/stalwart_fortress"
    },
    {
      id: 97,
      name: "Ruined Kingdoms of Yore",
      coordinates: [500, 395],
      link: "https://wagdie.wiki/locations/the_kingdoms_of_yore"
    },
    {
      id: 98,
      name: "Putrid Forest",
      coordinates: [545, 540],
      link: "https://wagdie.wiki/locations/the_putrid_forest"
    },
    {
      id: 99,
      name: "Prisons of Yore",
      coordinates: [480, 320],
      link: "https://wagdie.wiki/locations/prisons_of_yore"
    },
    {
      id: 100,
      name: "Desolate Wastes",
      coordinates: [520, 280],
      link: "https://wagdie.wiki/locations/desolate_wastes"
    },
    {
      id: 101,
      name: "The Wound",
      coordinates: [515, 200],
      link: "https://wagdie.wiki/locations/the_wound"
    },
    {
      id: 102,
      name: "Grand Elevator",
      coordinates: [580, 320],
      link: "https://wagdie.wiki/locations/the_grand_elevator"
    },
    {
      id: 103,
      name: "Crow's Den",
      coordinates: [480, 517],
      link: "https://wagdie.wiki/locations/the_crows_den"
    },
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

      {mapLocations.map(({ name, coordinates, link }) => (
        <Marker
          key={name}
          position={coordinates}
          icon={locationIcon}
        >
          <Popup
            closeButton={false}
          >
            <a
              href={link}>
              {name}
            </a>
          </Popup>
        </Marker>
      ))
      }

    </MapContainer >
  )
}

export default BaseMap