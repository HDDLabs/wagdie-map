import Head from 'next/head'
import styles from '../styles/Home.module.css'
import dynamic from "next/dynamic";

export default function Home() {
  const MapWithNoSSR = dynamic(() => import("../components/map"), {
    ssr: false
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>WAGDIE Map</title>
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