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

function MobileLayerPanel() {
  const { layers, setLayers } = useContext(AppContext);
  const [legendIsToggled, setLegendIsToggled] = useState(false);

  const updateLayers = (selectedLayer) => {
    // loop over the layers to find the right one
    let updatedLayers = layers.map((layer) => {
      if (layer.title == selectedLayer.title) {
        return { ...layer, active: !layer.active }; //gets everything that was already in the layer, and updates "active"
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
      <div className="layer-panel-content">
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
                  color: layer.active ? "salmon" : "#faebd7",
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
        return { ...layer, active: !layer.active }; //gets everything that was already in the layer, and updates "active"
      }
      return layer; // else return unmodified layer
    });

    setLayers(updatedLayers);
  };

  return (
    <div className={styles.layerPanel}>
      <div className="layer-panel-content">
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
                  color: layer.active ? "salmon" : "#faebd7",
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
