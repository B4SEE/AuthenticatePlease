import React from "react";

const IgnoredEmails = ({ ignoredEmails, onReport, onAllow }) => (
    <aside className="ignored-emails bg-gray-800 p-4 rounded-lg mt-8">
        <h3 className="text-xl text-[#5FFBF1] mb-4">Ignored Emails ({ignoredEmails.length})</h3>
        {ignoredEmails.length === 0 ? (
            <p className="text-gray-400">No ignored emails.</p>
        ) : (
            <ul className="space-y-4">
                {ignoredEmails.map((email) => (
                    <li key={email.id} className="bg-gray-700 p-4 rounded">
                        <div className="mb-2">
                            <div className="font-semibold">{email.subject}</div>
                            <div className="text-sm text-gray-400">From: {email.from}</div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onReport(email)}
                                className="flex-1 bg-[#FF3366] text-[#0A192F] py-2 rounded shadow-md hover:bg-[#E52A59] transition"
                            >
                                Report (5pts)
                            </button>
                            <button
                                onClick={() => onAllow(email)}
                                className="flex-1 bg-[#64FFDA] text-[#0A192F] py-2 rounded shadow-md hover:bg-[#52E9C2] transition"
                            >
                                Allow (5pts)
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </aside>
);

export default IgnoredEmails;