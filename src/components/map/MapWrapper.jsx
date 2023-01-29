import React, { useState, useEffect, useRef } from "react";
import { Feature, Map, Overlay, View } from "ol/index.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { ZoomSlider } from "ol/control.js";
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from "ol/style";
import Polyline from "ol/format/Polyline.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { Popover } from "bootstrap";
import "ol/ol.css";

export default function MapWrapper(props) {
  const [map, setMap] = useState([]);
  const [featuresLayer, setFeaturesLayer] = useState();
  const [selectedCoord, setSelectedCoord] = useState();
  //НАДО ПОПРОБОВАТЬ ВО ВТОРОМ ЭФФЕКТЕ ВЕКТОРУ СОУРС ПОСТАВИТЬ

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  const popup = new Overlay({
    element: document.querySelector(".modal"),
    stopEvent: false,
  });

  // const createPathCoords = () => {
  //   return props.features.length
  //     ? props.features.map((item) => [item.lon, item.lat])
  //     : [];
  // };

  // const currentPath = createPathCoords();

  const currentPath = props.features.map((c) => [
    c.lon,
    c.lat,
  ]);
  console.log("c", currentPath);

  const points = currentPath.map((point) => new Point(point).transform('EPSG:4326', 'EPSG:3857',));

  // const feature = new GeoJSON().readFeature(data, {
  //   featureProjection: ' EPSG:3857'
  // });

  const line = new LineString(points);

  const lineFeature = new Feature({
    type: 'line',
    geometry: line,
  });

  const pointsFeature = new Feature({
    type: 'point',
    geometry: new Point(currentPath).transform(
      'EPSG:4326',
      'EPSG:3857',
    ),
  });
  
  const startMarker = new Feature({
    type: 'icon-start',
    geometry: new Point(line.getFirstCoordinate()),
  });
  const endMarker = new Feature({
    type: 'icon-end',
    geometry: new Point(line.getLastCoordinate()),
  });

  const styles = {
    'line': new Style({
      stroke: new Stroke({
        width: 6,
        color: [237, 212, 0, 0.8],
      }),
    }),
    'icon-start': new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'public/start-marker.png',
      }),
    }),
    'icon-end': new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'public/end-marker.png',
      }),
    }),
    'geoMarker': new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({color: 'black'}),
        stroke: new Stroke({
          color: 'white',
          width: 2,
        }),
      }),
    }),
  };

  useEffect(() => {

    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource({
        features: [],
        
          // format: new GeoJSON(),
      }),
    });

    const source = new OSM();
    const layer = new TileLayer({
      source: source,
    });
    const zoomslider = new ZoomSlider();

    const initialMap = new Map({
      target: mapRef.current ?? undefined,
      layers: [layer, initalFeaturesLayer, ],
      view: new View({
        center: [0, 0],
        zoom: 2,
        constrainResolution: true,
        overlays: [popup]
      }),
    });

    initialMap.on("click", handleMapClick);
    setMap(initialMap);
    initialMap.addControl(zoomslider);
    setFeaturesLayer(initalFeaturesLayer);
    initialMap.addOverlay(popup);
    if (props.isClicked) {
      const place = [-110, 45];
     const point = new Point(place);
     
      const newFeaturesLayer = new VectorLayer({
        source: new VectorSource({
          features: [lineFeature, pointsFeature, startMarker, endMarker, new Feature(point)],
            // format: new GeoJSON(),
            style: (feature) => {
              return styles[feature.get('type')];
            },
        }),
      });
       initialMap.addLayer(newFeaturesLayer);
      
    }
    
  }, []);
  const route = new LineString(currentPath);

  const routeFeature = new Feature({
    type: 'route',
    geometry: route,
  });
  

  useEffect(() => {
    
    //   const place = [-110, 45];
    //  const point = new Point(place);
     
    //   const newFeaturesLayer = new VectorLayer({
    //     source: new VectorSource({
    //       features: [new Feature(point)],
    //         // format: new GeoJSON(),
    //         style: (feature) => {
    //           return styles[feature.get('type')];
    //         },
    //     }),
    //   });
    //   if (map) map.addLayer(newFeaturesLayer);
    // if (!map.length) return
    // map?.getLayers().forEach((layer) => {
    //   if (layer.get('id') && layer.get('id') === 'activeRouteLayer') {
    //     map?.removeLayer(layer);
    //   }
    // });
    // map && map.addLayer(vectorLayer);
    // if (props.features.length) {
    //   featuresLayer.setSource(
    //     new VectorSource({
    //       features: new Feature(point )
    //     })
    //   )
    // }
    // map.addLayer(featuresLayer)
    
  }, [props.feature]);

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [routeFeature, pointsFeature, startMarker, endMarker],
    }),
  });

  vectorLayer.set('id', 'activeRouteLayer');
//______________________________________________________
  const handleMapClick = (e) => {
    const clickedCoord = e.coordinate;
    const div = document.createElement('div');
    div.classList.add('modal');
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
    if (clickedCoord === '') popover.show();
  };

  console.log('pf', pointsFeature);
  return (
    <>
      <div ref={mapRef} className="map-container"></div>
    </>
  );
}
