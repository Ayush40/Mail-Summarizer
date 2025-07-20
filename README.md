# 📬 Mail Summarizer

Summarize today's Gmail inbox with **sender-wise key points** using **Google Mail API** and **Gemini Pro**. Built with a clean, animated UI in **React + Tailwind**, powered by a secure Node.js backend.

---

## 🔗 Live Demo

> 

---

## 🧠 Features

- 🔐 Google OAuth (Gmail access with secure login)
- 📩 Fetches all emails from **today**
- 🤖 Summarizes sender-wise emails using **Gemini API**
- 🔁 Refresh button for real-time summaries
- 🎨 Responsive animated frontend using React + Tailwind
- 🧪 Gemini retry logic for stable summaries

---

## 🛠️ Tech Stack

### 💻 Frontend
<p>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" width="40" />
  <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="40" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" />
  <img src="https://www.vectorlogo.zone/logos/vitejs/vitejs-icon.svg" width="40" />
</p>

### 🖥️ Backend
<p>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="40" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" width="40" />
  <img src="https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg" width="40" />
</p>

---

Certainly! Here’s your improved and formatted **.env Configuration** and **Run Locally** instructions:

## 🔐 .env Configuration

Create a `.env` file in your project root for the **backend**, and a `frontend/.env` file for the **frontend (Vite)**.

### Frontend (`frontend/.env`)

```env
# Vite
VITE_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
```

### Backend (`.env` in root or backend directory)

```env
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

## 🚀 Run Locally

Follow these steps to run the project on your machine:

### 1. Clone the repository

```bash
git clone https://github.com/Ayush40/Mail_Summarizer.git
cd Mail_Summarizer
```

### 2. Backend Setup

```bash
cd backend
npm install
node index.js
```

### 3. Frontend Setup

Open a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to:

```
http://localhost:5173
```

## 🙌 Contributing

Pull Requests and suggestions are welcome!  
Please open issues for bugs, features, or improvements.
