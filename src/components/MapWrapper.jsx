import React, { useState, useEffect, useRef } from "react";
import { Feature, Map, Overlay, View } from "ol/index.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { ZoomSlider } from "ol/control.js";
import Point from "ol/geom/Point.js";
import { Style, Circle as CircleStyle, Fill } from "ol/style";
import Polyline from "ol/format/Polyline.js";
import LineString from "ol/geom/LineString.js";
import { fromLonLat } from "ol/proj";
import { Popover } from "bootstrap";
import "ol/ol.css";

export default function MapWrapper(props) {
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const [selectedCoord, setSelectedCoord] = useState();

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  const popup = new Overlay({
    element: document.querySelector(".modal"),
    stopEvent: false,
  });

  useEffect(() => {
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
      style: {
        "circle-radius": "3px",
        "circle-fill-color": `${props.color}`,
      },
      features: [],
    });

    const source = new OSM();
    const layer = new TileLayer({
      source: source,
    });
    const zoomslider = new ZoomSlider();

    const initialMap = new Map({
      target: mapElement.current,
      layers: [layer, initalFeaturesLayer],
      view: new View({
        projection: "EPSG:3857",
        center: [0, 0],
        zoom: 3,
      }),
    });

    initialMap.on("click", handleMapClick);
    setMap(initialMap);
    initialMap.addControl(zoomslider);
    setFeaturesLayer(initalFeaturesLayer);
    initialMap.addOverlay(popup);
  }, []);

  const createPathCoords = () => {
    return props.features.length
      ? props.features.map((item) => [+item.lon, +item.lat])
      : [];
  };
  const addMarkers = (lonLatArray, color) => {
    const pointStyle = new Style({
      image: new CircleStyle({
        radius: 3,
        fill: new Fill({
          color: color,
        }),
      }),
    });
    const features = lonLatArray.map((item) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(item)),
      });
      feature.setStyle(pointStyle);
      return feature;
    });
    return features;
  };

  const currentPath = createPathCoords();
  console.log("c", currentPath);

  const route = new Polyline({
    factor: 1e6,
  }).writeGeometry(new LineString(currentPath));

  useEffect(() => {
    if (props.features.length) {
      featuresLayer.setSource(
        new VectorSource({
          features: [props.features],
          style: new Style({
            geometry: new Polyline({ factor: 1e6 }).writeGeometry(
              new LineString(currentPath)
            ),
          }),
        })
      );
    }
    console.log("cl", featuresLayer);
  }, [props.features, featuresLayer, currentPath]);

  const handleMapClick = (e) => {
    const clickedCoord = e.coordinate;
    const element = popup.getElement();
    let popover = Popover.getInstance(element);
    setSelectedCoord(clickedCoord);

    popover = new Popover(element, {
      animation: false,
      container: element,
      content: "<p>The location you clicked was:</p>",
      html: true,
      placement: "top",
      title: "",
    });
    popover.show();
  };

  return (
    <>
      <div className="modal"></div>
      <div ref={mapElement} className="map-container"></div>
    </>
  );
}
