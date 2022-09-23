import { useState } from "react";
import _ from "lodash";
import Fuse from 'fuse.js';
import Tooltip from '@mui/material/Tooltip';

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
  getLocations
} from "../lib/fate";

import Head from "next/head";
import styles from "../styles/Home.module.css";

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

const Main = ({ locations }) => {
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

  const fuse = new Fuse(allNFTs, {
    threshold: 0.1,
    includeScore: true,
    keys: ['name']
  });

  const result = (fuse.search(search)).map((s) => s.item.id);

  return (
    <main className={styles.pilgrimMain}>
      <div className={styles.pilgrimHeader}>
        <a href="/">
          <img className={styles.pilgrimLogo} src="/images/wagdie.png" />
        </a>
        <div
          className={filter === 1 ? styles.byOwnerOn : styles.byOwner}
          onClick={() => filter === 1 ? setFilter(0) : setFilter(1)}>
            By Owner
        </div>
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

        {isConnected && false && (
          <div
            className={filter === 2 ? styles.byOwnerOn : styles.byOwner}
            onClick={() => filter === 2 ? setFilter(0) : setFilter(2)}>
              Mine
          </div>
        )}
      </div>
      {locations.map((location, i) => {
        const owned = _.orderBy(location.owners.map((owner, o) => {
          const nfts = [
            ...location.known.filter(nft => nft.owner === owner && ((search && _.includes(result, nft.id) || !search))),
            ...location.unknown.filter(nft => nft.owner === owner && ((search && _.includes(result, nft.id) || !search))),
            ...location.burned.filter(nft => nft.owner === owner && ((search && _.includes(result, nft.id) || !search)))
          ];
          return {
            owner,
            nfts,
            total: nfts.length,
            burned: nfts.filter(n => n.isBurned).length,
          }
        }), ['total'], ['desc']);

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
              <div>
                <h3 className={styles.h3}>
                  Owners ({location.owners.length})
                </h3>
              </div>

            </div>
            {filter === 1 ? (
              <>
                {owned.map((owner, o) => {
                  if (owner.nfts.length) {
                    return (
                      <div key={o} className={styles.flexGridOwners}>
                        <OwnerName address={owner.owner} count={owner.total} burned={owner.burned} />
                        <div className={styles.flexGrid}>
                          {owner.nfts.map((nft, k) => {
                            if (nft.isBurned) {
                              return (
                                <Tooltip key={k} title={nft.name} placement="top" arrow>
                                  <div
                                    className={styles.burnedSmall}
                                    style={{
                                      opacity: nft.hasName ? 1 : 0.6,
                                    }}
                                    onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                                  >
                                    <img className={styles.imageSmall} src={nft.image} />
                                    <img className={styles.fireSmall} src={'/images/fire.gif'} />
                                  </div>
                                </Tooltip>
                              )
                            }
  
                            return (
                              <Tooltip key={k} title={nft.name} placement="top" arrow>
                                <div
                                  className={styles.naked}
                                  style={{
                                    opacity: nft.hasName ? 1 : 0.6,
                                  }}
                                  onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                                >
                                  <img src={nft.image} />
                                </div>
                              </Tooltip>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }
                })}
              </>
            ) : (
              <>
                <div className={styles.flexGrid}>
                  {location.known.map((nft, k) => {
                    if ((search && _.includes(result, nft.id)) || !search) {
                      return (
                        <Tooltip key={k} title={nft.name} placement="top" arrow>
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
                        <Tooltip key={k} title={nft.name} placement="top" arrow>
                          <div
                            className={styles.naked}
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
                        <Tooltip key={k} title={nft.name} placement="top" arrow>
                          <div
                            className={styles.burned}
                            onClick={()=> window.open(`https://fateofwagdie.com/characters/${nft.id}`, "_blank")}
                          >
                            <img className={styles.image} src={nft.image} />
                            <img className={styles.fire} src={'/images/fire.gif'} />
                          </div>
                        </Tooltip>
                      ) 
                    }
                  })}
                </div>
              </>
            )}
          </div>
        )
      })}
      <div className={styles.pilgrimFooter}/>
    </main>
  );
};

export default function Home({ locations }) {
  return (
    <WagmiConfig client={client}>
      <div className={styles.container}>
        <Head>
          <title>Pilgrims of WAGDIE</title>
          <meta name="description" content="Pilgrims of the World of WAGDIE." />
          <meta property="og:image" content="/images/pilgrims.png" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Main locations={locations} />
      </div>
    </WagmiConfig>
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
