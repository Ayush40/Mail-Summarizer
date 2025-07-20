import { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryList from './components/SummaryList';
import Navbar from './components/Navbar';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuth = async () => {
    const res = await axios.get('http://localhost:4000/auth-url');
    window.location.href = res.data.url;
  };

  const handleLogout = () => {
    setAccessToken('');
    setUser(null);
    setSummaries([]);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getUserProfile = async (token) => {
    try {
      const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
      return null;
    }
  };

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

      if (storedT && storedU) {
        setAccessToken(storedT);
        setUser(JSON.parse(storedU));
        await summarizeEmails(storedT);
      } else if (code) {
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
  }, []);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-900 text-white pt-20 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {!accessToken ? (
            <div className="text-center space-y-6">
              <img
                src="/mail.png"
                className="w-28 h-28 mx-auto rounded-full"
                alt="AI Mail"
              />
              <h2 className="text-2xl font-bold">Welcome to Gmail Summarizer</h2>
              <button
                onClick={handleAuth}
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Login with Google
              </button>
            </div>
          ) : (
            <>
              {loading && !summaries.length ? (
                <div className="flex flex-col items-center space-y-4 py-12">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg text-center">Summarizing today’s emails...</p>
                </div>
              ) : summaries.length > 0 ? (
                <SummaryList summaries={summaries} />
              ) : (
                <p>No emails found today.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

}

export default App;
