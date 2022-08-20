import React, { Component, useEffect, useMapEvents, useState } from "react";
import styles from '../styles/Home.module.css'
import AnimateHeight from 'react-animate-height';

export default function MapLegend({ location }) {
    const [height, setHeight] = useState(0);

    return (
        <div className={styles.legendContainer}>
            <div onClick={() => setHeight(height === 0 ? 'auto' : 0)} className={styles.legendTitle}>
                <h1>{location.title}</h1>
            </div>
            <AnimateHeight
                duration={500}
                height={height}
            >
                <div className={styles.legendContent} dangerouslySetInnerHTML={{__html: location.details}}>
                    
                </div>
            </AnimateHeight>
        </div >
    )
}