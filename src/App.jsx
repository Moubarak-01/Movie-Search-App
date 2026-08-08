import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import TrendingCard from './components/TrendingCard.jsx'
import MovieDetailsModal from './components/MovieDetailsModal.jsx'
import MovieCardSkeleton from './components/MovieCardSkeleton.jsx'
import BottomNav from './components/BottomNav.jsx'
import FilterMenu from './components/FilterMenu.jsx'
import HeroCarousel from './components/HeroCarousel.jsx'
import { useDebounce } from 'react-use'
import { usePullToRefresh } from './hooks/usePullToRefresh.js'
import { useFavorites } from './hooks/useFavorites.js'
import { useWatchHistory } from './hooks/useWatchHistory.js'

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
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ genres: [], minRating: 0 });
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Custom Hooks
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addToHistory } = useWatchHistory();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 2200, [searchTerm])

  const isFilterActive = filters.genres.length > 0 || filters.minRating > 0;
  const isSearching = isLoading && searchTerm !== '';

  // Handle Scroll to Section
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'favorites') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    addToHistory(movie);
  };

  const fetchMovies = async (query = '', page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setErrorMessage('');
    }

    // Artificial delay to ensure skeletons stay visible long enough for a smooth visual transition
    // rather than flashing and vanishing instantly on fast networks.
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let results = [];
      let totalPages = 1;

      if (filters.genres.length > 0 && !query) {
        const genreParams = filters.genres.join(',');
        
        const movieEndpoint = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreParams}&sort_by=popularity.desc&page=${page}&vote_average.gte=${filters.minRating}`;
        const movieResp = await fetch(movieEndpoint, API_OPTIONS);
        
        const tvEndpoint = `${API_BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreParams}&sort_by=popularity.desc&page=${page}&vote_average.gte=${filters.minRating}`;
        const tvResp = await fetch(tvEndpoint, API_OPTIONS);

        if (!movieResp.ok || !tvResp.ok) throw new Error('Failed to fetch filtered movies');

        const movieData = await movieResp.json();
        const tvData = await tvResp.json();

        results = [...(movieData.results || []), ...(tvData.results || [])];
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        
        totalPages = Math.max(movieData.total_pages || 1, tvData.total_pages || 1);
      } else {
        const endpoint = query
          ? `${API_BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
          : `${API_BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`;

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) throw new Error('Failed to fetch movies');

        const data = await response.json();
        if (data.Response === 'False') {
           if (!isLoadMore) {
             setErrorMessage(data.Error || 'Failed to fetch movies');
             setMovieList([]);
           }
           return;
        }
        results = data.results || [];
        totalPages = data.total_pages || 1;
      }

      const validResults = results.filter(item => item.media_type !== 'person');
      const finalResults = (filters.genres.length > 0 && !query) 
        ? validResults 
        : validResults.filter(movie => (movie.vote_average || 0) >= filters.minRating);

      if (isLoadMore) {
        setMovieList(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = finalResults
            .filter(item => !existingIds.has(item.id))
            .map((item, i) => ({ ...item, batchIndex: i }));
          return [...prev, ...newItems];
        });
      } else {
        setMovieList(finalResults.map((item, i) => ({ ...item, batchIndex: i })));
      }
      
      setHasMore(page < totalPages && page < 500);

      if (query && finalResults.length > 0 && !isLoadMore) {
        await updateSearchCount(query, finalResults[0]);
        setSearchSuggestions([]);
      } else if (query && finalResults.length === 0 && !isLoadMore) {
        const words = query.trim().split(' ');
        const backupQuery = words.length > 1 ? words[0] : query.substring(0, Math.min(query.length - 1, 5));
        
        if (backupQuery && backupQuery.length >= 3) {
          try {
            const backupEndpoint = `${API_BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(backupQuery)}`;
            const backupResp = await fetch(backupEndpoint, API_OPTIONS);
            if (backupResp.ok) {
              const backupData = await backupResp.json();
              setSearchSuggestions((backupData.results || []).filter(item => item.media_type !== 'person'));
            }
          } catch (e) {
            console.error("Backup search failed", e);
          }
        } else {
          setSearchSuggestions([]);
        }
      } else if (!isLoadMore) {
        setSearchSuggestions([]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      if (!isLoadMore) setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }

  const handleLoadMore = () => {
    if (!hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMovies(debouncedSearchTerm, nextPage, true);
  };

  // --- TRENDING LOGIC ---
  const loadTrendingMovies = async () => {
    try {
      let movies = await getTrendingMovies();

      if (!Array.isArray(movies) || movies.length === 0) {
        // Fetch trending Movies
        const tmdbResp = await fetch(`${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`, API_OPTIONS);

        if (tmdbResp.ok) {
          const tmdbData = await tmdbResp.json();
          // Filter out people, just in case
          const validTrending = (Array.isArray(tmdbData.results) ? tmdbData.results : []).filter(item => item.media_type !== 'person');
          movies = validTrending.slice(0, 10).map(m => ({
            $id: m.id,
            id: m.id,
            title: m.title || m.name,
            poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
            // VITAL: Pass all data needed for Modal logic
            overview: m.overview,
            vote_average: m.vote_average,
            release_date: m.release_date || m.first_air_date,
            original_language: m.original_language,
            poster_path: m.poster_path,
            backdrop_path: m.backdrop_path,
            vote_count: m.vote_count,
            popularity: m.popularity,
            genre_ids: m.genre_ids, // <--- ADDED THIS so we can detect Anime in Trending
            name: m.name, // Pass name for TV shows
            first_air_date: m.first_air_date
          }));
        }
      }

      setTrendingMovies(Array.isArray(movies) ? movies : []);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingMovies([]);
    }
  }

  const loadTrendingSeries = async () => {
    try {
      const tmdbResp = await fetch(`${API_BASE_URL}/trending/tv/week?api_key=${API_KEY}`, API_OPTIONS);

      if (tmdbResp.ok) {
        const tmdbData = await tmdbResp.json();
        const validTrending = (Array.isArray(tmdbData.results) ? tmdbData.results : [])
          .filter(item => item.media_type !== 'person')
          .filter(item => !(item.original_language === 'ja' && (item.genre_ids?.includes(16) || item.genre_ids?.includes(10759))));
        const series = validTrending.slice(0, 10).map(m => ({
          $id: m.id,
          id: m.id,
          title: m.name,
          poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          overview: m.overview,
          vote_average: m.vote_average,
          release_date: m.first_air_date,
          original_language: m.original_language,
          poster_path: m.poster_path,
          backdrop_path: m.backdrop_path,
          vote_count: m.vote_count,
          popularity: m.popularity,
          genre_ids: m.genre_ids,
          name: m.name,
          first_air_date: m.first_air_date
        }));
        setTrendingSeries(series);
      }
    } catch (error) {
      console.error(`Error fetching trending series: ${error}`);
      setTrendingSeries([]);
    }
  }

  const loadTrendingAnime = async () => {
    try {
      let allAnime = [];
      // Fetch up to 5 pages of trending content to find enough anime
      for (let page = 1; page <= 5; page++) {
        const tmdbResp = await fetch(`${API_BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`, API_OPTIONS);
        if (tmdbResp.ok) {
          const tmdbData = await tmdbResp.json();
          const existingIds = new Set(allAnime.map(a => a.id));
          const animeInPage = (Array.isArray(tmdbData.results) ? tmdbData.results : [])
            .filter(item => item.media_type !== 'person')
            .filter(item => item.original_language === 'ja' && item.genre_ids?.includes(16))
            .filter(item => !existingIds.has(item.id));
          
          allAnime = [...allAnime, ...animeInPage];
          
          if (allAnime.length >= 10) break;
        }
      }

      // If we somehow didn't find 10 trending anime, fallback to discover
      if (allAnime.length < 10) {
        const fallbackResp = await fetch(`${API_BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_genres=16&with_original_language=ja`, API_OPTIONS);
        if (fallbackResp.ok) {
           const fallbackData = await fallbackResp.json();
           const validTrending = (Array.isArray(fallbackData.results) ? fallbackData.results : []).filter(item => item.media_type !== 'person');
           
           // Filter out duplicates
           const existingIds = new Set(allAnime.map(a => a.id));
           const additionalAnime = validTrending.filter(a => !existingIds.has(a.id));
           
           allAnime = [...allAnime, ...additionalAnime];
        }
      }

      const anime = allAnime.slice(0, 10).map(m => ({
        $id: m.id,
        id: m.id,
        title: m.title || m.name,
        poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
        overview: m.overview,
        vote_average: m.vote_average,
        release_date: m.release_date || m.first_air_date,
        original_language: m.original_language,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        vote_count: m.vote_count,
        popularity: m.popularity,
        genre_ids: m.genre_ids,
        name: m.name,
        first_air_date: m.first_air_date,
        media_type: m.media_type
      }));
      setTrendingAnime(anime);
    } catch (error) {
      console.error(`Error fetching trending anime: ${error}`);
      setTrendingAnime([]);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(debouncedSearchTerm, 1, false);
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    loadTrendingMovies();
    loadTrendingSeries();
    loadTrendingAnime();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([
      fetchMovies(debouncedSearchTerm),
      loadTrendingMovies(),
      loadTrendingSeries(),
      loadTrendingAnime()
    ]);
  };

  const { isRefreshing, pullChange } = usePullToRefresh(handleRefresh);

  return (
    <main className="pb-32 md:pb-12">
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
        <header className="w-full flex justify-between items-center px-8 py-4 z-50">
          <div className="flex items-center gap-3">
            <img src="/mouvie-logo-removebg-preview.png" alt="Mouvie Logo" className="h-56 w-auto object-contain" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleTabChange('home')}
              className={`text-lg font-medium transition-colors ${activeTab === 'home' || activeTab === 'trending' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabChange('favorites')}
              className={`text-lg font-medium transition-colors ${activeTab === 'favorites' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            >
              Favorites
            </button>
          </nav>
        </header>

        <h1>Find <span className="text-gradient">Movies, Series & Animes</span> You will Enjoy Without too much Hassle</h1>
        <section id="search">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isSearching={isSearching}
            onSubmit={() => setDebouncedSearchTerm(searchTerm)}
            onFilterClick={() => setIsFilterOpen(true)}
          />
        </section>

        {(() => {
          const combinedTrending = [];
          const seenIds = new Set();
          
          const addUnique = (item) => {
            if (item && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              combinedTrending.push(item);
            }
          };

          // Take the top 10 from each category (max 30 total items)
          for (let i = 0; i < 10; i++) {
            addUnique(trendingMovies[i]);
            addUnique(trendingSeries[i]);
            addUnique(trendingAnime[i]);
          }
          
          return activeTab === 'home' && !searchTerm && !isFilterActive && combinedTrending.length > 0 && (
            <HeroCarousel items={combinedTrending} onClick={handleMovieClick} />
          );
        })()}

        {activeTab === 'home' && !searchTerm && !isFilterActive && trendingMovies.length > 0 && (
          <section className="trending mt-6" id="trending-movies">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <TrendingCard
                  key={movie.$id || index}
                  item={movie}
                  index={index}
                  onClick={handleMovieClick}
                  isFavorite={isFavorite(movie.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </ul>
          </section>
        )}

        {activeTab === 'home' && !searchTerm && !isFilterActive && trendingSeries.length > 0 && (
          <section className="trending mt-6" id="trending-series">
            <h2>Trending Series</h2>
            <ul>
              {trendingSeries.map((series, index) => (
                <TrendingCard
                  key={series.$id || index}
                  item={series}
                  index={index}
                  onClick={handleMovieClick}
                  isFavorite={isFavorite(series.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </ul>
          </section>
        )}

        {activeTab === 'home' && !searchTerm && !isFilterActive && trendingAnime.length > 0 && (
          <section className="trending mt-6" id="trending-anime">
            <h2>Trending Animes</h2>
            <ul>
              {trendingAnime.map((anime, index) => (
                <TrendingCard
                  key={anime.$id || index}
                  item={anime}
                  index={index}
                  onClick={handleMovieClick}
                  isFavorite={isFavorite(anime.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </ul>
          </section>
        )}

        {activeTab === 'trending' && (
          <section className="all-movies mt-6" id="trending-grid">
            <h2>All Trending Shows</h2>
            <ul>
              {(() => {
                const combined = [];
                const seen = new Set();
                [...trendingMovies, ...trendingSeries, ...trendingAnime].forEach(item => {
                  if (item && !seen.has(item.id)) {
                    seen.add(item.id);
                    combined.push(item);
                  }
                });
                return combined.map((item, index) => (
                  <MovieCard key={item.id} movie={item} index={index} onClick={handleMovieClick} isFavorite={isFavorite(item.id)} toggleFavorite={toggleFavorite} />
                ));
              })()}
            </ul>
          </section>
        )}

        {activeTab !== 'trending' && (
          <section className="all-movies mt-6" id="all-movies">
          <h2>{activeTab === 'favorites' ? 'Your Favorites' : 'All Movies, Series & Animes'}</h2>

          {activeTab === 'favorites' && favorites.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p className="text-lg">No favorite movies yet.</p>
              <p className="text-sm">Heart some movies to see them here!</p>
            </div>
          ) : isLoading ? (
            <ul>
              {Array.from({ length: 8 }).map((_, i) => (
                <li key={i}>
                  <MovieCardSkeleton />
                </li>
              ))}
            </ul>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <>
              {(() => {
                const filteredList = (activeTab === 'favorites' ? favorites : movieList).filter(movie => {
                  if (activeTab === 'favorites' && searchTerm) {
                    const title = (movie.title || movie.name || '').toLowerCase();
                    if (!title.includes(searchTerm.toLowerCase())) return false;
                  }
                  return true;
                });

                if (filteredList.length === 0 && (searchTerm || filters.genres.length > 0 || filters.minRating > 0)) {
                  return (
                    <div className="w-full flex flex-col items-center">
                      <div className="text-center text-gray-400 py-16 w-full flex flex-col items-center justify-center">
                        <p className="text-2xl font-bold text-white mb-2">Oops! No results found.</p>
                        <p className="text-base max-w-md">We couldn't find any matches {searchTerm ? <span>for <span className="text-white font-medium">"{searchTerm}"</span></span> : "with the current filters"}.</p>
                        <p className="text-sm mt-2 text-gray-500">Try adjusting your search, clearing filters, or checking for typos.</p>
                      </div>

                      {/* Suggestions for Home Tab */}
                      {activeTab !== 'favorites' && (searchSuggestions.length > 0 || trendingMovies.length > 0) && (
                        <div className="w-full mt-4 pt-8 border-t border-white/10">
                          <h3 className="text-xl font-bold text-white mb-6 text-left">You might also like...</h3>
                          <ul>
                            {(searchSuggestions.length > 0 ? searchSuggestions : trendingMovies).slice(0, 4).map((movie, index) => (
                              <MovieCard
                                key={movie.id}
                                movie={movie}
                                index={index}
                                onClick={handleMovieClick}
                                isFavorite={isFavorite(movie.id)}
                                toggleFavorite={toggleFavorite}
                              />
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <>
                    <ul>
                      {filteredList.map((movie, index) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          index={index}
                          onClick={handleMovieClick}
                          isFavorite={isFavorite(movie.id)}
                          toggleFavorite={toggleFavorite}
                        />
                      ))}
                      
                      {isLoadingMore && Array.from({ length: 20 }).map((_, i) => (
                        <li key={`skeleton-${i}`}>
                          <MovieCardSkeleton />
                        </li>
                      ))}
                    </ul>
                    
                    {activeTab !== 'favorites' && hasMore && !isLoadingMore && (
                      <div className="w-full flex justify-center mt-10">
                        <button 
                          onClick={handleLoadMore}
                          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all flex items-center gap-2 border border-white/20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                          See More
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </section>
        )}

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onSelectMovie={setSelectedMovie} // Pass this prop
            isFavorite={isFavorite(selectedMovie.id)}
            toggleFavorite={toggleFavorite}
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