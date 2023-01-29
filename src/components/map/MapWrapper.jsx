import React, { useState, useEffect, useRef, useMemo } from "react";
 import './Map.css';
import { Feature, Map, Overlay, View } from "ol/index.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { ZoomSlider } from "ol/control.js";
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from "ol/style";
// import Polyline from "ol/format/Polyline.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { Popover } from "bootstrap";
import "ol/ol.css";
import { toast } from "react-hot-toast";

export default function MapWrapper(props) {
  const [map, setMap] = useState([]);
  const [featuresLayer, setFeaturesLayer] = useState();
  const [selectedCoord, setSelectedCoord] = useState();
  //НАДО ПОПРОБОВАТЬ ВО ВТОРОМ ЭФФЕКТЕ ВЕКТОРУ СОУРС ПОСТАВИТЬ

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  const element = document.getElementById('popup');

  const popup = new Overlay({
    element: element,
    stopEvent: false,
  });

  // const createPathCoords = () => {
  //   return props.features.length
  //     ? props.features.map((item) => [item.lon, item.lat])
  //     : [];
  // };

  // const currentCoordsArray = createPathCoords();

  const currentCoordsArray = props.features.map((c) => [
    c.lon,
    c.lat,
  ]);
  console.log("c", currentCoordsArray);

  // const points = currentCoordsArray.map((point) => new Point(point).transform('EPSG:4326', 'EPSG:3857',));
  // const pointsFeature = new Feature({
  //   type: 'point',
  //   geometry: new Point(currentCoordsArray).transform(
  //     'EPSG:4326',
  //     'EPSG:3857',
  //   ),
  // });

  // const line = new LineString(points);

  // const lineFeature = new Feature({
  //   type: 'line',
  //   geometry: line,
  //   coordinates: points,
  // });

  
  // const startMarker = new Feature({
  //   type: 'icon-start',
  //   geometry: new Point(line.getFirstCoordinate()),
  // });
  // const endMarker = new Feature({
  //   type: 'icon-end',
  //   geometry: new Point(line.getLastCoordinate()),
  // });

  // const styles = {
  //   'line': new Style({
  //     fill: new Fill({color: 'red'})
  //   }),
  //   'icon-start': new Style({
  //     image: new Icon({
  //       anchor: [0.5, 1],
  //       src: 'public/start-marker.png',
  //     }),
  //   }),
  //   'icon-end': new Style({
  //     image: new Icon({
  //       anchor: [0.5, 1],
  //       src: 'public/end-marker.png',
  //     }),
  //   }),
  //   'geoMarker': new Style({
  //     image: new CircleStyle({
  //       radius: 7,
  //       fill: new Fill({color: 'black'}),
  //       stroke: new Stroke({
  //         color: 'white',
  //         width: 2,
  //       }),
  //     }),
  //   }),
  //   'point': new Style({
  //     'circle-radius': 9,
  //       'circle-fill-color': 'red',

  //   })
  // };

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
      layers: [layer, initalFeaturesLayer, ],
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
    
  
  // console.log('MAAAAAAP!!', map);
const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [routeFeature, pointsFeature],
    }),
  });

  useEffect(() => {
    // if (!map.length) return;
    console.log('USE EFFECT WORKS')
    if (props.features.length > 0) {
    
      featuresLayer.setSource(
        new VectorSource({
          features:[ pointsFeature, routeFeature]
        })
      );
      
       map?.getView().setZoom(8);
      //  map?.getView().setCenter();

    }
    
  }, [featuresLayer, map, pointsFeature, props.features.length, routeFeature]);

  


  let popover;
function disposePopover() {
  if (popover) {
    popover.dispose();
    popover = undefined;
  }
}
//______________________________________________________
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
      <div ref={mapElement} className="map-container">
        <div id="popup"></div>
      </div>
    </>
  );
}
