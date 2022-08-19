import "../styles/globals.css";

import AppContext from "../components/context";
import React from "react";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [selectedLocation, setSelectedLocation] = useState({
    title: "We Are All Going To Die",
    details: "",
  });

  return (
    <AppContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
