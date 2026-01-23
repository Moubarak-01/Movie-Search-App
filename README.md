# 🎬 Movie Search App

<div align="center">
  <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React.js" />
  <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="Appwrite" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
</div>

<br/>

A modern, premium movie discovery platform that bridges the gap between searching for content and actually watching it. Built with React 19, Tailwind v4, and powered by TMDB API and Appwrite, this application provides intelligent routing to multiple streaming sources, robust personalization, and a visually stunning "Space Dark" aesthetic.

---

## 📖 Overview

The Movie Search App solves a common problem: finding where to watch your favorite movies and anime without the hassle. It combines a beautiful, responsive interface with smart features like personalized favorites, watch history, and AI-driven recommendations.

### Key Highlights

🎯 **Smart Streaming Selection** - Auto-detects Anime vs. Movies and routes to the best source (HiAnime, Nkiri).  
❤️ **Personalization** - "Favorites" and "Watch History" that persist across sessions.  
🧠 **Smart Recommendations** - "You might also like" suggestions for every movie.  
📱 **Universal Design** - Flawless experience on both Mobile (Bottom Nav) and Desktop (Top Nav).  
⚡ **Performance** - Debounced search, lazy-loaded images, and skeleton states.  
🌑 **Premium Dark Theme** - Immersive space-themed background.

---

## 📸 Screenshots

<div align="center">
  <img src="preview 1.png" alt="Movie Search App Screenshot 1" width="300"/>  
  <img src="preview 2.png" alt="Movie Search App Screenshot 2" width="300"/>  
  <img src="preview 3.png" alt="Movie Search App Screenshot 3" width="300"/>  
</div>

---

## ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19.2** | UI library with Hooks and Functional Components |
| **Vite 7.1** | Next-generation frontend tooling |
| **Tailwind CSS 4.1** | Utility-first CSS framework for styling |
| **Appwrite 21.3** | Backend-as-a-Service for Trending Movies data |
| **TMDB API** | Movie metadata, posters, trailers, and recommendations |
| **react-use** | Essential hooks utility library |
| **framer-motion** | Smooth animations and transitions |

---

## 🔋 Features

### 🔍 Search & Discovery
- **Real-time Search**: Debounced input (500ms) for efficient API usage.
- **Rich Metadata**: Displays posters, ratings (⭐), release years, and languages.
- **Loading States**: Shimmering skeletons for a perceived faster load time.

### 👤 Personalization (New!)
- **Favorites System**: Heart (<3) any movie to save it to your personal "Favorites" list.
- **Watch History**: Automatically tracks the last 20 movies you've viewed.
- **Persisted Data**: Your data is saved via `localStorage`, so it's there when you return.

### 🎭 Smart Movie Modal
Click any movie to reveal a feature-rich modal:
- **Streaming Options**: Direct links to **HiAnime** (for anime) or **Nkiri** (for movies).
- **Trailers**: Embedded YouTube trailer player.
- **Recommendations**: A horizontal carousel of similar movies.
- **Actions**: Add to Favorites, view full plot, see popularity stats.

### 📱 Responsive & Adaptive UI
The app adapts its navigation based on the device:
- **Mobile**: Sticky Bottom Navigation Bar (Home, Search, Favorites).
- **Desktop**: Sleek Top Navigation menu.
- **Gestures**: Swipe-to-dismiss support for modals on mobile.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- TMDB API Key (Free)
- Appwrite Project (Optional, for Trending feature)

### 1. Clone & Install
```bash
git clone https://github.com/Moubarak-01/Movie-Search-App-.git
cd Movie-Search-App-
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` to see the app in action!

---

## 🎯 Architecture

### Project Structure
```
src/
├── components/        # Reusable UI components
│   ├── MovieCard.jsx
│   ├── MovieDetailsModal.jsx
│   ├── BottomNav.jsx  # Mobile Navigation
│   └── ...
├── hooks/             # Custom React Hooks
│   ├── useFavorites.js
│   ├── useWatchHistory.js
│   └── usePullToRefresh.js
├── App.jsx            # Main Application Layout
├── appwrite.js        # Backend Logic
├── index.css          # Tailwind & Global Styles
└── main.jsx           # Entry Point
```

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Moubarak**  
- GitHub: [@Moubarak-01](https://github.com/Moubarak-01)  
- Project Link: [Movie Search App](https://github.com/Moubarak-01/Movie-Search-App)

---

## 🙏 Acknowledgments

- **TMDB API** for the incredible movie database.
- **Appwrite** for the seamless backend integration.
- **HiAnime & Nkiri** for streaming capabilities.
