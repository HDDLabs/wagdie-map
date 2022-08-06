import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { animated, useSpring } from "react-spring";
import styles from "../styles/legend.module.css";

export default function MapLegend({ location }) {
  const [height, setHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = (e) => {
    setIsOpen(!isOpen);
    setHeight(height === 0 ? "auto" : 0);
  };

  //rotate animation
  const iconAnimation = useSpring({
    from: {
      transform: "rotate(0deg)",
      color: "#faebd7",
    },
    to: {
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      color: isOpen ? "#faebd7" : "#faebd7",
    },
    config: { duration: "120" },
  });

  return (
    <div className={styles.legendContainer}>
      <div onClick={clickHandler} className={styles.legendTitle}>
        <h1>{location.title}</h1>
        <animated.div style={iconAnimation}>
          <ExpandMoreIcon />
        </animated.div>
      </div>
      <AnimateHeight duration={500} height={height}>
        <div
          className={styles.legendContent}
          dangerouslySetInnerHTML={{ __html: location.details }}
        ></div>
      </AnimateHeight>
    </div>
  );
}
