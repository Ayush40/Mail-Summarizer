import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

// Optional: Replace with your favorite SVG, JPEG, or a better gradient for extra visual effect!
const Background = () => (
    <div
        aria-hidden
        className="fixed inset-0 z-0 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800/80 to-blue-900 blur-sm"
        style={{
            background:
                "radial-gradient(circle at 10% 20%, rgba(129,140,248,0.30) 0%, rgba(167,139,250,0.30) 60%,rgba(59,130,246,0.20) 100%)",
            // You could also add backgroundImage for SVG blobs or subtle noise.
        }}
    />
);

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState(null);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("Sending...");
        setTimeout(() => {
            setStatus("Thank you! We'll get back to you soon.");
            setForm({ name: "", email: "", message: "" });
        }, 1200);
    };

    return (
        <main className="relative bg-gray-900 min-h-screen flex items-center justify-center px-4 py-16">
            <Background />
            <section className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-2xl border border-white/30 ring-1 ring-white/30">
                {/* Info Section */}
                <div className="md:w-1/2 p-8 flex flex-col bg-white/30 bg-clip-padding backdrop-blur-lg text-black">
                    <h2 className="text-3xl font-extrabold mb-2">Contact Us</h2>
                    <p className="mb-8 text-gray-700">
                        We'd love to hear from you! Fill up the form or contact us directly.
                    </p>
                    <ul className="space-y-4 mb-8 text-black font-medium">
                        <li className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-xl" />
                            <span>Delhi, India</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaPhoneAlt className="text-xl" />
                            <span>+91 0000000000</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <FaEnvelope className="text-xl" />
                            <span>support@gmail.com</span>
                        </li>
                    </ul>
                    <div className="rounded-xl overflow-hidden shadow-lg mt-auto">
                        <iframe
                            title="map"
                            className="w-full h-36 border-0"
                            src="https://maps.google.com/maps?q=Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </div>
                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="md:w-1/2 bg-white/30 bg-clip-padding backdrop-blur-lg flex flex-col justify-center p-8"
                >
                    <h3 className="text-2xl font-semibold mb-5 text-black">Send a Message</h3>
                    <div className="mb-4">
                        <label className="block font-medium mb-2 text-gray-800">Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="Your name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/60 text-black placeholder-gray-500 border border-white/40 shadow focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-2 text-gray-800">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/60 text-black placeholder-gray-500 border border-white/40 shadow focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-2 text-gray-800">Message</label>
                        <textarea
                            name="message"
                            required
                            rows={5}
                            placeholder="Type your message…"
                            value={form.message}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/60 text-black placeholder-gray-500 border border-white/40 shadow focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white font-bold text-lg shadow-md hover:bg-gray-700 transition"
                    >
                        Send Message
                    </button>
                    {status && (
                        <div className="mt-4 text-center text-blue-800 font-medium">{status}</div>
                    )}
                </form>
            </section>
        </main>
    );
}
