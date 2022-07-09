import React, { Component, useEffect } from "react";
import { useMap, useLeafletContext } from "react-leaflet";
import L from "leaflet";
import styles from '../styles/Home.module.css'

const MapInfo = ({ title, details }) => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const legendDiv = L.DomUtil.create("div", styles.legend);
      const legendHeaderDiv = L.DomUtil.create("div", styles.legendHeader)
      const legendTextDiv = L.DomUtil.create("div", styles.legendText)

      legendHeaderDiv.innerHTML = `<h1>${title}</h1>`
      legendTextDiv.innerHTML = `<p>${details}</p>`

      legendDiv.appendChild(legendHeaderDiv)
      legendDiv.appendChild(legendTextDiv)

      return legendDiv;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [title, details]);

  return null;
}

export default MapInfo;