import React from "react";

const IgnoredEmails = ({ ignoredEmails, onRemove }) => (
    <aside className="ignored-emails">
        <h3>Ignored Emails ({ignoredEmails.length})</h3>
        {ignoredEmails.length === 0 ? (
            <p>No ignored emails.</p>
        ) : (
            <ul>
                {ignoredEmails.map((email, index) => (
                    <li key={index}>
                        {email.subject}
                        <button onClick={() => onRemove(index)}>Remove</button>
                    </li>
                ))}
            </ul>
        )}
    </aside>
);

export default IgnoredEmails;