import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import EmailCard from "./EmailCard";
import LoginForm from "./LoginForm";
import Scoreboard from "./Scoreboard";
import IgnoredEmails from "./IgnoredEmails";
import { generateEmail } from "../data/emailGenerator";

const Game = {
    playSound: (type) => {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.play();
    },
};

const GameContainer = () => {
    const [currentEmail, setCurrentEmail] = useState(generateEmail());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState("");
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [ignoredEmails, setIgnoredEmails] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const maxIgnores = 3;

    useEffect(() => {
        localStorage.setItem("gameState", JSON.stringify({ score, ignoredEmails }));
        window.addEventListener("online", () => setIsOnline(true));
        window.addEventListener("offline", () => setIsOnline(false));
        return () => {
            window.removeEventListener("online", () => setIsOnline(true));
            window.removeEventListener("offline", () => setIsOnline(false));
        };
    }, [score, ignoredEmails]);

    const handleDecision = (action) => {
        if (action === "allow") {
            if (currentEmail.isPhishing) {
                if (currentEmail.action === "malicious_file" || currentEmail.action === "malicious_link") {
                    Game.playSound("error");
                    setGameOverMessage(`Game Over! You interacted with a ${currentEmail.action.replace("_", " ")}.`);
                    setGameOver(true);
                } else if (currentEmail.action === "credential_stealer") {
                    setShowLoginForm(true);
                }
            } else {
                if (currentEmail.action === "login_required") {
                    setShowLoginForm(true);
                } else if (currentEmail.action === "file_review" || currentEmail.action === "policy_review") {
                    Game.playSound("success");
                    setScore(score + 5);
                    setCurrentEmail(generateEmail());
                }
            }
        } else if (action === "report") {
            if (currentEmail.isPhishing) {
                Game.playSound("success");
                setScore(score + 10);
            } else {
                Game.playSound("error");
                setScore(score - 5);
            }
            setCurrentEmail(generateEmail());
        } else if (action === "ignore") {
            if (ignoredEmails.length < maxIgnores) {
                setIgnoredEmails([...ignoredEmails, currentEmail]);
                setCurrentEmail(generateEmail());
            } else {
                alert("Maximum ignored emails reached. Remove one to continue.");
            }
        }
    };

    const handleLoginSubmit = ({ username, password }) => {
        const storedUsername = Cookies.get("username");
        const storedPassword = Cookies.get("password");
        if (currentEmail.isPhishing) {
            Game.playSound("error");
            setGameOverMessage("Game Over! You entered credentials for a credential stealer.");
            setGameOver(true);
        } else {
            if (username === storedUsername && password === storedPassword) {
                Game.playSound("success");
                setScore(score + 5);
            } else {
                Game.playSound("error");
                setScore(score - 5);
            }
            setShowLoginForm(false);
            setCurrentEmail(generateEmail());
        }
    };

    const handleReportFromLogin = () => {
        if (currentEmail.isPhishing) {
            Game.playSound("success");
            setScore(score + 10);
        } else {
            Game.playSound("error");
            setScore(score - 5);
        }
        setShowLoginForm(false);
        setCurrentEmail(generateEmail());
    };

    const handleRemoveIgnored = (index) => {
        const updatedIgnored = ignoredEmails.filter((_, i) => i !== index);
        setIgnoredEmails(updatedIgnored);
    };

    const resetGame = () => {
        setCurrentEmail(generateEmail());
        setScore(0);
        setGameOver(false);
        setGameOverMessage("");
        setShowLoginForm(false);
        setIgnoredEmails([]);
    };

    return (
        <div className="game-container">
            {!isOnline && <p>Offline Mode</p>}
            <IgnoredEmails ignoredEmails={ignoredEmails} onRemove={handleRemoveIgnored} />
            <Scoreboard score={score} />
            {gameOver ? (
                <section>
                    <h2>{gameOverMessage}</h2>
                    <button onClick={resetGame}>Play Again</button>
                </section>
            ) : showLoginForm ? (
                <LoginForm onSubmit={handleLoginSubmit} onReport={handleReportFromLogin} />
            ) : (
                <EmailCard email={currentEmail} onDecision={handleDecision} />
            )}
        </div>
    );
};

export default GameContainer;