import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useContext } from "react";

import AppContext from "../components/context";
import Slider from "react-slick";
import styles from "../styles/timeline.module.css";

export default function TimelineSlider() {
  const { setSelectedLocation } = useContext(AppContext);
  const chapters = [
    "Dawn of the 18th Cycle",
    "Stalwart Knowledge",
    "Chaos and Unity",
    "Finding Direction",
    "Reality's Bend",
    "Blood and Revelry",
  ];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={styles.timelineContainer}>
      <Slider {...settings}>
        {chapters.map((chapter) => (
          <div className={styles.slide}>
            <h1>{chapter}</h1>
          </div>
        ))}
      </Slider>
    </div>
  );
}
