import React, { useState, useEffect } from "react";
import './Routes.css';
import axios from "axios";
import toast from 'react-hot-toast';

export default function Routes ({setChoosenRoute, routes, choosenRoute, setColor}) {

  const [copyRoutes, setCopyRoutes] = useState([]);
  const [id, setId] = useState();
  const [isVisible, setVisible] = useState(false);
  const [userInput, setUserInput] = useState("");
  console.log('route', choosenRoute);

  useEffect(() => {setCopyRoutes(routes)}, [routes])

    const handleClick = async (e) => {
        const _id = e.target.value;
        // setClicked(true);
        try {
          const res = await axios.get(
            `https://janti.ru:5381/Main/GetRouteData?id=${_id}`
          );
          setChoosenRoute(res.data);
        } catch (e) {
          alert(`Something going wrong: ${e.message}`);
        }
      };
    
      const handleUserInput = (e) => {
        setUserInput(e.target.value);
      };
    
      const filteredRoute = (e) => {
        if (e.key === "Enter") {
          const filtered = copyRoutes.filter((route) => route.name.trim() === userInput.trim());
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
          placeholder="Введите маршрут"
        />
        <ul>
          {copyRoutes.map((route) => (
            <li key={route.id}>
              <label>
                <input
                  type="radio"
                  name="radio"
                  value={route.id}
                  id={route.id.toString()}
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
            setUserInput('');
          }}
        >
          Отмена
        </button>
        {isVisible && <button>Анимация движения</button>}
      </div>
    );
}