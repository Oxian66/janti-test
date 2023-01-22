import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';

export default function Routes(props) {
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState([]);
  const [copyRoutes, setCopyRoutes] = useState([]);
  const [id, setId] = useState();
  const [userInput, setUserInput] = useState('');

  const fetchRoutes = async () => {
    const res = await axios.get(process.env.REACT_APP_BASE_URL);
    console.log(res)
    let copyData = [...res.data];
    setRoutes(res.data);
    setCopyRoutes(copyData);
  };

  const handleClick = useCallback(async (id) => {
    //setId( e.target.value);
    // const _id = e.target.value;
    console.log('id', id);
    const res = await axios.get(`https://janti.ru:5381/Main/GetRouteData?id=${id}`);
    console.log('res', res);
    setRoute(res);
    console.log('route', route);
    props.getChildContext(route);
    props.getRouteColor(route.color);
  }, [route, props]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {handleClick(id)}, [handleClick, id]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };
  const filteredRoute = (e) => {
    if (e.key === 'Enter') {
      const filtered = routes.filter((route) => route.name === userInput);
      setCopyRoutes(filtered);
    } 
  };

  return (
    // <RoutesContex.Provider value={route}>
      <div className="routes-container">
        <h2>Выберете маршрут</h2>
        <input
          type="search"
          onChange={handleUserInput}
          onKeyDown={filteredRoute}
        />
        <ul>
          {copyRoutes.map((route) => (
            <li key={route.id}>
              <label>
                <input type="radio" value={route.id} onClick={ () => {
                  setId(route.id);
                  handleClick(id);
                }
                  }/>
              </label>
              {route.name}
            </li>
          ))}
        </ul>
        <button onClick={() =>{ 
          console.log('hiu', route);
          setCopyRoutes(route)}}>Отмена</button>
      </div>
  );
}
