import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./baseMap"), {
    ssr: false,
});

const Map = ({ mapLocations }) => {
    return <DynamicMap mapLocations={mapLocations} ></DynamicMap>
}

export default Map