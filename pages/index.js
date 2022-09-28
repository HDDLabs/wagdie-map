import {
  getWikiBattlesData,
  getWikiBurnsData,
  getWikiDeathsData,
  getWikiLocationsData,
} from "../lib/wiki";

import AppContext from "../components/context";
import Head from "next/head";
import { LayerPanel } from "../components/layerPanel";
import Map from "../components/map";
import MapLegend from "../components/mapLegend";
import TimelineSlider from "../components/timelineSlider";
import styles from "../styles/Home.module.css";
import { useContext } from "react";

export default function Home({ mapData }) {
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
        <TimelineSlider></TimelineSlider>
        <div className={styles.map}>
          <Map mapData={mapData} />
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const allLocationsData = await getWikiLocationsData();
  const allBurnsData = await getWikiBurnsData();
  const allBattlesData = await getWikiBattlesData();
  const allDeathsData = await getWikiDeathsData();

  return {
    props: {
      mapData: {
        allLocationsData: allLocationsData,
        allBurnsData: allBurnsData,
        allBattlesData: allBattlesData,
        allDeathsData: allDeathsData,
      },
    },
    revalidate: 1,
  };
}
