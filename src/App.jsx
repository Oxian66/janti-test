import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Feature from 'ol/Feature';

import MapWrapper from './components/MapWrapper';
import Routes from './components/Routes';

function App() {
  const [features, setFeatures] = useState([]);
  const [color, setColor] = useState('');
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState([]);
  const [copyRoutes, setCopyRoutes] = useState([]);

  const fetchRoutes = async () => {
    const res = await axios.get(process.env.REACT_APP_BASE_URL);
    let copyData = [...res.data];
    setRoutes(res.data);
    setCopyRoutes(copyData);
  };

  const getChildContext = useCallback((props) => {
    setRoute(props);
    
  },[]);

  const getRouteColor = (props) => {
    setColor(props);
  };

  useEffect(() => {
    const res = fetchRoutes();
    setFeatures(res);
  }, []);

  useEffect(() => {
    getChildContext();
  },[getChildContext])


  return (
    <div className="App">
      <Routes getChildContext={getChildContext} getRouteColor={getRouteColor} features={routes} />
      <MapWrapper features={features} color={color} />
    </div>
  );
}

export default App;
