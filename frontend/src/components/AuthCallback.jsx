import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // In App.jsx, useEffect already handles '?code=...' flow.
        // Here we just redirect to '/' after a short delay for a smoother UX.
        const timer = setTimeout(() => {
            navigate("/");
        }, 1500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-xl mb-2">Processing login...</div>
            <div className="loader" />
        </div>
    );
}
