import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Home from './Home'; 
import Footer from './Footer';

const Stocks = ({ addToWatchlist }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/stocks")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched stocks:", data); 
        setStocks(data);
      })
      .catch((error) => console.error("Error fetching stocks:", error));
  }, []);

  const getRandomColor = () => {
    const colors = ["#bc5a45", "#00CC33"]; 
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="App">
      <h1 style={{ fontSize: "4rem", marginBottom: "5px" }}>Stock Market Portfolio</h1>
      <h2>Stocks</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.symbol} className="stock-item">
            <span className="stock-company">{stock.company}</span>
            <span className="stock-symbol">({stock.symbol})</span>
            <span className="stock-price" style={{ color: getRandomColor() }}>
              ${stock.initial_price}
            </span>
            <button className="add-to-watchlist" onClick={() => addToWatchlist(stock)}>
              Add to My Watchlist
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Watchlist = ({ watchlist, removeFromWatchlist }) => {
  const getRandomColor = () => {
    const colors = ["#bc5a45", "#00CC33"]; 
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="App">
      <h1 style={{ fontSize: "4rem", marginBottom: "5px" }}>Stock Market Portfolio</h1>
      <h2>My Watchlist</h2>
      <ul>
        {watchlist.map((stock) => (
          <li key={stock.symbol} className="stock-item">
            <span className="stock-company">{stock.company}</span>
            <span className="stock-symbol">({stock.symbol})</span>
            <span className="stock-price" style={{ color: getRandomColor() }}>
              ${stock.initial_price}
            </span>
            <button className="remove-from-watchlist" onClick={() => removeFromWatchlist(stock.symbol)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [watchlist, setWatchlist] = useState([]);

  const addToWatchlist = (stock) => {
    fetch("http://localhost:5000/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stock),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setWatchlist([...watchlist, stock]);
      })
      .catch((error) => console.error("Error adding to watchlist:", error));
  };

  const removeFromWatchlist = (symbol) => {
    fetch(`http://localhost:5000/api/watchlist/${symbol}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));
      })
      .catch((error) => console.error("Error removing from watchlist:", error));
  };

  return (
    <Router>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/stocks">Stocks</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<Stocks addToWatchlist={addToWatchlist} />} />
        <Route path="/watchlist" element={<Watchlist watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
