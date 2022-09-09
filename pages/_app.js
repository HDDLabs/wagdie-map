import "../styles/globals.css";

import AppContext from "../components/context";
import React from "react";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [selectedLocation, setSelectedLocation] = useState({
    title: "We Are All Going To Die",
    details: "",
  });

  const [layers, setLayers] = useState([
    {
      title: "locations",
      active: true,
      image: "../images/legendicons/location_legend.png",
    },
    {
      title: "burns",
      active: true,
      image: "../images/legendicons/burn_legend.png",
    },
    {
      title: "deaths",
      active: true,
      image: "../images/legendicons/death_legend.png",
    },
    {
      title: "battles",
      active: true,
      image: "../images/legendicons/battle_legend.png",
    },
  ]);

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        layers,
        setLayers,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
