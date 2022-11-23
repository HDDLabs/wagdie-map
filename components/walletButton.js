import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

import { InjectedConnector } from "wagmi/connectors/injected";
import styles from "../styles/walletButton.module.css";

export const WalletButton = () => {
  const [_isConnected, _setIsConnected] = useState(false);
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    _setIsConnected(isConnected);
  }, [isConnected]);

  return (
    <div
      className={styles.walletButtonContainer}
      onClick={() => (_isConnected ? disconnect() : connect())}
    >
      {_isConnected ? (
        <img src={"/images/walletbutton/button-disconnect.png"} />
      ) : (
        <img src={"/images/walletbutton/button-connect.png"} />
      )}
    </div>
  );
};
