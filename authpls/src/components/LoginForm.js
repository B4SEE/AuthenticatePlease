import React, { useState } from "react";

const LoginForm = ({ onSubmit, onReport }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username && password) {
            onSubmit({ username, password });
        }
    };

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g., player@example.com"
                        autoFocus
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        minLength="6"
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            <button onClick={onReport}>Report</button>
        </section>
    );
};

export default LoginForm;