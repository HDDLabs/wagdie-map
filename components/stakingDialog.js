import { AppBar, Grid, Modal, Tab, Tabs, Tooltip } from "@mui/material";
import React, { useState } from "react";

import Fuse from "fuse.js";
import LoadingOverlay from "@ronchalant/react-loading-overlay";
import locationStakingContractABI from "../utils/abis/wagdieLocationABI.json";
import styles from "../styles/infoPanel.module.css";
import { toast } from "react-toastify";
import { useWriteToContract } from "../lib/interactWithContract";

export default function StakingDialog({
  locationID,
  accountData,
  handleClose,
}) {
  // State
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [wagdiesToStake, setWagdiesToStake] = React.useState([]);
  const [wagdiesToUnstake, setWagdiesToUnstake] = React.useState([]);
  const [wagdiesToMove, setWagdiesToMove] = React.useState([]);

  // Contract Hooks

  const { write: stakeWagdies } = useWriteToContract(
    "0x616D4635ceCf94597690Cab0Fc159c3A8231C904",
    locationStakingContractABI,
    "stakeWagdies",
    [wagdiesToStake],
    { onSuccess: handleSuccess, onError: handleError }
  );

  const { write: unstakeWagdies } = useWriteToContract(
    "0x616D4635ceCf94597690Cab0Fc159c3A8231C904",
    locationStakingContractABI,
    "unstakeWagdies",
    [wagdiesToUnstake],
    { onSuccess: handleSuccess, onError: handleError }
  );

  const { write: changeWagdieLocations } = useWriteToContract(
    "0x616D4635ceCf94597690Cab0Fc159c3A8231C904",
    locationStakingContractABI,
    "changeWagdieLocations",
    [wagdiesToMove],
    { onSuccess: handleSuccess, onError: handleError }
  );

  // Handlers

  // Tab Click
  const tabClickHandler = (_e, selectedTab) => {
    setSelectedTab(selectedTab);
  };

  // Success
  async function handleSuccess(tx) {
    const _ = await tx.wait(1);
    toast.success("Your travel through the Forsaken Lands was successful!");
    setIsLoading(false);
    handleClose();
  }

  // Error
  function handleError(err) {
    if (err.code === "ACTION_REJECTED") {
      toast.error("Transaction rejected.");
    } else {
      toast.error("Error encountered");
      console.log(err);
    }
    setIsLoading(false);
  }

  // Stake
  const handleStakeButtonClick = () => {
    toast.info("Sign the transaction in your wallet…");
    setIsLoading(true);
    stakeWagdies();
  };

  // Unstake
  const handleUnstakeButtonClick = () => {
    toast.info("Sign the transaction in your wallet…");
    setIsLoading(true);
    unstakeWagdies();
  };

  // Move
  const handleMoveButtonClick = () => {
    toast.info("Sign the transaction in your wallet…");
    setIsLoading(true);
    changeWagdieLocations();
  };

  // ViewModel Data
  const ActionButtons = {
    0: (
      <ActionButton
        imageURL={"../images/stakingdialog/bt-stake.png"}
        wagdies={wagdiesToStake}
        clickHandler={handleStakeButtonClick}
        selectedTab={selectedTab}
      ></ActionButton>
    ),
    1: (
      <ActionButton
        imageURL={"../images/stakingdialog/bt-unstake.png"}
        wagdies={wagdiesToUnstake}
        clickHandler={handleUnstakeButtonClick}
        selectedTab={selectedTab}
      ></ActionButton>
    ),
    2: (
      <ActionButton
        imageURL={"../images/stakingdialog/bt-move.png"}
        wagdies={wagdiesToMove}
        clickHandler={handleMoveButtonClick}
        selectedTab={selectedTab}
      ></ActionButton>
    ),
  };

  const hasEligibleWagdies = accountData.alive;

  // Search
  const fuse = new Fuse(accountData?.alive, {
    threshold: 0.1,
    includeScore: true,
    keys: ["name", "id"],
  });

  const result = hasEligibleWagdies
    ? fuse?.search(searchQuery)?.map((s) => s.item.id)
    : undefined;

  return (
    <Modal open={!!accountData} onClose={isLoading ? undefined : handleClose}>
      {hasEligibleWagdies ? (
        <div className={styles.modalContainer}>
          <LoadingOverlay
            active={isLoading}
            spinner={isLoading}
            styles={{
              overlay: (base) => ({
                ...base,
                background: "#353535",
                opacity: 0.8,
              }),
            }}
            text="Your characters are traveling the Forsaken Lands..."
          >
            <div className={styles.placeholderContent}>
              <section className={styles.stickyContent}>
                <img
                  className={styles.borderLeft}
                  src={"../images/border-l.png"}
                />
                <img
                  className={styles.borderRight}
                  src={"../images/border-r.png"}
                />
                <div className={styles.modalTitle}>
                  <h1>Enter The Forsaken Lands</h1>
                  {ActionButtons[selectedTab]}
                </div>
                <div className={styles.searchContainer}>
                  <div className={styles.search}>
                    <input
                      type="text"
                      name="search"
                      placeholder=""
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <AppBar position="static" sx={{ backgroundColor: "#222" }}>
                  <Tabs
                    TabIndicatorProps={{
                      sx: { backgroundColor: "salmon" },
                    }}
                    variant="fullWidth"
                    value={selectedTab}
                    onChange={tabClickHandler}
                  >
                    <Tab label="STAKE" />
                    <Tab label="UNSTAKE" />
                    <Tab label="MOVE" />
                  </Tabs>
                </AppBar>
              </section>
              <TabbedContent
                selectedTab={selectedTab}
                tabClickHandler={tabClickHandler}
                accountData={accountData}
                searchQuery={searchQuery}
                result={result}
                locationID={locationID}
                wagdiesToStake={wagdiesToStake}
                setWagdiesToStake={setWagdiesToStake}
                wagdiesToUnstake={wagdiesToUnstake}
                setWagdiesToUnstake={setWagdiesToUnstake}
                wagdiesToMove={wagdiesToMove}
                setWagdiesToMove={setWagdiesToMove}
              ></TabbedContent>
            </div>
          </LoadingOverlay>
        </div>
      ) : (
        <div className={styles.noWagdiesModalContainer}>
          There were no WAGDIEs found in your wallet
        </div>
      )}
    </Modal>
  );
}

function TabPanel(props) {
  const { children, selectedTab, index } = props;
  return <div>{selectedTab === index && <div>{children}</div>}</div>;
}

function TabbedContent(props) {
  const {
    selectedTab,
    accountData,
    searchQuery,
    result,
    locationID,
    wagdiesToStake,
    setWagdiesToStake,
    wagdiesToUnstake,
    setWagdiesToUnstake,
    wagdiesToMove,
    setWagdiesToMove,
  } = props;

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
    return !wagdie.location && !wagdie.isBurned;
  });

  return (
    <div>
      <TabPanel selectedTab={selectedTab} index={0}>
        <Content
          wagdieDisplayArray={unstaked}
          selectedWagdieArray={wagdiesToStake}
          setSelectedWagdieArray={setWagdiesToStake}
          searchQuery={searchQuery}
          result={result}
          locationID={locationID}
          noWagdiesText="You have no characters to stake at this location"
        ></Content>
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={1}>
        <Content
          wagdieDisplayArray={staked}
          selectedWagdieArray={wagdiesToUnstake}
          setSelectedWagdieArray={setWagdiesToUnstake}
          searchQuery={searchQuery}
          result={result}
          locationID={locationID}
          noWagdiesText="You have no characters to unstake at this location"
        ></Content>
      </TabPanel>
      <TabPanel selectedTab={selectedTab} index={2}>
        <Content
          wagdieDisplayArray={stakedElsewhere}
          selectedWagdieArray={wagdiesToMove}
          setSelectedWagdieArray={setWagdiesToMove}
          searchQuery={searchQuery}
          result={result}
          locationID={locationID}
          noWagdiesText="You have no characters to move to this location"
        ></Content>
      </TabPanel>
    </div>
  );
}

function ActionButton(props) {
  const { imageURL, wagdies, clickHandler } = props;

  return (
    <div className={styles.actionButtonContainer}>
      <img
        className={
          wagdies.length > 0 ? styles.actionButton : styles.actionButtonDisabled
        }
        onClick={clickHandler}
        src={imageURL}
      ></img>
      {"(" + wagdies.length + ")"}
    </div>
  );
}

function Content(props) {
  const {
    wagdieDisplayArray,
    selectedWagdieArray,
    setSelectedWagdieArray,
    searchQuery,
    result,
    locationID,
    noWagdiesText,
  } = props;

  return (
    <div className={styles.contentContainer}>
      <Grid container direction="row" alignItems="center" spacing={1}>
        {wagdieDisplayArray?.length > 0 ? (
          wagdieDisplayArray.map((nft, k) => {
            if ((searchQuery && _.includes(result, nft.id)) || !searchQuery) {
              return (
                <Grid item lg="2" key={k}>
                  <WalletCharacter
                    key={k}
                    nft={nft}
                    locationID={locationID}
                    selectedWagdieArray={selectedWagdieArray}
                    setSelectedWagdieArray={setSelectedWagdieArray}
                  ></WalletCharacter>
                </Grid>
              );
            }
          })
        ) : (
          <div>
            <p>{noWagdiesText}</p>
          </div>
        )}
      </Grid>
    </div>
  );
}

function WalletCharacter(props) {
  const { nft, key, locationID, selectedWagdieArray, setSelectedWagdieArray } =
    props;
  const [isSelected, setIsSelected] = useState(
    findInFirstIndex(selectedWagdieArray, nft.id)
  );

  const handleAddWagdieClick = () => {
    const tuple = [nft.id, locationID];

    if (!isSelected) {
      setSelectedWagdieArray([...selectedWagdieArray, tuple]);
    } else {
      setSelectedWagdieArray(
        removeWagdieByTokenIdFromArray(selectedWagdieArray, tuple)
      );
    }

    setIsSelected(!isSelected);
  };

  return (
    <Tooltip key={key} title={nft.shortName} placement="top" arrow>
      <div className={styles.alive} onClick={() => handleAddWagdieClick()}>
        <img
          className={styles.characterFrame}
          src={"../images/stakingdialog/pfp-frame.png"}
        />
        <img src={nft.image} />
        {isSelected ? (
          <img
            className={styles.walletCharacterStakedOverlay}
            src={"../images/stakingdialog/flag-added.png"}
          />
        ) : (
          <></>
        )}
      </div>
    </Tooltip>
  );
}

function removeWagdieByTokenIdFromArray(array, item) {
  const newArr = [...array];
  for (var i = 0; i < array.length; i++) {
    // This if statement depends on the format of your array
    if (array[i][0] == item[0]) {
      newArr.splice(i, 1);
      return newArr; // Found it
    }
  }
  return newArr;
}

function findInFirstIndex(array, num) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][0] === num) {
      return true;
    }
  }
  return false;
}
