import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapWrapper from "./components/map/MapWrapper";
// import toast, { Toaster } from 'react-hot-toast';
import Routes from "./components/routes/Routes";

export default function App() {
  const [color, setColor] = useState("");
  const [routes, setRoutes] = useState([]);
  const [choosenRoute, setChoosenRoute] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get("https://janti.ru:5381/Main/GetRoutes");
        setRoutes(res.data);
        
      } catch (e) {
        // toast.error(`Something going wrong: ${e.message}`);
        alert(`Something going wrong: ${e.message}`)
      }
    };
    fetchRoutes();
  }, []);

  return (
    <div className="App">
      <Routes setChoosenRoute={setChoosenRoute} routes={routes} choosenRoute={choosenRoute} setColor={setColor} />
      <MapWrapper features={choosenRoute} color={color}/>
      {/* <Toaster /> */}
    </div>
  );
}
