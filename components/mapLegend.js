import { AppBar, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

import AnimateHeight from "react-animate-height";
import Tooltip from "@mui/material/Tooltip";
import styles from "../styles/legend.module.css";

export default function MapLegend({ location }) {
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
        <h1>{location.name}</h1>
        <animated.div style={iconAnimation}>
          <img src="../images/icon_arrow_down.png"></img>
        </animated.div>
      </div>
      <AnimateHeight duration={500} height={height}>
        {location.characters ? (
          <TabbedContent
            location={location}
            selectedTab={selectedTab}
            tabClickHandler={tabClickHandler}
          ></TabbedContent>
        ) : (
          <Description location={location}></Description>
        )}
      </AnimateHeight>
    </div>
  );
}

function TabbedContent(props) {
  const { location, selectedTab, tabClickHandler } = props;

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
        <Description location={location}></Description>
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={1}>
        <Characters location={location}></Characters>
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={2}>
        <YourCharacters></YourCharacters>
      </TabPanel>
    </div>
  );
}

function TabPanel(props) {
  const { children, selectedTab, index } = props;
  return <div>{selectedTab === index && <div>{children}</div>}</div>;
}

function Description(props) {
  const { location } = props;

  return location.details ? (
    <div
      className={styles.legendContent}
      dangerouslySetInnerHTML={{ __html: location.details }}
    ></div>
  ) : (
    <div className={styles.legendContent}>
      <h1>No Description Available Yet</h1>
    </div>
  );
}

function Characters(props) {
  const { location } = props;

  return location.characters ? (
    <div className={styles.legendContent}>
      <div>
        <h1>Alive</h1>
      </div>
      <div className={styles.flexGrid}>
        {location.characters.alive.length > 0 ? (
          location.characters.alive.map((nft, k) => {
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
        {location.characters.dead.length > 0 ? (
          location.characters.dead.map((nft, k) => {
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

function YourCharacters() {
  return (
    <div className={styles.legendContent}>
      <h1>Coming Soon</h1>
    </div>
  );
}
