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
    },
    {
      title: "burns",
      active: true,
    },
    {
      title: "deaths",
      active: true,
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
