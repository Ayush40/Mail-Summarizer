import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white/10 backdrop-blur-md text-white px-4 py-3 shadow-md fixed w-full z-10">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                {/* Left - Logo */}
                <div className="text-2xl font-bold">📬 Gmail Summarizer</div>

                {/* Center - Links */}
                <div className="hidden md:flex space-x-8 text-sm">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/about" className="hover:underline">About Us</Link>
                    <Link to="/contact" className="hover:underline">Contact Us</Link>
                </div>

                {/* Right - User Dropdown */}
                <div className="flex items-center space-x-4">
                    {user && (
                        <div className="relative">
                            <span
                                onClick={() => setOpen(!open)}
                                className="cursor-pointer text-sm hover:underline"
                            >
                                Hi, {user.name.split(' ')[0]}
                            </span>

                            {open && (
                                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 text-sm font-medium">
                                        {user.name}
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
