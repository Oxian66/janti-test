import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import Feature from 'ol/Feature';

import MapWrapper from './components/MapWrapper';
import Routes from './components/Routes';
import { ToastContainer } from 'react-toastify';

function App() {
  const [features, setFeatures] = useState([]);
  const [color, setColor] = useState('');

  const getChildContext = (props) => {
    setFeatures(props);
    console.log('features', features);
  };

  const getRouteColor = (props) => {
    setColor(props);
  }


  // useEffect( () => {
  //   fetch('/mock-geojson-api.json')
  //     .then(response => response.json())
  //     .then( (fetchedFeatures) => {

  //       // parse fetched geojson into OpenLayers features
  //       //  use options to convert feature from EPSG:4326 to EPSG:3857
  //       const wktOptions = {
  //         dataProjection: 'EPSG:4326',
  //         featureProjection: 'EPSG:3857'
  //       }
  //       const parsedFeatures = new GeoJSON().readFeatures(fetchedFeatures, wktOptions)

  //       // set features into state (which will be passed into OpenLayers
  //       //  map component as props)
  //       setFeatures(parsedFeatures)
  //     })
  // },[]);


  return (
    <div className="App">
      <Routes getChildContext={getChildContext} getRouteColor={getRouteColor}/>
      <MapWrapper features={features} color={color}/>
      <ToastContainer />
    </div>
  );
}

export default App;
