import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./baseMap"), {
    ssr: false,
});

const Map = ({ data }) => {
    return <DynamicMap data={data} ></DynamicMap>
}

export default Map