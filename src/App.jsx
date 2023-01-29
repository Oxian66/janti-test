import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapWrapper from "./components/map/MapWrapper";
import Map from "./components/map/Map";
import vector from './components/source/Vector.js';
import osm from './components/source/Osm.js';
// import VectorLayer from "./components/layers/VectorLayer";
import { Feature, Overlay, View } from "ol/index.js";
// import TileLayer from "ol/layer/Tile";
import { LayersComponent, TileLayer, VectorLayer } from './components/layers';
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from "ol/style";
import * as olSource from "ol/source";
import { fromLonLat } from 'ol/proj';
import toast, { Toaster } from 'react-hot-toast';
import Routes from "./components/routes/Routes";


export default function App() {
  const [color, setColor] = useState("");
  const [routes, setRoutes] = useState([]);
  const [choosenRoute, setChoosenRoute] = useState([]);
  const [id, setId] = useState();
  const [center, setCenter] = useState([76, 66]);
  const [zoom, setZoom] = useState(3);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get("https://janti.ru:5381/Main/GetRoutes");
        setRoutes(res.data);
      } catch (e) {
        toast.error(`Something going wrong: ${e.message}`);
      }
    };
    fetchRoutes();
  }, []);

  //feature
  const currentPath = choosenRoute.map((c) => [
    c.lon,
    c.lat,
  ]);

  
  useEffect(() => {
    const points = currentPath.map((point) => new Point(point).transform('EPSG:4326', 'EPSG:3857',));

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


  const lineFeatures = points.map(
    (item) =>
      new Feature({
        type: "line",
        geometry: line,
      })
  );
  
  setFeatures(pointsFeature)


  }, [choosenRoute]);

  console.log('features', features);
  
  const style = {
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
    'point' : new Style({
      image: new CircleStyle({
        radius: 3,
        fill: new Fill({color: 'red'}),
      }),
    })
  };

  return (
    <div className="App">
      <Routes setChoosenRoute={setChoosenRoute} routes={routes} choosenRoute={choosenRoute}  />
      <MapWrapper features={choosenRoute} color={color} />
      {/* <Map center={fromLonLat(center)} zoom={zoom} color={color} features={choosenRoute}>
        <LayersComponent>
          <TileLayer source={osm()} zIndex={0}/>
          <VectorLayer source={vector({ features })} style={style}/>
        </LayersComponent>
      </Map> */}
      <Toaster />
    </div>
  );
}
