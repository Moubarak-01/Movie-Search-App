import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import MovieDetailsModal from './components/MovieDetailsModal.jsx' // Import Modal
import { useDebounce } from 'react-use'
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
  const [selectedMovie, setSelectedMovie] = useState(null); // Modal State

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

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

  // --- TRENDING LOGIC WITH FALLBACK ---
  const loadTrendingMovies = async () => {
    try {
      // 1. Try to get movies from Appwrite (Your DB)
      let movies = await getTrendingMovies();

      // 2. If Appwrite is empty (no users have searched yet), fallback to TMDB API
      if (!Array.isArray(movies) || movies.length === 0) {
        const tmdbResp = await fetch(`${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`, API_OPTIONS);
        
        if (tmdbResp.ok) {
          const tmdbData = await tmdbResp.json();
          // Map TMDB format to match our Appwrite format so the UI works
          movies = (Array.isArray(tmdbData.results) ? tmdbData.results : []).slice(0, 10).map(m => ({
            $id: m.id,
            id: m.id,
            title: m.title || m.name,
            poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
            // Add extra fields for the Modal
            overview: m.overview,
            vote_average: m.vote_average,
            release_date: m.release_date,
            original_language: m.original_language,
            poster_path: m.poster_path,
            vote_count: m.vote_count,
            popularity: m.popularity
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

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="/logo.png" alt="Logo" className="size-20 mt-0.5" />
          <img src="/hero.png" alt="Hero Banner" className="size-auto" />
          <h1>Find <span className="text-gradient">Movies</span> You will Enjoy Without too much Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li 
                  key={movie.$id || index} 
                  onClick={() => setSelectedMovie(movie)} // Click to Open Modal
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
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={setSelectedMovie} // Pass Click Handler
                />
              ))}
            </ul>
          )}
        </section>

        {/* Modal Render Logic */}
        {selectedMovie && (
          <MovieDetailsModal 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
          />
        )}
      </div>
    </main>
  )
}

export default App