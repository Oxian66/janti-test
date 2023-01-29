import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapWrapper from "./components/map/MapWrapper";

import { Feature, Overlay, View } from "ol/index.js";
import TileLayer from "ol/layer/Tile";

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
  // const [features, setFeatures] = useState([]);

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

  return (
    <div className="App">
      <Routes setChoosenRoute={setChoosenRoute} routes={routes} choosenRoute={choosenRoute} setColor={setColor} />
      <MapWrapper features={choosenRoute} color={color}/>
      <Toaster />
    </div>
  );
}
