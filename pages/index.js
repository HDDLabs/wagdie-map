import {
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
} from "wagmi";
import {
  getWikiBattlesData,
  getWikiBurnsData,
  getWikiDeathsData,
} from "../lib/wiki";

import AppContext from "../components/context";
import Head from "next/head";
import InfoPanel from "../components/infoPanel";
import { LayerPanel } from "../components/layerPanel";
import Map from "../components/map";
import { WalletButton } from "../components/walletButton";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { getLocations } from "../lib/locationMiddleware";
import styles from "../styles/Home.module.css";
import { useContext } from "react";

const { provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default function Home({ mapData }) {
  const { selectedLocation } = useContext(AppContext);

  return (
    <WagmiConfig client={client}>
      <div className={styles.container}>
        <Head>
          <title>World of WAGDIE</title>
          <meta name="description" content="Map of the World of WAGDIE." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <InfoPanel infoPanelContent={selectedLocation}></InfoPanel>
          <WalletButton></WalletButton>
          <LayerPanel></LayerPanel>
          <div className={styles.map}>
            <Map mapData={mapData} />
          </div>
        </main>
      </div>
    </WagmiConfig>
  );
}

export async function getStaticProps() {
  const allLocationsData = await getLocations();
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
