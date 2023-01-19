import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';

export const RoutesContex = React.createContext();
export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState([]);
  const [id, setId] = useState();
  //const [routeContext, setRouteContext] = useContext([]);
  const fetchRoutes = async () => {
    const res = await axios.get(process.env.REACT_APP_BASE_URL);
    console.log(res)
    setRoutes(res.data);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);
  
  const handleClick = async (e) => {
    setId(e.target.value);
    console.log('id', );
    const res = await axios.get(`https://janti.ru:5381/Main/GetRouteData?id=${id}`);
    setRoute(res);
    //setRouteContext(res);
    console.log('route', route);
  };


  return (
    <RoutesContex.Provider value={route}>
      <div className="routes-container">
        <h2>Выберете маршрут</h2>
        <ul>
          {routes.map((route) => (
            <li key={route.id}>
              <label>
                <input type="checkbox" value={route.id} onClick={handleClick} />
              </label>
              {route.name}
            </li>
          ))}
        </ul>
      </div>
    </RoutesContex.Provider>
  );
}
