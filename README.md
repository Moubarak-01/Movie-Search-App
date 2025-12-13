# 🎬 Movie Search App
<div align="center">
  <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React.js" />
  <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="Appwrite" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
</div>


A responsive React app that allows users to search for movies, view details via a smart modal, and dynamically route to watch sources. Built with Tailwind CSS, Appwrite, and deployed on Vercel.  

---

## 📸 Screenshots
<div align="center">
<img src="preview 1.png" alt="Movie Search App Screenshot 1" width="300"/>  
<img src="preview 2.png" alt="Movie Search App Screenshot 2" width="300"/>  
<img src="preview 3.png" alt="Movie Search App Screenshot 3" width="300"/>  
</div>

---

## ⚙️ Tech Stack

- **React.js** – Build reusable UI components and manage state efficiently.  
- **Tailwind CSS** – Utility-first framework for fast, responsive design.  
- **Appwrite** – Backend-as-a-Service for authentication, databases, and storage.  
- **Vite** – Fast development server and optimized build tool.  
- **TMDB API** – Fetch dynamic movie data and posters.

---

## 🔋 Features

- **Search & Discovery:** Search for any movie and view its poster dynamically.
- **Smart Movie Modal:** Click any card to view full details, ratings, and plot overview.
- **Intelligent Traffic Control:** Automatically routes users to the best viewing source based on their device:
  - **Desktop:** Redirects to **Nkiri** (Web).
  - **Mobile (Anime):** Uses **Deep Linking** to launch the **Anilab App** directly.
  - **Mobile (Movies):** Fallback to web for standard content.
- **App Integration:** Supports Android Intent handling to detect if external apps are installed.
- **Trending Movies:** Real-time trending list powered by Appwrite database.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.

---

## 🤸 Quick Start (Run Locally)

> ⚠️ **Important:** You must have proper API keys for the app to work locally. Follow the steps below carefully.

### Prerequisites

- [Node.js](https://nodejs.org/en/)  
- [npm](https://www.npmjs.com/)  
- [Git](https://git-scm.com/)  
- **TMDB API Key:** Register at [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api) to get your API key.  
- **Appwrite Project:** Set up a free Appwrite project at [https://appwrite.io](https://appwrite.io) and create a database + collection.

### Steps

1. Clone the repository:

```bash
git clone [https://github.com/Moubarak-01/Movie-Search-App-](https://github.com/Moubarak-01/Movie-Search-App-)  
Install dependencies:

Bash

npm install
Set up environment variables:

Create a .env or .env.local file in the root directory and add:

Code snippet

VITE_TMDB_API_KEY=your_tmdb_api_key  
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id  
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id  
VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id  
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
⚠️ Make sure you replace all placeholders with your actual API keys. The app won't work without them.