import AppContext from "./context";
import React from "react";
import { useState } from "react";

export const AppProvider = ({ children }) => {
  const [selectedChapter, setSelectedChapter] = useState({
    title: "The Church of Her",
    coordinates: [520, 467],
  });

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

  const [width, setWidth] = React.useState(undefined);
  const [height, setHeight] = React.useState(undefined);

  React.useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedChapter,
        setSelectedChapter,
        selectedLocation,
        setSelectedLocation,
        layers,
        setLayers,
        width,
        height,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
