import {
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
} from "wagmi";
import { getLocations, invalidateCache } from "../lib/locationMiddleware";
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
import { ToastContainer } from "react-toastify";
import { WalletButton } from "../components/walletButton";
import { alchemyProvider } from "wagmi/providers/alchemy";
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
    <div>
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
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export async function getStaticProps() {
  await invalidateCache();
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
