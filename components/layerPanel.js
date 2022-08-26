import React, { useContext } from "react";

import AppContext from "../components/context";
import styles from "../styles/layerPanel.module.css";

export default function LayerPanel() {
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
        <h3>Layers</h3>
        <div className={styles.layerButtons}>
          {layers.map((layer) => (
            <div
              key={layer.title}
              style={{
                color: layer.active ? "salmon" : "white",
              }}
              onClick={() => {
                updateLayers(layer);
              }}
            >
              {layer.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
