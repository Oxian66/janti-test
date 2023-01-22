import React, { useState, useEffect, useRef, } from "react";
import { Feature, Map, Overlay, View } from 'ol/index.js';
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { ZoomSlider } from "ol/control.js";
import { Popover } from "bootstrap";
import "ol/ol.css";
import { transform } from "ol/proj";

export default function MapWrapper(props) {
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const [selectedCoord, setSelectedCoord] = useState();

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  const popup = new Overlay({
    element: document.querySelector('.modal'),
    stopEvent: false,
  });

  useEffect(() => {
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource(),
      style: {
        'circle-radius': '3px',
        'circle-fill-color': `${props.color}`,
      }
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

    initialMap.on('click', handleMapClick);
    setMap(initialMap);
    initialMap.addControl(zoomslider);
    setFeaturesLayer(initalFeaturesLayer);
    initialMap.addOverlay(popup);
  }, []);
  
  useEffect( () => {

    if (props.features.length) {
      featuresLayer.setSource(
        new VectorSource({
          features: props.features
        })
      )
    };

  },[props.features, featuresLayer])

  const handleMapClick = (event) => {

    // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
    //  https://stackoverflow.com/a/60643670
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
    const element = popup.getElement();
    let popover = Popover.getInstance(element);

    setSelectedCoord(clickedCoord);

    popover = new Popover(element, {
      animation: false,
      container: element,
      content: '<p>The location you clicked was:</p>',
      html: true,
      placement: 'top',
      title: 'Welcome to OpenLayers',
    });
    popover.show();
  };

  return (
    <>
    <div className="modal"></div>
    <div  ref={mapElement} className="map-container"></div>
    </>
  );
}
