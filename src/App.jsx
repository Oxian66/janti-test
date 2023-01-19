import './App.css';
import React, { useState, useEffect } from 'react';

// openlayers
// import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature';

import MapWrapper from './components/MapWrapper';
import Routes from './components/Routes';

function App() {
  const [features, setFeatures] = useState([]);

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
      <Routes />
      <MapWrapper features={features}/>
    </div>
  );
}

export default App;
