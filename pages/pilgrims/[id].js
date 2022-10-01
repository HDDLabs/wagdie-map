import { useRouter } from 'next/router'
import { useState } from "react";
import _ from "lodash";
import Fuse from 'fuse.js';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link'

import {
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
  useAccount,
  useConnect,
  useEnsName,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

import {
  getAccount
} from "../../lib/fate";

import Head from "next/head";
import styles from "../../styles/Home.module.css";

const { provider, webSocketProvider } = configureChains(
  defaultChains,
  [publicProvider()],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const OwnerName = ({ address, count, burned }) => {
  const { data: ensName } = useEnsName({ address });

  return (
    <h3 className={styles.h3} style={{ padding: '10px'}}>
      {ensName || address} ({count} - {burned})
    </h3>
  );
};

const Main = ({ locations, id }) => {
  const [filter, setFilter] = useState(0);
  const [search, setSearch] = useState('');
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  let allNFTs = [];

  for (const location of locations) {
    allNFTs = [...allNFTs, ...location.known, ...location.unknown, ...location.burned];
  }

  const total = allNFTs.filter((n) => !n.isBurned);
  const burned = allNFTs.filter((n) => n.isBurned);

  const fuse = new Fuse(allNFTs, {
    threshold: 0.1,
    includeScore: true,
    keys: ['name', 'owner']
  });

  const result = (fuse.search(search)).map((s) => s.item.id);

  return (
    <main className={styles.pilgrimMain}>
      <div className={styles.pilgrimHeader}>
        <a href="/">
          <img className={styles.pilgrimLogo} src="/images/wagdie.png" />
        </a>
        <Link href={`/pilgrims`}>
          <div className={styles.byOwner}>
            Locations
          </div>
        </Link>
        <div className={styles.search}>
          <input
            type="text"
            name="search"
            placeholder="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
        <OwnerName address={id} count={total.length} burned={burned.length} />
        {/* {isConnected && (
          <div
            className={filter === 2 ? styles.byOwnerOn : styles.byOwner}
            onClick={() => filter === 2 ? setFilter(0) : setFilter(2)}>
              {ensName || address}
          </div>
        )} */}
      </div>
      {locations.map((location, i) => {
        return (
          <div key={i} className={styles.pilgrimLocation}>
            <div className={styles.locationTitles}>
              <div>
                <h1>
                  {location.name}
                </h1>
              </div>
              <div>
                <h3 className={styles.h3}>
                  Staked ({location.known.length + location.unknown.length + location.burned.length})
                </h3>
              </div>
              <div>
                <h3 className={styles.h3}>
                  Alive ({location.known.length + location.unknown.length})
                </h3>
              </div>
              <div>
                <h3 className={styles.h3}>
                  Burned ({location.burned.length})
                </h3>
              </div>
              <div>
                <h3 className={styles.h3}>
                  Characters ({location.known.length})
                </h3>
              </div>
              <div>
                <h3 className={styles.h3}>
                  Unknowns ({location.unknown.length})
                </h3>
              </div>
            </div>
            <>
              <div className={styles.flexGrid}>
                {location.known.map((nft, k) => {
                  if ((search && _.includes(result, nft.id)) || !search) {
                    return (
                      <Tooltip key={k} title={nft.shortName} placement="top" arrow>
                        <div
                          className={styles.portrait}
                          onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                        >
                          <img src={nft.image} />
                        </div>
                      </Tooltip>
                    )
                  }
                })}
              </div>
              <div className={styles.flexGrid}>
                {location.unknown.map((nft, k) => {
                  if ((search && _.includes(result, nft.id)) || !search) {
                    return (
                      <Tooltip key={k} title={nft.shortName} placement="top" arrow>
                        <div
                          className={styles.portrait}
                          style={{
                            opacity: 0.6,
                          }}
                          onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                        >
                          <img src={nft.image} />
                        </div>
                      </Tooltip>
                    ) 
                  }
                })}
              </div>
              <div className={styles.flexGrid}>
                {location.burned.map((nft, k) => {
                  if ((search && _.includes(result, nft.id)) || !search) {
                    return (
                      <Tooltip key={k} title={nft.shortName} placement="top" arrow>
                        <div
                          className={styles.burnedSmall}
                          onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                        >
                          <img className={styles.imageSmall} src={nft.image} />
                          <img className={styles.fireSmall} src={'/images/fire.gif'} />
                        </div>
                      </Tooltip>
                    ) 
                  }
                })}
              </div>
            </>
          </div>
        )
      })}
      <div className={styles.pilgrimFooter}/>
    </main>
  );
};

export default function Owner({ locations }) {
  const router = useRouter();
  const { id }= router.query;

  return (
    <WagmiConfig client={client}>
      <div className={styles.container}>
        <Head>
          <title>Pilgrims of WAGDIE</title>
          <meta name="description" content="Pilgrims of the World of WAGDIE." />
          <meta property="og:image" content="/images/pilgrims.png" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Main locations={locations} id={id}/>
      </div>
    </WagmiConfig>
  );
}

export async function getStaticProps({ params }) {
  const locations = await getAccount(params.id);

  return {
    props: {
      locations,
    },
    revalidate: 1,
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
  }
}
