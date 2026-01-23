# 🎬 Movie Search App
<div align="center">
  <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React.js" />
  <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="Appwrite" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="Tailwind CSS" />
</div>

<br/>

A modern, responsive movie discovery platform that bridges the gap between searching for content and actually watching it. Built with React, Tailwind CSS, and powered by TMDB API and Appwrite, this application provides intelligent routing to multiple streaming sources based on content type and user device.

---

## 📖 Overview

The Movie Search App solves a common problem: finding where to watch your favorite movies and anime. Instead of just showing you information about a movie, it intelligently routes you to the best streaming platform based on what you're watching and what device you're using.

### Key Highlights

🎯 **Smart Streaming Selection** - Different options for anime vs. regular movies  
📱 **Mobile-First Design** - Optimized for both desktop and mobile experiences  
🔥 **Real-Time Trending** - Track what others are searching for via Appwrite database  
⚡ **Lightning Fast** - Debounced search with Vite's blazing-fast HMR  
🌐 **Deep Linking** - Native app integration for mobile anime streaming

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
| **React 19.2** | UI framework with hooks and component architecture |
| **Vite 7.1** | Lightning-fast development server and build tool |
| **Tailwind CSS 4.1** | Utility-first CSS framework for rapid UI development |
| **Appwrite 21.3** | Backend-as-a-Service for trending movie tracking |
| **TMDB API** | Comprehensive movie database with posters and metadata |
| **react-use** | Collection of essential React hooks (debouncing) |

---

## 🔋 Features

### 🔍 Search & Discovery
- **Real-time Search**: Debounced search with 500ms delay to optimize API calls
- **Dynamic Results**: Fetches movie posters, ratings, languages, and release years from TMDB
- **Loading States**: Smooth spinner animations during data fetching
- **Error Handling**: User-friendly error messages for failed requests

### 🎭 Smart Movie Modal
Click any movie card to open a detailed modal featuring:
- High-resolution poster display
- Movie title, rating (⭐), language, and release year
- Full plot overview and synopsis
- Popularity metrics and vote count
- **Streaming source selection** based on content type

### 🌊 Intelligent Streaming Routing

The app detects content type (Anime vs. Regular Movies) and device (Desktop vs. Mobile) to provide optimized streaming options:

**For Anime Content:**
- **HiAnime** - Clean, modern anime streaming platform
- **Nkiri** - Web-based fallback option
- **Anilab App** (Mobile Only) - Native Android/iOS app via deep linking

**For Regular Movies:**
- **Nkiri** - Direct web streaming

**How It Works:**
1. Detects if `original_language === 'ja'` (Japanese)
2. Checks for Animation genre (genre_id: 16)
3. Shows multiple streaming options if anime, single option otherwise
4. On mobile, adds deep linking to launch native apps

### 📊 Trending Movies
- Powered by Appwrite database tracking search frequency
- Displays top 10 most-searched movies
- Auto-updates when users search for movies
- Falls back to TMDB's weekly trending if database is empty
- Horizontal scrollable list with large ranking numbers

### 📱 Responsive Design
- **Mobile**: Optimized touch targets, smooth scrolling
- **Tablet**: 2-3 column grid layouts
- **Desktop**: 4-column grid with hover effects
- All interactions are touch-friendly with proper spacing

---

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── MovieCard.jsx          # Individual movie card component
│   ├── MovieDetailsModal.jsx  # Detailed view with streaming options
│   ├── Search.jsx             # Search input with icon
│   └── Spinner.jsx            # Loading indicator
├── App.jsx                    # Main app logic and state management
├── appwrite.js                # Appwrite configuration and helpers
├── index.css                  # Global styles and Tailwind configuration
└── main.jsx                   # Application entry point
```

### State Management

The app uses React's built-in state management:
- `searchTerm` - Current search input
- `debouncedSearchTerm` - Debounced version to reduce API calls
- `movieList` - Array of movies from TMDB search
- `trendingMovies` - Top searched movies from Appwrite
- `selectedMovie` - Currently selected movie for modal
- `isLoading` - Loading state for UI feedback
- `errorMessage` - Error state for user notifications

### Data Flow

```
User Input → Debounce (500ms) → TMDB API → Movie List → UI Update
                                       ↓
                              Appwrite Database (Track Search Count)
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- TMDB API account
- Appwrite project (optional, for trending feature)

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

**TMDB API Key** (Required)
```
TMDB_API_KEY
```
[Get Key](https://www.themoviedb.org/documentation/api)

**Appwrite Configuration** (Optional - for trending movies)
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

The app will be available at `http://localhost:5173/`

---

## 🎯 Usage Guide

### Searching for Movies
1. Enter a movie or anime title in the search bar
2. Results appear automatically after 500ms (debounced)
3. Scroll through the movie grid
4. Click any movie card for detailed information

### Viewing Movie Details
1. Click on any movie card
2. View full plot, ratings, and metadata
3. Select a streaming source based on your preference
4. Click "Watch" to be redirected to the streaming platform

### Trending Movies
- Located near the top of the page
- Horizontal scrollable list with rankings
- Click any trending movie to view details
- Updates automatically as users search

---

## 🔧 API Integration

### TMDB API

**Endpoints Used:**
- `/search/movie` - Search for movies by title
- `/discover/movie` - Get popular movies on page load
- `/trending/movie/week` - Fallback for trending section

**Data Retrieved:**
- Movie title, poster path, overview
- Vote average, vote count, popularity
- Release date, original language
- Genre IDs for anime detection

### Appwrite Database

**Collection Schema:**
```javascript
{
  searchTerm: string,
  count: number,
  movie_id: number,
  poster_url: string
}
```

**Operations:**
- `updateSearchCount()` - Increment search count or create new entry
- `getTrendingMovies()` - Fetch top 10 by count (descending)

---

## 🐛 Troubleshooting

### Movies Not Loading
- **Check API Key**: Ensure `VITE_TMDB_API_KEY` is set in `.env`
- **Restart Dev Server**: Changes to `.env` require a server restart
- **Check Console**: Open browser DevTools to see error messages
- **Verify Network**: Some networks block TMDB API requests

### Trending Section Empty
- **Setup Appwrite**: The trending feature requires Appwrite configuration
- **Check Database**: Ensure the collection exists and has proper permissions
- **Fallback**: The app will use TMDB's trending if Appwrite fails

### Modal Not Opening
- **Check Console**: Look for JavaScript errors
- **Verify Data**: Ensure the movie object has all required fields
- **Clear Cache**: Try clearing browser cache and reloading

---

## 🗺️ Roadmap

### Planned Features
- [ ] **Advanced Filters** - Genre, year, rating filters
- [ ] **User Favorites** - Save movies to a watchlist
- [ ] **Watch History** - Track what you've clicked
- [ ] **Dark/Light Mode** - Theme switcher
- [ ] **Movie Trailers** - Embedded YouTube previews
- [ ] **Recommendations** - "More like this" suggestions

### Mobile Optimizations (In Planning)
- [ ] Swipe-to-dismiss modal
- [ ] Bottom sheet modal style
- [ ] Pull-to-refresh trending
- [ ] 2-column grid on mobile
- [ ] Horizontal genre chips
- [ ] Lazy loading images
- [ ] Skeleton loading screens

See [implementation_plan.md](.gemini/antigravity/brain/71e9e48f-46e8-4859-9996-fd283a317400/implementation_plan.md) for detailed mobile optimization plans.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style (ESLint configuration)
- Write meaningful commit messages
- Update documentation if adding new features
- Test on both mobile and desktop before submitting

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Moubarak**

- GitHub: [@Moubarak-01](https://github.com/Moubarak-01)
- Project Link: [Movie Search App](https://github.com/Moubarak-01/Movie-Search-App)

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the comprehensive movie database API
- [Appwrite](https://appwrite.io/) for backend infrastructure
- [HiAnime](https://hianime.to/) and [Nkiri](https://thenkiri.com/) for streaming services
- [Anilab](https://anilab.to/) for mobile anime streaming
