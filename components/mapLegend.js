import React, { Component, useEffect, useMapEvents, useState } from "react";
import styles from '../styles/Home.module.css'
import AnimateHeight from 'react-animate-height';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSpring, animated } from "react-spring";

export default function MapLegend({ location }) {
    const [height, setHeight] = useState(0);
    const [open, setOpen] = useState(false);

    const clickHandler = (e) => {
        setOpen(!open)
        setHeight(height === 0 ? 'auto' : 0)
    }

    //rotate animation
    const iconAnimation = useSpring({
        from: {
            transform: "rotate(0deg)",
            color: "#faebd7"
        },
        to: {
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: open ? "#faebd7" : "#faebd7"
        },
        config: { duration: "120" }
    });

    return (
        <div className={styles.legendContainer}>
            <div
                onClick={clickHandler}
                className={styles.legendTitle}
            >
                <h1>{location.title}</h1>
                <animated.div style={iconAnimation}>
                    <ExpandMoreIcon />
                </animated.div>
            </div>
            <AnimateHeight
                duration={500}
                height={height}
            >
                <div
                    className={styles.legendContent}
                    dangerouslySetInnerHTML={{ __html: location.details }}
                ></div>
            </AnimateHeight>
        </div>
    )
}