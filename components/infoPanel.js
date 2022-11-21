import {
  AppBar,
  Box,
  Grid,
  Modal,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import AnimateHeight from "react-animate-height";
import Fuse from "fuse.js";
import _ from "lodash";
import { getAccount } from "../lib/userTokensMiddleware";
import locationStakingContractABI from "../utils/abis/wagdieLocationABI.json";
import styles from "../styles/legend.module.css";

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

function WalletCharacter(props) {
  const { nft, key, locationID, wagdieArray, setWagdieArray } = props;
  const [isSelected, setIsSelected] = useState(false);

  const handleAddWagdieClick = () => {
    const tuple = [nft.id, locationID];

    if (!isSelected) {
      setWagdieArray([...wagdieArray, tuple]);
    } else {
      setWagdieArray(removeWagdieByTokenIdFromArray(wagdieArray, tuple));
    }

    setIsSelected(!isSelected);
  };

  return (
    <Tooltip key={key} title={nft.shortName} placement="top" arrow>
      <div className={styles.alive} onClick={() => handleAddWagdieClick()}>
        <img src={nft.image} />
        {isSelected ? (
          <div className={styles.walletCharacterStakedOverlay}>ADDED</div>
        ) : (
          <></>
        )}
      </div>
    </Tooltip>
  );
}

function isItemInArray(array, item) {
  for (var i = 0; i < array.length; i++) {
    // This if statement depends on the format of your array
    if (array[i][0] == item[0] && array[i][1] == item[1]) {
      return true; // Found it
    }
  }
  return false; // Not found
}

function removeWagdieByTokenIdFromArray(array, item) {
  const newArray = array;
  for (var i = 0; i < array.length; i++) {
    // This if statement depends on the format of your array
    if (array[i][0] == item[0]) {
      newArray.splice(i, 1);
      return newArray; // Found it
    }
  }
  return newArray;
}

function YourCharactersModal({ locationID, accountData, handleClose }) {
  // State
  const [wagdiesToStake, setWagdiesToStake] = React.useState([]);
  const [wagdiesToUnstake, setWagdiesToUnstake] = React.useState([]);
  const [wagdiesToMove, setWagdiesToMove] = React.useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  // Styles
  const typographyStyle = {
    fontFamily: "EskapadeFraktur-Black",
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 650,
    width: 652,
    bgcolor: "#353535",
    color: "#faebd7",
    boxShadow: 24,
    fontFamily: "EskapadeFraktur-Black",
    p: 4,
    overflow: "scroll",
  };

  // Handlers

  const handleStakeButtonClick = () => {
    stakeWagdies.write?.();
  };

  const handleUnstakeButtonClick = () => {
    unstakeWagdies.write?.();
  };

  const handleMoveButtonClick = () => {
    changeWagdieLocations.write?.();
  };

  const prepareStakeWagdies = usePrepareContractWrite({
    address: "0x616D4635ceCf94597690Cab0Fc159c3A8231C904",
    abi: locationStakingContractABI,
    functionName: "stakeWagdies",
    args: [wagdiesToStake],
  });

  const stakeWagdies = useContractWrite(prepareStakeWagdies.config);

  const prepareUnstakeWagdies = usePrepareContractWrite({
    address: "0x616D4635ceCf94597690Cab0Fc159c3A8231C904",
    abi: locationStakingContractABI,
    functionName: "unstakeWagdies",
    args: [wagdiesToUnstake],
  });

  const unstakeWagdies = useContractWrite(prepareUnstakeWagdies.config);

  const prepareChangeWagdieLocations = usePrepareContractWrite({
    address: "0x616D4635ceCf94597690Cab0Fc159c3A8231C904",
    abi: locationStakingContractABI,
    functionName: "changeWagdieLocations",
    args: [wagdiesToMove],
  });

  const changeWagdieLocations = useContractWrite(
    prepareChangeWagdieLocations.config
  );

  // Search
  const fuse = new Fuse(accountData?.alive, {
    threshold: 0.1,
    includeScore: true,
    keys: ["name", "id"],
  });

  // Data
  const result = fuse.search(searchQuery).map((s) => s.item.id);
  const aliveWagdies = accountData?.alive;

  // Staked At Location
  const staked = _.filter(aliveWagdies, (wagdie) => {
    return wagdie.location?.id == locationID;
  });

  // Staked At Another Location
  const stakedElsewhere = _.filter(aliveWagdies, (wagdie) => {
    return wagdie.location && wagdie.location?.id != locationID;
  });

  // Unstaked in Wallet
  const unstaked = _.filter(aliveWagdies, (wagdie) => {
    return !wagdie.location;
  });

  return (
    <div>
      <Modal open={!!accountData} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs="auto">
              <Grid container direction="row">
                <Grid item xs="auto">
                  <div className={styles.search}>
                    <input
                      type="text"
                      name="search"
                      placeholder="search"
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="auto">
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item xs="auto">
                  <Typography
                    sx={typographyStyle}
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Stake Characters
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <div
                    className={styles.stakeButton}
                    onClick={handleStakeButtonClick}
                  >
                    STAKE
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="auto">
              <Grid container direction="row" alignItems="center">
                {unstaked?.length > 0 ? (
                  unstaked.map((nft, k) => {
                    if (
                      (searchQuery && _.includes(result, nft.id)) ||
                      !searchQuery
                    ) {
                      return (
                        <Grid item xs="auto">
                          <WalletCharacter
                            key={k}
                            nft={nft}
                            locationID={locationID}
                            wagdieArray={wagdiesToStake}
                            setWagdieArray={setWagdiesToStake}
                          ></WalletCharacter>
                        </Grid>
                      );
                    }
                  })
                ) : (
                  <div>
                    <p>You have no characters to stake at this location</p>
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid item xs="auto">
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item xs="auto">
                  <Typography
                    sx={typographyStyle}
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Unstake Characters
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <div
                    className={styles.stakeButton}
                    onClick={handleUnstakeButtonClick}
                  >
                    UNSTAKE
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="auto">
              <Grid container direction="row" alignItems="center">
                {staked?.length > 0 ? (
                  staked.map((nft, k) => {
                    if (
                      (searchQuery && _.includes(result, nft.id)) ||
                      !searchQuery
                    ) {
                      return (
                        <Grid item xs="auto">
                          <WalletCharacter
                            key={k}
                            nft={nft}
                            locationID={locationID}
                            wagdieArray={wagdiesToUnstake}
                            setWagdieArray={setWagdiesToUnstake}
                          ></WalletCharacter>
                        </Grid>
                      );
                    }
                  })
                ) : (
                  <div>
                    <p>You have no characters to unstake at this location</p>
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid item xs="auto">
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Grid item xs="auto">
                  <Typography
                    sx={typographyStyle}
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Move Characters
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <div
                    className={styles.stakeButton}
                    onClick={handleMoveButtonClick}
                  >
                    MOVE
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs="auto">
              <Grid container direction="row" alignItems="center">
                {stakedElsewhere?.length > 0 ? (
                  stakedElsewhere.map((nft, k) => {
                    if (
                      (searchQuery && _.includes(result, nft.id)) ||
                      !searchQuery
                    ) {
                      return (
                        <Grid item xs="auto">
                          <WalletCharacter
                            key={k}
                            nft={nft}
                            locationID={locationID}
                            wagdieArray={wagdiesToMove}
                            setWagdieArray={setWagdiesToMove}
                          ></WalletCharacter>
                        </Grid>
                      );
                    }
                  })
                ) : (
                  <div>
                    <p>You have no characters to move to this location</p>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
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
                <YourCharactersModal
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
