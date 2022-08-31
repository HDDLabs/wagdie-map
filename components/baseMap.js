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

const BaseMap = ({ mapData }) => {
  const { setSelectedLocation } = useContext(AppContext);
  const { layers } = useContext(AppContext);
  const locationsLayerGroup = useRef();
  const burnsLayerGroup = useRef();
  const battlesLayerGroup = useRef();
  const deathsLayerGroup = useRef();

  const MapController = () => {
    const map = useMap();

    useEffect(() => {
      layers.forEach((layer) => {
        if (layer.title == "locations") {
          layer.active == true
            ? map.addLayer(locationsLayerGroup.current)
            : map.removeLayer(locationsLayerGroup.current);
        } else if (layer.title == "burns") {
          layer.active == true
            ? map.addLayer(burnsLayerGroup.current)
            : map.removeLayer(burnsLayerGroup.current);
        } else if (layer.title == "battles") {
          layer.active == true
            ? map.addLayer(battlesLayerGroup.current)
            : map.removeLayer(battlesLayerGroup.current);
        } else if (layer.title == "deaths") {
          layer.active == true
            ? map.addLayer(deathsLayerGroup.current)
            : map.removeLayer(deathsLayerGroup.current);
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

  const burnIcon = Leaflet.icon({
    iconUrl: "../images/mapicons/icon_burn.png",
    iconSize: [38, 74],
    iconAnchor: [19, 74],
  });

  const battleIcon = Leaflet.icon({
    iconUrl: "../images/mapicons/icon_fight.png",
    iconSize: [38, 74],
    iconAnchor: [19, 74],
  });

  const deathIcon = Leaflet.icon({
    iconUrl: "../images/mapicons/icon_death.png",
    iconSize: [38, 74],
    iconAnchor: [19, 74],
  });

  return (
    <MapContainer
      center={mapCenter}
      zoom={2}
      maxZoom={3}
      minZoom={0}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      crs={Leaflet.CRS.Simple}
    >
      <ImageOverlay url="../images/wagdiemap.png" bounds={imageBounds} />

      <LayerGroup id="ourLocation">
        <Marker
          key={"location"}
          position={mapData.allLocationsData.ourLocation.htmlcoordinates}
          icon={ourLocationIcon}
        ></Marker>
      </LayerGroup>

      <LayerGroup id="locations" ref={locationsLayerGroup}>
        {mapData.allLocationsData.locations.map((location) => (
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

      <LayerGroup id="burns" ref={burnsLayerGroup}>
        {mapData.allBurnsData.map((burn) => (
          <Marker
            key={burn.title}
            position={burn.htmlcoordinates}
            icon={burnIcon}
            eventHandlers={{
              click: (_e) => {
                handleMarkerClick(burn);
              },
            }}
          ></Marker>
        ))}
      </LayerGroup>

      <LayerGroup id="battles" ref={battlesLayerGroup}>
        {mapData.allBattlesData.map((battle) => (
          <Marker
            key={battle.title}
            position={battle.htmlcoordinates}
            icon={battleIcon}
            eventHandlers={{
              click: (_e) => {
                handleMarkerClick(battle);
              },
            }}
          ></Marker>
        ))}
      </LayerGroup>

      <LayerGroup id="deaths" ref={deathsLayerGroup}>
        {mapData.allDeathsData.map((death) => (
          <Marker
            key={death.title}
            position={death.htmlcoordinates}
            icon={deathIcon}
            eventHandlers={{
              click: (_e) => {
                handleMarkerClick(death);
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
