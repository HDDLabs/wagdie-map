import React, { Component, useEffect, useMapEvents, useState } from "react";
import styles from '../styles/layerPanel.module.css'

export default function LayerPanel() {
    const [selectedLayer, setSelectedLayer] = useState({
        title: "locations",
        active: true
    });

    const [layers, setLayers] = useState([
        {
            title: "locations",
            active: true
        },
        {
            title: "burns",
            active: false
        },
        {
            title: "deaths",
            active: false
        },
    ]);

    const updateLayers = (selectedLayer) => {
        // loop over the layers to find the right one
        let updatedLayers = layers.map(layer => {
            if (layer.title == selectedLayer.title) {
                return { ...layer, active: !layer.active }; //gets everything that was already in layer, and updates "active"
            }
            return layer; // else return unmodified layer 
        });

        console.log(updatedLayers)

        setLayers(updatedLayers)
    }

    return (
        <div className={styles.layerPanel}>
            <div className="layer-panel-content">
                <h3>Layers</h3>
                <div className={styles.layerButtons}>
                    {layers.map((layer) => (
                        <div
                            key={layer.title}
                            style={{
                                color: layer.active ? 'salmon' : 'white',
                            }}
                            onClick={() => {
                                setSelectedLayer(layer)
                                updateLayers(layer)
                            }}
                        >
                            {layer.title}
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}