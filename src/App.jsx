import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import MovieDetailsModal from './components/MovieDetailsModal.jsx'
import MovieCardSkeleton from './components/MovieCardSkeleton.jsx'
import BottomNav from './components/BottomNav.jsx'
import FilterMenu from './components/FilterMenu.jsx'
import { useDebounce } from 'react-use'
import { usePullToRefresh } from './hooks/usePullToRefresh.js'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ genres: [], minRating: 0 });

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  // Handle Scroll to Section
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  // --- TRENDING LOGIC ---
  const loadTrendingMovies = async () => {
    try {
      let movies = await getTrendingMovies();

      if (!Array.isArray(movies) || movies.length === 0) {
        const tmdbResp = await fetch(`${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`, API_OPTIONS);

        if (tmdbResp.ok) {
          const tmdbData = await tmdbResp.json();
          movies = (Array.isArray(tmdbData.results) ? tmdbData.results : []).slice(0, 10).map(m => ({
            $id: m.id,
            id: m.id,
            title: m.title || m.name,
            poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
            // VITAL: Pass all data needed for Modal logic
            overview: m.overview,
            vote_average: m.vote_average,
            release_date: m.release_date,
            original_language: m.original_language,
            poster_path: m.poster_path,
            vote_count: m.vote_count,
            popularity: m.popularity,
            genre_ids: m.genre_ids // <--- ADDED THIS so we can detect Anime in Trending
          }));
        }
      }

      setTrendingMovies(Array.isArray(movies) ? movies : []);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingMovies([]);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // --- PULL TO REFRESH ---
  const handleRefresh = async () => {
    await Promise.all([
      fetchMovies(debouncedSearchTerm),
      loadTrendingMovies()
    ]);
  };

  const { isRefreshing, pullChange } = usePullToRefresh(handleRefresh);

  return (
    <main>
      {/* Pull to Refresh Indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-transform duration-75"
        style={{ transform: `translateY(${pullChange > 0 ? pullChange - 40 : -100}px)` }}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-full p-2 shadow-lg border border-white/20 mt-safe-top">
          {isRefreshing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white transition-transform duration-200" style={{ transform: `rotate(${pullChange * 2}deg)` }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/logo.png" alt="Logo" className="size-20 mt-0.5" />
          <img src="/hero.png" alt="Hero Banner" className="size-auto" />
          <h1>Find <span className="text-gradient">Movies</span> You will Enjoy Without too much Hassle</h1>
          <section id="search">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </section>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending" id="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li
                  key={movie.$id || index}
                  onClick={() => setSelectedMovie(movie)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies mt-6">
          <h2>All Movies</h2>
          {isLoading ? (
            <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <li key={i}>
                  <MovieCardSkeleton />
                </li>
              ))}
            </ul>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList
                .filter(movie => {
                  // Filter by Genre
                  if (filters.genres.length > 0) {
                    const movieGenres = movie.genre_ids || [];
                    const matchesGenre = filters.genres.some(id => movieGenres.includes(id));
                    if (!matchesGenre) return false;
                  }
                  // Filter by Rating
                  if (filters.minRating > 0) {
                    if ((movie.vote_average || 0) < filters.minRating) return false;
                  }
                  return true;
                })
                .map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={setSelectedMovie}
                  />
                ))}
            </ul>
          )}
        </section>

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>


      <FilterMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={setFilters}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onFilterClick={() => setIsFilterOpen(true)}
      />
    </main>
  )
}

export default App