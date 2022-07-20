import '../styles/globals.css'
import React from 'react'
import AppContext from '../components/AppContext'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {  
  const [selectedLocation, setSelectedLocation] = useState({
    title: "We Are All Going To Die",
    details: ""
  });
  
  return (
    <AppContext.Provider value = {{ selectedLocation, setSelectedLocation }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp
