import AppContext from "../components/context";
import Head from "next/head";
import LayerPanel from "../components/layerPanel";
import Map from "../components/map";
import MapLegend from "../components/mapLegend";
import { getWikiLocationsData } from "../lib/wiki";
import styles from "../styles/Home.module.css";
import { useContext } from "react";

export default function Home({ allLocationssData }) {
  const { selectedLocation } = useContext(AppContext);

  return (
    <div className={styles.container}>
      <Head>
        <title>World of WAGDIE</title>
        <meta name="description" content="Map of the World of WAGDIE." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MapLegend location={selectedLocation}></MapLegend>
        <LayerPanel></LayerPanel>
        <div className={styles.map}>
          <Map mapLocations={allLocationssData} />
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const allLocationssData = await getWikiLocationsData();

  return {
    props: {
      allLocationssData: allLocationssData,
    },
    revalidate: 1,
  };
}
