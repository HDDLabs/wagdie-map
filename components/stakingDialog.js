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

  // Styles
  const typographyStyle = {
    fontFamily: "EskapadeFraktur-Black",
    p: 2,
  };

  const containerBoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 650,
    width: 652,
    bgcolor: "#222",
    color: "#faebd7",
    boxShadow: 24,
    fontFamily: "EskapadeFraktur-Black",
  };

  const scrollingBoxStyle = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 650,
    width: 652,
    bgcolor: "#353535",
    color: "#faebd7",
    boxShadow: 24,
    fontFamily: "EskapadeFraktur-Black",
    overflow: "scroll",
  };

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

  const handleStakeButtonClick = () => {
    toast.info("Sign the transaction in your wallet…");
    setIsLoading(true);
    stakeWagdies();
  };

  const handleUnstakeButtonClick = () => {
    toast.info("Sign the transaction in your wallet…");
    setIsLoading(true);
    unstakeWagdies();
  };

  const handleMoveButtonClick = () => {
    toast.info("Sign the transaction in your wallet…");
    setIsLoading(true);
    changeWagdieLocations();
  };

  async function handleSuccess(tx) {
    const _ = await tx.wait(1);
    toast.success("Your travel through the Forsaken Lands was successful!");
    setIsLoading(false);
    handleClose();
  }

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
                Search
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
            </div>
            <div className={styles.scrollingContentContainer}>
              <div className={styles.placeholderContent}>
                <section className={styles.stickyContent}>
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
                        variant="h6"
                        component="h2"
                      >
                        Stake Characters
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <div
                        className={
                          wagdiesToStake.length > 0
                            ? styles.stakeButton
                            : styles.stakeButtonDisabled
                        }
                        onClick={handleStakeButtonClick}
                      >
                        STAKE
                      </div>
                    </Grid>
                  </Grid>
                </section>
                <Grid container direction="row" alignItems="center">
                  {unstaked?.length > 0 ? (
                    unstaked.map((nft, k) => {
                      if (
                        (searchQuery && _.includes(result, nft.id)) ||
                        !searchQuery
                      ) {
                        return (
                          <Grid item xs="auto" key={k}>
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
              </div>
              <div className={styles.placeholderContent}>
                <section className={styles.stickyContent}>
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
                        variant="h6"
                        component="h2"
                      >
                        Unstake Characters
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <div
                        className={
                          wagdiesToUnstake.length > 0
                            ? styles.stakeButton
                            : styles.stakeButtonDisabled
                        }
                        onClick={handleUnstakeButtonClick}
                      >
                        UNSTAKE
                      </div>
                    </Grid>
                  </Grid>
                </section>
                <Grid container direction="row" alignItems="center">
                  {staked?.length > 0 ? (
                    staked.map((nft, k) => {
                      if (
                        (searchQuery && _.includes(result, nft.id)) ||
                        !searchQuery
                      ) {
                        return (
                          <Grid item xs="auto" key={k}>
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
              </div>
              <div className={styles.placeholderContent}>
                <section className={styles.stickyContent}>
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
                        variant="h6"
                        component="h2"
                      >
                        Move Characters
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <div
                        className={
                          wagdiesToMove.length > 0
                            ? styles.stakeButton
                            : styles.stakeButtonDisabled
                        }
                        onClick={handleMoveButtonClick}
                      >
                        MOVE
                      </div>
                    </Grid>
                  </Grid>
                </section>
                <Grid container direction="row" alignItems="center">
                  {stakedElsewhere?.length > 0 ? (
                    stakedElsewhere.map((nft, k) => {
                      if (
                        (searchQuery && _.includes(result, nft.id)) ||
                        !searchQuery
                      ) {
                        return (
                          <Grid item xs="auto" key={k}>
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
