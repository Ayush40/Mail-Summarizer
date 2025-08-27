import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './components/pages/HomePage';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import AuthCallback from './components/AuthCallback';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Start Google OAuth flow
  const handleAuth = async () => {
    const res = await axios.get('http://localhost:4000/auth-url');
    window.location.href = res.data.url;
  };

  // Log out user
  const handleLogout = () => {
    setAccessToken('');
    setUser(null);
    setSummaries([]);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Get user profile from Google with access token
  const getUserProfile = async (token) => {
    try {
      const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      return null;
    }
  };

  // Summarize emails using backend
  const summarizeEmails = async (token) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/summarize-emails', { access_token: token });
      setSummaries(res.data.summary || []);
    } catch (err) {
      if (err.response?.status === 429) alert('Too many requests. Please wait.');
      else if (err.response?.status === 401) handleLogout();
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      const storedT = localStorage.getItem('accessToken');
      const storedU = localStorage.getItem('user');

      // Already logged in
      if (storedT && storedU) {
        setAccessToken(storedT);
        setUser(JSON.parse(storedU));
        await summarizeEmails(storedT);
      }
      // Just authenticated via Google
      else if (code) {
        try {
          const { data } = await axios.post('http://localhost:4000/exchange-token', { code });
          const token = data.access_token;
          localStorage.setItem('accessToken', token);
          setAccessToken(token);

          const profile = await getUserProfile(token);
          if (profile) {
            localStorage.setItem('user', JSON.stringify(profile));
            setUser(profile);
          }
          await summarizeEmails(token);
          window.history.replaceState({}, document.title, '/');
        } catch {
          handleLogout();
        }
      }
    };
    init();
    // eslint-disable-next-line
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      summarizeEmails(accessToken);
    }, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, [accessToken]);

  // Refresh on window/tab focus
  useEffect(() => {
    if (!accessToken) return;
    const onFocus = () => summarizeEmails(accessToken);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [accessToken, user]);

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-900 text-white pt-20 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  accessToken={accessToken}
                  loading={loading}
                  summaries={summaries}
                  onLoginClick={handleAuth}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
