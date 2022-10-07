import AppContext from "./context";
import React from "react";
import { useState } from "react";

export const AppProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    name: "We Are All Going To Die",
    details: "",
  });

  const [layers, setLayers] = useState([
    {
      title: "locations",
      active: true,
      image: "../images/legendicons/legend_icon_location_on.png",
    },
    {
      title: "burns",
      active: true,
      image: "../images/legendicons/legend_icon_burn_on.png",
    },
    {
      title: "deaths",
      active: true,
      image: "../images/legendicons/legend_icon_death_on.png",
    },
    {
      title: "battles",
      active: true,
      image: "../images/legendicons/legend_icon_fight_on.png",
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
