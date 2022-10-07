import React, { useState } from "react";
import { animated, useSpring } from "react-spring";

import AnimateHeight from "react-animate-height";
import styles from "../styles/legend.module.css";

export default function MapLegend({ location }) {
  const [height, setHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = (_e) => {
    setIsOpen(!isOpen);
    setHeight(height === 0 ? "auto" : 0);
  };

  //rotate animation
  const iconAnimation = useSpring({
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    },
    config: { duration: "120" },
  });

  return (
    <div className={styles.legendContainer}>
      <img className={styles.borderLeft} src={"../images/border-l.png"} />
      <img className={styles.borderRight} src={"../images/border-r.png"} />
      <div onClick={clickHandler} className={styles.legendTitle}>
        <h1>{location.name}</h1>
        <animated.div style={iconAnimation}>
          <img src="../images/icon_arrow_down.png"></img>
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
