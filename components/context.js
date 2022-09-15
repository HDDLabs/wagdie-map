import React from "react";

const AppContext = React.createContext({});

export const useViewport = () => {
  const { width, height } = React.useContext(AppContext);
  return { width, height };
};

export default AppContext;
