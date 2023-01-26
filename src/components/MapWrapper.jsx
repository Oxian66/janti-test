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
import GeoJSON from "ol/format/GeoJSON.js";
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

  const createPathCoords = () => {
    return props.features.length
      ? props.features.map((item) => [+item.lon, +item.lat])
      : [];
  };

  const currentPath = createPathCoords();
  console.log("c", currentPath);


  const data = {
    type: 'Feature',
    properties: {},
    geometry : {
      type: 'LineString',
      coordinates: currentPath,
    },
  };

  const feature = new GeoJSON().readFeature(data, {
    featureProjection: 'WGS84'
  });

  useEffect(() => {
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature],
          format: new GeoJSON(),
      }),
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
        center: [0, 0],
        zoom: 2,
        constrainResolution: true,
      }),
    });

    initialMap.on("click", handleMapClick);
    setMap(initialMap);
    initialMap.addControl(zoomslider);
    setFeaturesLayer(initalFeaturesLayer);
    initialMap.addOverlay(popup);

  }, []);
 
  //useEffect(() => {
    //if (props.features.length) {
      // const startMarker = new Feature({
      //   type: 'icon',
      //   geometry: new Point(props.route[0]),
      // });
      // const endMarker = new Feature({
      //   type: 'icon',
      //   geometry: new Point(props.route.at(-1)),
      // });
      
      // const routeFeature = new Feature({
      //   geometry: new Polyline({ factor: 1e6 }).writeGeometry(
      //     new LineString(currentPath)
      //   ),
      // })
      // featuresLayer.setSource(
      //   new VectorSource({
      //     features: [routeFeature],
      //   })
      // );
 
    // setFeaturesLayer(addMarkers(marks, props.color));
   // }
   // console.log("cl", featuresLayer);

  //}, [props.features]);

  const handleMapClick = (e) => {
    const clickedCoord = e.coordinate;
    const element = popup.getElement();
    let popover = Popover.getInstance(element);
    setSelectedCoord(clickedCoord);

    popover = new Popover(element, {
      animation: false,
      container: element,
      content: `<p>The location you clicked was: ${clickedCoord[0]}-${clickedCoord[1]}</p>`,
      html: true,
      placement: "top",
      title: "",
    });
    popover.show();
  };

  return (
    <>
      <div ref={mapElement} className="map-container"></div>
    </>
  );
}
