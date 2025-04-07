import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "./components/Registration";
import GameContainer from "./components/GameContainer";
import "./App.css";

function App() {
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const username = Cookies.get("username");
        const password = Cookies.get("password");
        if (username && password) {
            setIsRegistered(true);
        }
    }, []);

    const handleRegister = (username, password) => {
        Cookies.set("username", username);
        Cookies.set("password", password);
        setIsRegistered(true);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={isRegistered ? <GameContainer /> : <Registration onRegister={handleRegister} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;