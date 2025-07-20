import React, { useEffect, useState } from 'react';
import { FaReact, FaNodeJs, FaEnvelopeOpenText, FaGoogle } from "react-icons/fa";

const highlights = [
    {
        icon: <FaEnvelopeOpenText className="text-indigo-700 text-xl" />,
        bg: "bg-indigo-200",
        label: "Automatic email fetching & summarization for the current day"
    },
    {
        icon: <FaGoogle className="text-green-700 text-xl" />,
        bg: "bg-green-200",
        label: "Integration with Gmail API & Google OAuth for secure access"
    },
    {
        icon: <FaReact className="text-blue-700 text-xl" />,
        bg: "bg-blue-200",
        label: "Modern and responsive UI built with React.js & Tailwind CSS"
    },
    {
        icon: <FaNodeJs className="text-lime-700 text-xl" />,
        bg: "bg-lime-200",
        label: "Robust backend with Node.js, Express, and API integration"
    },
    {
        icon: (
            <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m6.364 1.636l-1.414 1.414m4.243 4.243h-2M3 12H1m4.222-4.222l1.415 1.414M3 21h18a2 2 0 002-2v-7a2 2 0 00-2-2H3a2 2 0 00-2 2v7a2 2 0 002 2z" />
            </svg>
        ),
        bg: "bg-purple-200",
        label: "Summarization via Gemini API for best-in-class insights"
    },
];

export default function About() {
    const [show, setShow] = useState(highlights.map(() => false));

    useEffect(() => {
        highlights.forEach((_, i) => {
            setTimeout(() => {
                setShow(s => {
                    const updated = [...s];
                    updated[i] = true;
                    return updated;
                });
            }, i * 350);
        });
    }, []);

    return (
        <main>
            <section className="w-full max-w-4xl bg-gradient-to-br from-blue-900 via-blue-800/40 to-indigo-900 rounded-xl shadow-xl p-10">
                <h1 className="text-4xl font-bold mb-3 text-indigo-400 text-center drop-shadow-lg">
                    About Gmail Summarizer
                </h1>
                <p className="text-xl mb-10 text-gray-300 text-center px-4">
                    Gmail Summarizer connects to your Gmail account, fetches your latest emails, and provides easy-to-understand AI summaries so you never miss what's important.
                </p>
                <h2 className="text-2xl font-semibold mb-5 text-center">Project Highlights</h2>
                <ul className="grid gap-6 w-full">
                    {highlights.map((item, i) => (
                        <li
                            key={i}
                            className={`
                flex items-center gap-4 rounded-2xl px-6 py-4 bg-gray-800/70
                shadow-md border border-gray-700
                transform transition-all duration-700
                ${show[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
                            style={{ transitionDelay: `${i * 100 + 200}ms` }}
                        >
                            <span className={`inline-block p-3 rounded-full ${item.bg}`}>
                                {item.icon}
                            </span>
                            <span className="text-lg text-gray-100">{item.label}</span>
                        </li>
                    ))}
                </ul>

            </section>
        </main>
    );
}
