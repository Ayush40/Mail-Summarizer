const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

function extractPlainText(payload) {
  if (!payload) return '';
  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf8');
  }
  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const text = extractPlainText(part);
      if (text) return text;
    }
  }
  return '';
}

// --- Gemini retry wrapper ---
async function summarizeWithRetry(prompt, retries = 3) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const instruction = `
You are a smart email assistant. Given grouped email text by sender, return valid JSON using this format:
{
  "summaries": [
    {
      "sender": "Sender Name",
      "category": "Topic/Category (e.g. Updates, Promotions, Urgent, Social, etc.)",
      "priority": "High/Medium/Low",
      "points": ["summary point 1", "summary point 2", ...]
    }
  ]
}
Prioritize based on urgency or importance (urgent topics, deadlines, action required = High; general info or newsletters = Low).
Only return valid JSON.
`;

  const fullPrompt = `${instruction}\n\n${prompt}`;

  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(fullPrompt);
      const text = await result.response.text();

      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      const json = text.slice(start, end + 1);

      const parsed = JSON.parse(json);
      return parsed.summaries;
    } catch (err) {
      if ((err.response?.status === 429 || err.status >= 500) && i < retries - 1) {
        const delay = 1000 * Math.pow(2, i);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('❌ Gemini retry failed:', err.message);
        throw err;
      }
    }
  }
  throw new Error('Gemini API call failed after retries.');
}

// --- Google Auth URL ---
app.get('/auth-url', (req, res) => {
  const redirect_uri = 'http://localhost:5173/auth/callback';
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ].join(' ');

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
  res.json({ url });
});

// --- Token exchange ---
app.post('/exchange-token', async (req, res) => {
  const { code } = req.body;
  const redirect_uri = 'http://localhost:5173/auth/callback';

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri,
      grant_type: 'authorization_code',
    });

    res.json(tokenRes.data);
  } catch (err) {
    console.error('Token exchange failed:', err.response?.data || err.message);
    res.status(400).json({ error: 'Token exchange failed' });
  }
});

// --- Summarize today's emails ---
app.post('/summarize-emails', async (req, res) => {
  const { access_token } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const afterEpoch = Math.floor(today.getTime() / 1000);

    // Fetch emails after today's midnight
    const listRes = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
      headers: { Authorization: `Bearer ${access_token}` },
      params: { q: `after:${afterEpoch}` },
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) {
      return res.json({ summary: [] }); // <-- No emails today
    }

    const emails = [];
    for (const msg of messages) {
      const detailRes = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const headers = detailRes.data.payload.headers;
      const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';

      let body = extractPlainText(detailRes.data.payload);
      if (!body) body = detailRes.data.snippet || '';

      emails.push({ from, snippet: body });
    }

    // Group by sender
    const grouped = {};
    for (const { from, snippet } of emails) {
      const sender = from.split('<')[0].trim();
      if (!grouped[sender]) grouped[sender] = [];
      grouped[sender].push(snippet);
    }

    const prompt = Object.entries(grouped)
      .map(([sender, msgs]) => `From: ${sender}\n${msgs.join('\n\n---\n\n')}`)
      .join('\n\n==========\n\n');

    const summaries = await summarizeWithRetry(prompt);
    res.json({ summary: summaries });

  } catch (err) {
    console.error('Summarization failed:', err.response?.data || err.message);
    if (err.response?.status === 401) return res.status(401).json({ error: 'Unauthorized' });
    if (err.response?.status === 429) return res.status(429).json({ error: 'Too many requests' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(4000, () => console.log('✅ Server running at http://localhost:4000'));
