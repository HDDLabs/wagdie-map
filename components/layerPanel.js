import React, { useContext, useState } from "react";
import { animated, useSpring } from "react-spring";

import AppContext from "../components/context";
import styles from "../styles/layerPanel.module.css";
import { useViewport } from "../components/context";

export const LayerPanel = () => {
  const { width } = useViewport();
  const breakpoint = 600;

  return width < breakpoint ? <MobileLayerPanel /> : <DesktopLayerPanel />;
};

function updateImage(imageString, active) {
  const updatedImageString = !active
    ? imageString.replace("_on", "_off")
    : imageString.replace("_off", "_on");
  return updatedImageString;
}

function MobileLayerPanel() {
  const { layers, setLayers } = useContext(AppContext);
  const [legendIsToggled, setLegendIsToggled] = useState(false);

  const updateLayers = (selectedLayer) => {
    // loop over the layers to find the right one
    let updatedLayers = layers.map((layer) => {
      if (layer.title == selectedLayer.title) {
        const updatedImage = updateImage(layer.image, !layer.active);
        return { ...layer, image: updatedImage, active: !layer.active }; //gets everything that was already in the layer, and updates the rest
      }
      return layer; // else return unmodified layer
    });

    setLayers(updatedLayers);
  };

  //toggle animation
  const legendToggleAnimation = useSpring({
    from: {
      transform: "translateX(91%)",
    },
    to: {
      transform: legendIsToggled ? "translateX(0%)" : "translateX(91%)",
    },
    config: { duration: "500" },
  });

  return (
    <animated.div
      className={styles.mobileLayerPanel}
      style={legendToggleAnimation}
    >
      <div
        onClick={() => {
          setLegendIsToggled(!legendIsToggled);
        }}
        className={styles.mobileLayerToggle}
      >
        Legend
      </div>
      <div className={styles.layerPanelContent}>
        <img
          className={styles.mobileBorderLeft}
          src={"../images/border-l.png"}
        />
        <img className={styles.borderRight} src={"../images/border-r.png"} />
        <img
          className={styles.mobileBorderBottomLeft}
          src={"../images/border-bottom-l.png"}
        />
        <img
          className={styles.borderBottomRight}
          src={"../images/border-bottom-r.png"}
        />
        <h3>Map Legend</h3>
        <div className={styles.layerButtonsContainer}>
          {layers.map((layer) => (
            <div
              className={styles.layerButton}
              key={layer.title}
              onClick={() => {
                updateLayers(layer);
              }}
            >
              <div>
                <img src={layer.image}></img>
              </div>
              <div
                style={{
                  color: "salmon",
                  opacity: layer.active ? 1.0 : 0.6,
                }}
              >
                {layer.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </animated.div>
  );
}

function DesktopLayerPanel() {
  const { layers, setLayers } = useContext(AppContext);

  const updateLayers = (selectedLayer) => {
    // loop over the layers to find the right one
    let updatedLayers = layers.map((layer) => {
      if (layer.title == selectedLayer.title) {
        const updatedImage = updateImage(layer.image, !layer.active);
        return { ...layer, image: updatedImage, active: !layer.active }; //gets everything that was already in the layer, and updates the rest
      }
      return layer; // else return unmodified layer
    });

    setLayers(updatedLayers);
  };

  return (
    <div className={styles.layerPanel}>
      <div className={styles.layerPanelContent}>
        <img className={styles.borderLeft} src={"../images/border-l.png"} />
        <img className={styles.borderRight} src={"../images/border-r.png"} />
        <img
          className={styles.borderBottomLeft}
          src={"../images/border-bottom-l.png"}
        />
        <img
          className={styles.borderBottomRight}
          src={"../images/border-bottom-r.png"}
        />
        <h3>Map Legend</h3>
        <div className={styles.layerButtonsContainer}>
          {layers.map((layer) => (
            <div
              className={styles.layerButton}
              key={layer.title}
              onClick={() => {
                updateLayers(layer);
              }}
            >
              <div>
                <img src={layer.image}></img>
              </div>
              <div
                style={{
                  color: "salmon",
                  opacity: layer.active ? 1.0 : 0.6,
                }}
              >
                {layer.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
