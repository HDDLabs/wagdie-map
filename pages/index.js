import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getWikiLocationsData } from '../lib/wiki';
import Map from '../components/map';
import MapLegend from '../components/mapLegend';
import { useContext } from 'react';
import AppContext from '../components/AppContext'


export default function Home({ allLocationssData }) {
  const { selectedLocation } = useContext(AppContext);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>World of WAGDIE</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MapLegend 
          location={selectedLocation}
        >
        </MapLegend>
        <div className={styles.map}>
          <Map mapLocations={allLocationssData} />
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const allLocationssData = await getWikiLocationsData();

  return {
    props: {
      allLocationssData: allLocationssData
    },
    revalidate: 1
  }
}