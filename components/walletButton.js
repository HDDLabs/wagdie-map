import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";
import styles from "../styles/walletButton.module.css";

export const WalletButton = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <div
      className={styles.walletButtonContainer}
      onClick={() => (isConnected ? disconnect() : connect())}
    >
      {isConnected ? (
        <img src={"/images/walletbutton/button-disconnect.png"} />
      ) : (
        <img src={"/images/walletbutton/button-connect.png"} />
      )}
    </div>
  );
};
