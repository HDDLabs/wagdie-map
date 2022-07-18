import React, { Component, useEffect, useMapEvents, useState } from "react";
import styles from '../styles/Home.module.css'
import AnimateHeight from 'react-animate-height';

export default function MapLegend({ title }) {
    const [height, setHeight] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const toggleIsLoading = () => {
        setIsLoading(current => !current);
    };

    return (
        <div className={styles.legendContainer}>
            <div onClick={() => setHeight(height === 0 ? 'auto' : 0)} className={styles.legendTitle}>
                <h1>We Are All Going To Die</h1>
            </div>
            <AnimateHeight
                duration={500}
                height={height} // see props documentation below
            >
                <div className={styles.legendContent}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus efficitur lectus,
                    sed pharetra libero posuere vel. Interdum et malesuada fames ac ante ipsum primis in faucibus.
                    Integer ultrices velit non porttitor maximus. Aenean elementum orci eu dignissim eleifend.
                    Maecenas tincidunt odio mauris, sed blandit diam blandit ut. Donec mollis, ipsum eget condimentum suscipit,
                    lorem ex efficitur est, vitae pharetra ex sapien quis diam. Nunc id velit non risus convallis maximus eu
                    vitae ipsum. Nam eu malesuada nulla, hendrerit convallis sem. Praesent tincidunt eros tellus. Sed at purus tincidunt,
                    dignissim nisl in, fermentum ex. Sed sagittis enim lorem. Praesent mattis blandit cursus. Sed id aliquet mauris.
                    Morbi dapibus non ante eget congue. Vivamus aliquet blandit leo non posuere. Morbi leo ipsum,
                    vestibulum non nulla sit amet, bibendum vulputate erat.Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Cras finibus efficitur lectus, sed pharetra libero posuere vel. Interdum et
                    malesuada fames ac ante ipsum primis in faucibus. Integer ultrices velit non porttitor maximus.
                    Aenean elementum orci eu dignissim eleifend. Maecenas tincidunt odio mauris, sed blandit diam blandit ut.
                    Donec mollis, ipsum eget condimentum suscipit, lorem ex efficitur est, vitae pharetra ex sapien quis diam.
                    Nunc id velit non risus convallis maximus eu vitae ipsum. Nam eu malesuada nulla, hendrerit convallis sem.
                    Praesent tincidunt eros tellus. Sed at purus tincidunt, dignissim nisl in, fermentum ex. Sed sagittis enim lorem.
                    Praesent mattis blandit cursus. Sed id aliquet mauris. Morbi dapibus non ante eget congue. Vivamus aliquet blandit
                    leo non posuere. Morbi leo ipsum, vestibulum non nulla sit amet, bibendum vulputate erat.
                </div>
            </AnimateHeight>
        </div >
    )
}