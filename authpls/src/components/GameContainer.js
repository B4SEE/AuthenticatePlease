import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import EmailCard from "./EmailCard";
import LoginForm from "./LoginForm";
import Scoreboard from "./Scoreboard";
import IgnoredEmails from "./IgnoredEmails";
import { generateEmail } from "../data/emailGenerator";

// Preload audio files
const audioFiles = {
    success: new Audio('/sounds/success.mp3'),
    error: new Audio('/sounds/error.mp3')
};

// Debug log for audio loading
console.log('Audio files initialized:', {
    success: {
        readyState: audioFiles.success.readyState,
        src: audioFiles.success.src
    },
    error: {
        readyState: audioFiles.error.readyState,
        src: audioFiles.error.src
    }
});

// Initialize audio files
Object.values(audioFiles).forEach(audio => {
    audio.load();
    audio.volume = 0.5;
    
    // Add load event listeners
    audio.addEventListener('loadeddata', () => {
        console.log('Audio loaded:', audio.src);
    });
    
    audio.addEventListener('error', (e) => {
        console.error('Audio load error:', audio.src, e);
    });
});

const Game = {
    playSound: (type) => {
        try {
            const audio = audioFiles[type];
            if (audio) {
                console.log(`Attempting to play ${type} sound...`);
                // Reset the audio to start
                audio.currentTime = 0;
                // Play the sound with error handling
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log(`${type} sound played successfully`);
                        })
                        .catch(error => {
                            console.warn(`Sound playback failed: ${error}`);
                        });
                }
            }
        } catch (error) {
            console.warn(`Error playing sound: ${error}`);
        }
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

    // Add effect to initialize audio after user interaction
    useEffect(() => {
        const initializeAudio = () => {
            console.log('Initializing audio after user interaction...');
            Object.values(audioFiles).forEach(audio => {
                audio.load();
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            audio.pause();
                            audio.currentTime = 0;
                            console.log('Audio initialized successfully');
                        })
                        .catch(error => {
                            console.warn('Audio initialization failed:', error);
                        });
                }
            });
            // Remove the event listener after first interaction
            document.removeEventListener('click', initializeAudio);
        };

        document.addEventListener('click', initializeAudio);
        return () => document.removeEventListener('click', initializeAudio);
    }, []);

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

    // Test function for sound
    const testSound = () => {
        console.log('Testing sounds...');
        Game.playSound('success');
        setTimeout(() => Game.playSound('error'), 1000);
    };

    return (
        <div className="game-container">
            {!isOnline && <p>Offline Mode</p>}
            <div className="debug-controls" style={{ marginBottom: '1rem' }}>
                <button 
                    onClick={testSound}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#4a5568',
                        color: 'white',
                        borderRadius: '0.25rem',
                        marginBottom: '1rem'
                    }}
                >
                    Test Sounds
                </button>
            </div>
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