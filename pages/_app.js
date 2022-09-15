import "../styles/globals.css";

import AppProvider from "../components/appProvider";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
