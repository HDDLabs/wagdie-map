import React, { Component, useEffect } from "react";
import { useMap, useLeafletContext } from "react-leaflet";
import L from "leaflet";
import styles from '../styles/Home.module.css'


const legendHtmlFor = (title, description) =>
  [
    title && `<h3>${title}</h3>`,
    description && `<p>${description}</p>`,
  ].join("\n");

const MapInfo = ({ title, description }) => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const legendDiv = L.DomUtil.create("div", styles.legend);
      const legendHeaderDiv = L.DomUtil.create("div", styles.legendHeader)
      const legendTextDiv = L.DomUtil.create("div", styles.legendText)

      legendHeaderDiv.innerHTML = "<h1>We Are All Going To Die</h1>"
      legendTextDiv.innerHTML = legendHtmlFor(title, description);

      legendDiv.appendChild(legendHeaderDiv)
      legendDiv.appendChild(legendTextDiv)

      console.log(legendDiv)

      return legendDiv;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [title, description]);

  return null;
}

export default MapInfo;