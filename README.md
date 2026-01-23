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
  - **Anime (All Devices):** Offers a choice between **HiAnime** and **Nkiri**.
  - **Mobile (Anime):** Adds an option to launch the **Anilab App** directly via Deep Linking.
  - **Mobile (Movies):** Fallback to web for standard content.
- **App Integration:** Supports Android Intent handling to detect if external apps are installed.
- **Trending Movies:** Real-time trending list powered by Appwrite database.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Moubarak-01/Movie-Search-App-.git
cd Movie-Search-App-
```

### 2. Install Dependencies
```bash
npm install
```

### Required API Keys

```
TMDB_API_KEY
```
[Get Key](https://www.themoviedb.org/documentation/api)

```
APPWRITE_PROJECT_ID
APPWRITE_DATABASE_ID
APPWRITE_COLLECTION_ID
APPWRITE_ENDPOINT
```
[Get Keys](https://appwrite.io)

Create a `.env` or `.env.local` file in the root directory and paste the following:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key  
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id  
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id  
VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id  
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
```

### 5. Start the Application
```bash
npm run dev
```
