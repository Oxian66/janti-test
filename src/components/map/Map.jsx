import React, { useRef, useState, useEffect } from 'react';
import './Map.css';
import { LineString, MultiPoint, Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from 'ol/style';
import { Feature, Overlay, View } from 'ol/index.js';
import MapContext from './MapContext';
import * as ol from 'ol';
import { ZoomSlider, Zoom } from 'ol/control.js';
import 'ol/ol.css';

export default function Map({ children, zoom, center }) {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
      constrainResolution: true,
    };
    let mapObject = new ol.Map(options);
    const zoomslider = new ZoomSlider();
    const zoomControls = new Zoom();
    mapObject.setTarget(mapRef.current);

    setMap(mapObject);
    mapObject.addControl(zoomslider);
    mapObject.addControl(zoomControls);
    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);
  console.log('mapChildren', children);
  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} className="map-container">
        {children}
      </div>
    </MapContext.Provider>
  );
}
