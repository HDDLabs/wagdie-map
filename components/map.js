import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./baseMap"), {
  ssr: false,
});

const Map = ({ mapData }) => {
  return <DynamicMap mapData={mapData}></DynamicMap>;
};

export default Map;
