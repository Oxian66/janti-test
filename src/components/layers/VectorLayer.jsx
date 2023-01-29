import { useContext, useEffect } from "react";
import MapContext from '../map/MapContext';
import OLVectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON.js";
import { Vector as VectorSource } from 'ol/source';


export default function VectorLayer ({ source, style }) {

  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let vectorLayer = new OLVectorLayer({
      source,
      style,
    });
    map.addLayer(vectorLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map]);
  return null;
};

export const vector = ({ features }) => {
	return new VectorSource({
    // format: new GeoJSON(),
		features,
	});
}