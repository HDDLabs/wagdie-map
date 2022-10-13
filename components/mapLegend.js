import { AppBar, Tab, Tabs, styled } from "@mui/material";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

import AnimateHeight from "react-animate-height";
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
    console.log(selectedTab);
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

  // const StyledTab = styled(Tab)(({ theme }) => ({
  //   color: "salmon",
  //   fontFamily: ["EskapadeFraktur-Black"].join(","),
  //   "&.Mui-selected": {
  //     color: "salmon",
  //   },
  // }));

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
            <Tab label="Staked" />
            <Tab label="Yours" />
          </Tabs>
        </AppBar>
        <TabPanel selectedTab={selectedTab} index={0}>
          <div
            className={styles.legendContent}
            dangerouslySetInnerHTML={{ __html: location.details }}
          ></div>
        </TabPanel>
        <TabPanel selectedTab={selectedTab} index={1}>
          <div className={styles.legendContent}>
            <h1>Coming Soon</h1>
          </div>
        </TabPanel>
        <TabPanel selectedTab={selectedTab} index={2}>
          <div className={styles.legendContent}>
            <h1>Coming Soon</h1>
          </div>{" "}
        </TabPanel>
      </AnimateHeight>
    </div>
  );
}

function TabPanel(props) {
  const { children, selectedTab, index } = props;
  return <div>{selectedTab === index && <div>{children}</div>}</div>;
}
