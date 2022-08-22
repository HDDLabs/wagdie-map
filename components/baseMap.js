import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import {
  ImageOverlay,
  LayerGroup,
  MapContainer,
  Marker,
  useMap,
} from "react-leaflet";
import React, { useContext, useEffect, useRef } from "react";

import AppContext from "../components/context";

const Leaflet = require("leaflet");

const BaseMap = ({ mapLocations }) => {
  const { setSelectedLocation } = useContext(AppContext);
  const { layers } = useContext(AppContext);
  const locationsLayerGroup = useRef();

  const MapController = () => {
    const map = useMap();

    useEffect(() => {
      layers.forEach((layer) => {
        if (layer.title == "locations") {
          layer.active == true
            ? map.addLayer(locationsLayerGroup.current)
            : map.removeLayer(locationsLayerGroup.current);
        }
      });
    }, [map]);

    return <></>;
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const mapCenter = [500, 500];
  const imageBounds = [
    [0, 0],
    [1000, 1000],
  ];

  const ourLocationIcon = Leaflet.icon({
    iconUrl: "../images/mapicons/icon_youarehere.png",
    iconSize: [120, 106],
    iconAnchor: [60, 96],
  });

  const locationIcon = Leaflet.icon({
    iconUrl: "../images/mapicons/icon_location.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
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
      <ImageOverlay url="../images/wagdiemap.png" bounds={imageBounds} />

      <LayerGroup id="ourLocation">
        <Marker
          key={"location"}
          position={mapLocations.ourLocation.htmlcoordinates}
          icon={ourLocationIcon}
        ></Marker>
      </LayerGroup>

      <LayerGroup id="locations" ref={locationsLayerGroup}>
        {mapLocations.locations.map((location) => (
          <Marker
            key={location.title}
            position={location.htmlcoordinates}
            icon={locationIcon}
            eventHandlers={{
              click: (_e) => {
                handleMarkerClick(location);
              },
            }}
          ></Marker>
        ))}
      </LayerGroup>
      <MapController />
    </MapContainer>
  );
};

export default BaseMap;
