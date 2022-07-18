import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getWikiLocationsData } from '../lib/wiki';
import Map from '../components/map';
import MapLegend from '../components/mapLegend';

export default function Home({ allLocationssData }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>World of WAGDIE</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <MapLegend />
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