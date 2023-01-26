import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MapWrapper from "./components/MapWrapper";

function App() {
  const [color, setColor] = useState("");
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState([]);
  const [copyRoutes, setCopyRoutes] = useState([]);
  const [id, setId] = useState();
  const [userInput, setUserInput] = useState("");

  const handleClick = async (e) => {
    const _id = e.target.value;
    try {
      const res = await axios.get(
        `https://janti.ru:5381/Main/GetRouteData?id=${_id}`
      );
      setRoute(res.data);
    } catch (e) {
      console.error(`Something going wrong: ${e.message}`);
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const filteredRoute = (e) => {
    if (e.key === "Enter") {
      const filtered = copyRoutes.filter((route) => route.name === userInput);
      setCopyRoutes(filtered);
    }
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      const res = await axios.get(process.env.REACT_APP_BASE_URL);
      let copyData = [...res.data];
      setRoutes(res.data);
      setCopyRoutes(copyData);
    };
    fetchRoutes();
  }, []);

  return (
    <div className="App">
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
                <input
                  type="radio"
                  value={route.id}
                  onClick={(e) => {
                    setId(route.id);
                    setColor(route.color);
                    handleClick(e);
                  }}
                />
              </label>
              {route.name}
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            setCopyRoutes(routes);
            setUserInput("");
          }}
        >
          Отмена
        </button>
      </div>
      <MapWrapper features={route} color={color} />
    </div>
  );
}

export default App;
