import {
  AppBar,
  Grid,
  Modal,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

import AnimateHeight from "react-animate-height";
import StakingDialog from "../components/stakingDialog";
import _ from "lodash";
import { getAccount } from "../lib/userTokensMiddleware";
import styles from "../styles/infoPanel.module.css";
import { useAccount } from "wagmi";

export default function InfoPanel({ infoPanelContent }) {
  const [height, setHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const clickHandler = (_e) => {
    setIsOpen(!isOpen);
    setHeight(height === 0 ? "auto" : 0);
  };

  const tabClickHandler = (_e, selectedTab) => {
    setSelectedTab(selectedTab);
  };

  //rotate animation
  const iconAnimation = useSpring({
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    },
    config: { duration: "120" },
  });

  return (
    <div className={styles.legendContainer}>
      <img className={styles.borderLeft} src={"../images/border-l.png"} />
      <img className={styles.borderRight} src={"../images/border-r.png"} />
      <div onClick={clickHandler} className={styles.legendTitle}>
        <h1>{infoPanelContent.name}</h1>
        <animated.div style={iconAnimation}>
          <img src="../images/icon_arrow_down.png"></img>
        </animated.div>
      </div>
      <AnimateHeight duration={500} height={height}>
        {infoPanelContent.characters ? (
          <TabbedContent
            infoPanelContent={infoPanelContent}
            selectedTab={selectedTab}
            tabClickHandler={tabClickHandler}
          ></TabbedContent>
        ) : (
          <Description infoPanelContent={infoPanelContent}></Description>
        )}
      </AnimateHeight>
    </div>
  );
}

function TabbedContent(props) {
  const { infoPanelContent, selectedTab, tabClickHandler } = props;

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#222" }}>
        <Tabs
          TabIndicatorProps={{
            sx: { backgroundColor: "salmon" },
          }}
          variant="fullWidth"
          value={selectedTab}
          onChange={tabClickHandler}
        >
          <Tab label="Description" />
          <Tab label="Characters" />
          <Tab label="Yours" />
        </Tabs>
      </AppBar>
      <TabPanel selectedTab={selectedTab} index={0}>
        <Description infoPanelContent={infoPanelContent}></Description>
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={1}>
        <Characters infoPanelContent={infoPanelContent}></Characters>
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={2}>
        <YourCharacters infoPanelContent={infoPanelContent}></YourCharacters>
      </TabPanel>
    </div>
  );
}

function TabPanel(props) {
  const { children, selectedTab, index } = props;
  return <div>{selectedTab === index && <div>{children}</div>}</div>;
}

function Description(props) {
  const { infoPanelContent } = props;

  return infoPanelContent.details ? (
    <div
      className={styles.legendContent}
      dangerouslySetInnerHTML={{ __html: infoPanelContent.details }}
    ></div>
  ) : (
    <div className={styles.legendContent}>
      <h1>No Description Available Yet</h1>
    </div>
  );
}

function Characters(props) {
  const { infoPanelContent } = props;

  return infoPanelContent.characters ? (
    <div className={styles.legendContent}>
      <div>
        <h1>Alive</h1>
      </div>
      <div className={styles.flexGrid}>
        {infoPanelContent.characters.alive.length > 0 ? (
          infoPanelContent.characters.alive.map((nft, k) => {
            return <AliveCharacter key={k} nft={nft}></AliveCharacter>;
          })
        ) : (
          <div>
            <p>No Characters Staked at this Location</p>
          </div>
        )}
      </div>
      <div>
        <h1>Burned</h1>
      </div>
      <div className={styles.flexGrid}>
        {infoPanelContent.characters.dead.length > 0 ? (
          infoPanelContent.characters.dead.map((nft, k) => {
            return <BurnedCharacter key={k} nft={nft}></BurnedCharacter>;
          })
        ) : (
          <div>
            <p>No Characters Burned at this Location</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className={styles.legendContent}>
      <h1>No Characters at this Location</h1>
    </div>
  );
}

function AliveCharacter(props) {
  const { nft, key } = props;

  return (
    <Tooltip key={key} title={nft.shortName} placement="top" arrow>
      <div
        className={styles.alive}
        onClick={() => window.open(nft.characterSheetURL, "_blank")}
      >
        <img src={nft.image} />
      </div>
    </Tooltip>
  );
}

function BurnedCharacter(props) {
  const { nft, key } = props;

  return (
    <Tooltip key={key} title={nft.shortName} placement="top" arrow>
      <div
        className={styles.burnedImageContainer}
        onClick={() => window.open(nft.characterSheetURL, "_blank")}
      >
        <img className={styles.burnedImage} src={nft.image} />
        <img className={styles.fireImage} src={"/images/fire.gif"} />
      </div>
    </Tooltip>
  );
}

function YourCharacters(props) {
  const { infoPanelContent } = props;
  const { address, isConnected } = useAccount();
  const [accountData, setAccountData] = React.useState(null);
  const handleOpen = async () => {
    const accountData = await getAccount(address);
    setAccountData(accountData);
  };
  const handleClose = () => setAccountData(null);

  const locationID = infoPanelContent.locationID;

  const myAliveWagdies = _.filter(
    infoPanelContent.characters?.alive,
    (character) => {
      return character.owner.toLowerCase() === address?.toLowerCase();
    }
  );

  const myDeadWagdies = _.filter(
    infoPanelContent.characters?.dead,
    (character) => {
      return character.owner.toLowerCase() === address?.toLowerCase();
    }
  );

  return infoPanelContent.characters ? (
    <div className={styles.legendContent}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs="auto">
          <h1>Alive</h1>
        </Grid>
        <Grid item xs="auto">
          {isConnected ? (
            <div>
              {!infoPanelContent.areNftsLocked ? (
                <div className={styles.stakeButton} onClick={handleOpen}>
                  STAKE CHARACTER
                </div>
              ) : (
                <div className={styles.stakeButtonLocked}>
                  LOCATION IS LOCKED
                </div>
              )}
              {accountData ? (
                <StakingDialog
                  locationID={locationID}
                  accountData={accountData}
                  handleClose={handleClose}
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
      <div className={styles.flexGrid}>
        {myAliveWagdies.length > 0 ? (
          myAliveWagdies.map((nft, k) => {
            return <AliveCharacter key={k} nft={nft}></AliveCharacter>;
          })
        ) : (
          <div>
            <p>You have no characters at this Location</p>
          </div>
        )}
      </div>
      <div>
        <h1>Burned</h1>
      </div>
      <div className={styles.flexGrid}>
        {myDeadWagdies.length > 0 ? (
          myDeadWagdies.map((nft, k) => {
            return <BurnedCharacter key={k} nft={nft}></BurnedCharacter>;
          })
        ) : (
          <div>
            <p>You have no characters burned at this Location</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className={styles.legendContent}>
      <h1>No Characters at this Location</h1>
    </div>
  );
}
