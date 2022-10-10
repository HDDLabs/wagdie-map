import React from "react";

const AppContext = React.createContext({});

export const useViewport = () => {
  const { width, height } = React.useContext(AppContext);
  return { width, height };
};

export const isDev =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export default AppContext;
