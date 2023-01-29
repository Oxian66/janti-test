import React, { useState, useEffect, useRef, useMemo } from "react";
 import './Map.css';
import { Feature, Map, Overlay, View } from "ol/index.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { ZoomSlider } from "ol/control.js";
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke, Icon, } from "ol/style";
// import Polyline from "ol/format/Polyline.js";
import { Popover } from "bootstrap";
import "ol/ol.css";
// import { toast } from "react-hot-toast";

export default function MapWrapper(props) {
  const [map, setMap] = useState([]);
  const [featuresLayer, setFeaturesLayer] = useState();
  const [selectedCoord, setSelectedCoord] = useState();

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  const element = document.getElementById('popup');

  const currentCoordsArray = props.features.map((c) => [
    c.lon,
    c.lat,
  ]);
  console.log("c", currentCoordsArray);
  const popup = new Overlay({
    element: element,
    stopEvent: false,
  });

  let popover;

  function handleMapClick (e) {
    const clickedCoord = e.coordinate;
    const element = popup.getElement();
    setSelectedCoord(clickedCoord);
    if (popover) {
      popover.dispose();
      popover = undefined;
    }
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

  useEffect(() => {
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource({
        features: [],
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

  useEffect(() => {
    // if (!map.length) return;
    console.log('USE EFFECT WORKS')
    const route = new LineString(currentCoordsArray);
  const routeFeature = new Feature({
    type: 'route',
    geometry: route,
  });

  const pointsFeature = 
    new Feature({
      type: 'points',
      geometry: new MultiPoint(currentCoordsArray).transform(
        'EPSG:4326',
        'EPSG:3857',
      ),
    });

    pointsFeature.setStyle(new Style({
      image: new CircleStyle({
        radius: 3,
        fill: new Fill({
          color: props.color,
        }),
      })
    }));
    

    const startIcon = new Feature({
      type: 'start-icon',
      geometry: new Point(route.getFirstCoordinate()),
    });
  
    const endIcon = new Feature({
      type: 'end-icon',
      geometry: new Point(route.getLastCoordinate()),
    });

    startIcon.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: '../../../public/start-marker.png'
      })
    }));
   

    if (props.features.length) {
    
      featuresLayer.setSource(
        new VectorSource({
          features:[pointsFeature, routeFeature, startIcon, endIcon]
        })
      );
      
      //  map?.getView().setZoom(8);
      //  map?.getView().setCenter();
    }  
  }, [currentCoordsArray, featuresLayer, map, props.color, props.features.length]);

  return (
    <>
      <div ref={mapElement} className="map-container">
        <div id="popup"></div>
      </div>
    </>
  );
}
