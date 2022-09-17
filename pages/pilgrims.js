import ReactTooltip from 'react-tooltip';

import {
  getLocations
} from "../lib/fate";

import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home({ locations }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pilgrims of WAGDIE</title>
        <meta name="description" content="Pilgrims of the World of WAGDIE." />
        <meta property="og:image" content="/images/pilgrims.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.pilgrimMain}>
        {locations.map((location, i) => {
          return (
            <div key={i} className={styles.pilgrimLocation}>
              <h1>{location.name} - {location.known.length + location.unknown.length} ({location.known.length})</h1>
              <div className={styles.flexGrid}>
                {location.known.map((nft, k) => {
                  return (
                    <div
                      data-tip={nft.name}
                      key={k}
                      className={styles.portrait}
                      onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                    >
                      <img src={nft.image} />
                    </div>
                  )
                })}
              </div>
              <div className={styles.flexGrid}>
                {location.unknown.map((nft, k) => {
                  return (
                    <div
                      data-tip={nft.name}
                      key={k}
                      className={styles.naked}
                      onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                    >
                      <img src={nft.image} />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        <div className={styles.pilgrimFooter}/>
      </main>
      <ReactTooltip
        backgroundColor='white'
        textColor='black'
      />
    </div>
  );
}

export async function getStaticProps() {
  const locations = await getLocations();

  return {
    props: {
      locations,
    },
    revalidate: 1,
  };
}
