import { Grid, Modal, Tooltip, Typography } from "@mui/material";
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
  const [wagdiesToStake, setWagdiesToStake] = React.useState([]);
  const [wagdiesToUnstake, setWagdiesToUnstake] = React.useState([]);
  const [wagdiesToMove, setWagdiesToMove] = React.useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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

  // ViewModel Data
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
            <div className={styles.searchContainer}>
              <div className={styles.search}>
                <input
                  type="text"
                  name="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className={styles.scrollingContentContainer}>
              <div className={styles.placeholderContent}>
                <section className={styles.stickyContent}>
                  <Header
                    wagdiesArray={wagdiesToStake}
                    handleButtonClick={handleStakeButtonClick}
                    headerTitle="Stake Characters"
                    buttonTitle="STAKE"
                  ></Header>
                </section>
                <Content
                  wagdieDisplayArray={unstaked}
                  selectedWagdieArray={wagdiesToStake}
                  setSelectedWagdieArray={setWagdiesToStake}
                  searchQuery={searchQuery}
                  result={result}
                  locationID={locationID}
                  noWagdiesText="You have no characters to stake at this location"
                ></Content>
              </div>
              <div className={styles.placeholderContent}>
                <section className={styles.stickyContent}>
                  <Header
                    wagdiesArray={wagdiesToUnstake}
                    handleButtonClick={handleUnstakeButtonClick}
                    headerTitle="Unstake Characters"
                    buttonTitle="UNSTAKE"
                  ></Header>
                </section>
                <Content
                  wagdieDisplayArray={staked}
                  selectedWagdieArray={wagdiesToUnstake}
                  setSelectedWagdieArray={setWagdiesToUnstake}
                  searchQuery={searchQuery}
                  result={result}
                  locationID={locationID}
                  noWagdiesText="You have no characters to unstake at this location"
                ></Content>
              </div>
              <div className={styles.placeholderContent}>
                <section className={styles.stickyContent}>
                  <Header
                    wagdiesArray={wagdiesToMove}
                    handleButtonClick={handleMoveButtonClick}
                    headerTitle="Move Characters"
                    buttonTitle="MOVE"
                  ></Header>
                </section>
                <Content
                  wagdieDisplayArray={stakedElsewhere}
                  selectedWagdieArray={wagdiesToMove}
                  setSelectedWagdieArray={setWagdiesToMove}
                  searchQuery={searchQuery}
                  result={result}
                  locationID={locationID}
                  noWagdiesText="You have no characters to move to this location"
                ></Content>
              </div>
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

function Header(props) {
  const { wagdiesArray, handleButtonClick, headerTitle, buttonTitle } = props;

  const typographyStyle = {
    fontFamily: "EskapadeFraktur-Black",
    p: 2,
  };

  return (
    <div className={styles.headerContainer}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs="auto">
          <Typography
            sx={typographyStyle}
            id="modal-modal-title"
            variant="h4"
            component="h2"
          >
            {headerTitle}
          </Typography>
        </Grid>
        <Grid item xs="auto">
          <div
            className={
              wagdiesArray.length > 0
                ? styles.stakeButton
                : styles.stakeButtonDisabled
            }
            onClick={handleButtonClick}
          >
            {buttonTitle}
          </div>
        </Grid>
      </Grid>
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
  const [isSelected, setIsSelected] = useState(false);

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
