import ReactTooltip from 'react-tooltip';
import { useState } from "react";
import _ from "lodash";
// import ENSAddress from '@ensdomains/react-ens-address';

import {
  WagmiConfig,
  createClient,
  configureChains,
  defaultChains,
  useAccount,
  useConnect,
  useEnsName,
  useEnsAvatar,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

import {
  getLocations
} from "../lib/fate";

import Head from "next/head";
import styles from "../styles/Home.module.css";

const { chains, provider, webSocketProvider } = configureChains(
  defaultChains,
  [publicProvider()],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const OwnerName = ({ address, count }) => {
  const { data: ensName } = useEnsName({ address });
  // const { data, isError, isLoading } = useEnsAvatar({
  //   addressOrName: address,
  // });

  return (
    <h4 className={styles.h4}>
      {ensName || address} ({count})
    </h4>
  );
};

const Main = ({ locations }) => {
  const [filterOwner, setFilterOwner] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <main className={styles.pilgrimMain}>
      <div className={styles.pilgrimHeader}>
        <img className={styles.pilgrimLogo} src="/images/wagdie.png" />
        <div
          className={filterOwner ? styles.byOwnerOn : styles.byOwner}
          onClick={() => setFilterOwner(!filterOwner)}>
            By Owner
        </div>
      </div>
      {locations.map((location, i) => {
        const owned = _.orderBy(location.owners.map((owner, o) => {
          const nfts = [...location.known.filter(nft => nft.owner === owner), ...location.unknown.filter(nft => nft.owner === owner)];
          return {
            owner,
            nfts,
            total: nfts.length,
          }
        }), ['total'], ['desc']);

        return (
          <div key={i} className={styles.pilgrimLocation}>
            <div className={styles.locationTitles}>
              <h1>
                {location.name}
              </h1>
              <h3 className={styles.h3}>
                Staked ({location.known.length + location.unknown.length})
              </h3>
              <h3 className={styles.h3}>
                Characters ({location.known.length})
              </h3>
              <h3 className={styles.h3}>
                Owners ({location.owners.length})
              </h3>
            </div>
            {filterOwner ? (
              <>
                {owned.map((owner, o) => {
                  return (
                    <div key={o} className={styles.flexGridOwners}>
                      <OwnerName address={owner.owner} count={owner.nfts.length} />
                      <div className={styles.flexGrid}>
                        {owner.nfts.map((nft, k) => {
                          return (
                            <div
                              data-tip={nft.name}
                              key={k}
                              className={styles.naked}
                              style={{
                                opacity: nft.hasName ? 1 : 0.6,
                              }}
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
                <ReactTooltip
                  backgroundColor='white'
                  textColor='black'
                />
              </>
            ) : (
              <>
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
                <ReactTooltip
                  backgroundColor='white'
                  textColor='black'
                />
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
