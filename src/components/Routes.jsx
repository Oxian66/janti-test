import React, { useState, useEffect, useCallback, } from "react";
import axios from 'axios';

export default function Routes(props) {
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState([]);
  const [copyRoutes, setCopyRoutes] = useState([]);
  const [id, setId] = useState();
  const [userInput, setUserInput] = useState('');

  const fetchRoutes = async () => {
    const res = await axios.get(process.env.REACT_APP_BASE_URL);
    let copyData = [...res.data];
    setRoutes(res.data);
    setCopyRoutes(copyData);
  };

  const handleClick = useCallback(async (id) => {
    if (!id) return;
    try {
    const res = await axios.get(`https://janti.ru:5381/Main/GetRouteData?id=${id}`);
    setRoute(res);
    props.getChildContext(route);
    props.getRouteColor(route.color);
    } catch (e) {
      console.error(`Something going wrong: ${e.message}`);
    }
    
  }, [route, props,]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {handleClick(id)}, [handleClick, id, ]);

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
      <div className="routes-container">
        <h2>Выберете маршрут</h2>
        <input
          type="search"
          onChange={handleUserInput}
          onKeyDown={filteredRoute}
        />
        <ul>
          {props.features.map((route) => (
            <li key={route.id}>
              <label>
                <input type="radio" value={route.id} onClick={() => {
                  setId(route.id);
                  handleClick();
                }
                  }/>
              </label>
              {route.name}
            </li>
          ))}
        </ul>
        <button onClick={() =>{ 
          setCopyRoutes(route)}}>Отмена</button>
      </div>
  );
}