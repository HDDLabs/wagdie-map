import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from "next/dynamic";
import { getWikiLocationsData, getPageContent } from '../lib/wiki';

export default function Home({ allLocationssData }) {
  console.log(allLocationssData)

  const MapWithNoSSR = dynamic(() => import("../components/map"), {
    ssr: false
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>World of WAGDIE</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.map}>
          <MapWithNoSSR />
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
    }
  }
}