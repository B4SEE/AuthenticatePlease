import React from "react";

const EmailCard = ({ email, onDecision }) => {
    return (
        <article className="email-card">
            <svg
                width="20"
                height="20"
                onClick={() => onDecision("ignore")}
                onMouseOver={(e) => e.currentTarget.querySelector("circle").setAttribute("fill", "blue")}
                onMouseOut={(e) => e.currentTarget.querySelector("circle").setAttribute("fill", "gray")}
            >
                <circle cx="10" cy="10" r="10" fill="gray" />
            </svg>
            <h3>{email.subject}</h3>
            <p>From: {email.from}</p>
            <p>{email.body}</p>
            <div>
                <button onClick={() => onDecision("allow")}>Allow</button>
                <button onClick={() => onDecision("report")}>Report</button>
            </div>
        </article>
    );
};

export default EmailCard;