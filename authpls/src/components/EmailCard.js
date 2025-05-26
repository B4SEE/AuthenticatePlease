import React from "react";

const EmailCard = ({ email, onDecision }) => {
    return (
        <article className="email-card">
            <h3>{email.subject}</h3>
            <p>From: {email.from}</p>
            <p>{email.body}</p>
            <div>
                <button onClick={() => onDecision("allow")}>Allow</button>
                <button onClick={() => onDecision("report")}>Report</button>
                <button onClick={() => onDecision("ignore")}>Ignore</button>
            </div>
        </article>
    );
};

export default EmailCard;