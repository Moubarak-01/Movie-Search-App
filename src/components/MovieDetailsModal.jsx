import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const MovieDetailsModal = ({ movie, onClose, isFavorite, toggleFavorite, onSelectMovie }) => {
  if (!movie) return null;

  const [trailerKey, setTrailerKey] = useState(null);
  const [fallbackTrailerUrl, setFallbackTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // --- ENVIRONMENT DETECTION ---
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;

  const isAnime = movie.original_language === 'ja' && (movie.genre_ids?.includes(16) || movie.genre_ids?.includes(10759));

  const [isLoading, setIsLoading] = useState(true);
  const [isReleased, setIsReleased] = useState(true);
  const [releaseDateStr, setReleaseDateStr] = useState(null);
  
  const [tvStatus, setTvStatus] = useState(null);
  const [nextEpisode, setNextEpisode] = useState(null);
  const [nextEpisodeAirstamp, setNextEpisodeAirstamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isFetchingCountdown, setIsFetchingCountdown] = useState(false);

  const mediaType = movie.media_type || (movie.name && movie.first_air_date ? 'tv' : 'movie');

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Details for exact release status and TV tracking
        const detailsResponse = await fetch(`${API_BASE_URL}/${mediaType}/${movie.id}?api_key=${API_KEY}`);
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          let released = true;
          const dateStr = detailsData.release_date || detailsData.first_air_date || movie.release_date || movie.first_air_date;
          setReleaseDateStr(dateStr);
          
          if (dateStr) {
            const releaseDate = new Date(dateStr);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (releaseDate > today) {
              released = false;
            }
          }

          if (detailsData.status) {
            const unreleasedStatuses = ['Rumored', 'Planned', 'In Production', 'Post Production'];
            if (unreleasedStatuses.includes(detailsData.status)) {
              released = false;
            }
          }
          
          setIsReleased(released);

          if (mediaType === 'tv') {
            setTvStatus(detailsData.status);
            setNextEpisode(detailsData.next_episode_to_air);
          }
        }

        // Fetch Trailer (Include Japanese, Korean, Chinese, and fallback to any)
        const videoResponse = await fetch(`${API_BASE_URL}/${mediaType}/${movie.id}/videos?api_key=${API_KEY}&include_video_language=en,ja,ko,zh,null`);
        const videoData = await videoResponse.json();

        const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((movie.title || movie.name) + ' trailer')}`;
        setFallbackTrailerUrl(fallbackUrl);

        if (videoData.results && videoData.results.length > 0) {
          const trailer = videoData.results.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer"
          );
          const anyVideo = videoData.results.find((vid) => vid.site === "YouTube");
          const key = trailer ? trailer.key : (anyVideo ? anyVideo.key : null);
          setTrailerKey(key);
        } else {
          setTrailerKey(null);
        }

        // Fetch Recommendations
        const recResponse = await fetch(`${API_BASE_URL}/${mediaType}/${movie.id}/recommendations?api_key=${API_KEY}`);
        const recData = await recResponse.json();
        setRecommendations(recData.results || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movie?.id) {
      setIsLoading(true);
      fetchData();
      setShowTrailer(false);
    }
  }, [movie]);

  // --- COUNTDOWN TIMER EFFECT ---
  useEffect(() => {
    if (!nextEpisodeAirstamp) {
      setTimeLeft(null);
      return;
    }

    let interval;

    const updateTime = () => {
      const now = new Date();
      const airDate = new Date(nextEpisodeAirstamp);
      const diffMs = airDate - now;

      if (diffMs <= 0) {
        setTimeLeft('Airing now or recently aired');
        if (interval) clearInterval(interval);
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(' '));
    };

    updateTime(); // Update immediately so it doesn't flash the error message
    interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [nextEpisodeAirstamp]);

  const fetchExactCountdown = async () => {
    if (showCountdown) {
      setShowCountdown(false);
      return;
    }
    
    setShowCountdown(true);
    
    if (nextEpisodeAirstamp || isFetchingCountdown) return;
    
    setIsFetchingCountdown(true);
    try {
      // Artificial delay to show skeleton loading as requested
      await new Promise(resolve => setTimeout(resolve, 3500));

      const extResponse = await fetch(`${API_BASE_URL}/tv/${movie.id}/external_ids?api_key=${API_KEY}`);
      const extData = await extResponse.json();
      
      let tvmazeLookupUrl = null;
      if (extData.imdb_id) {
        tvmazeLookupUrl = `https://api.tvmaze.com/lookup/shows?imdb=${extData.imdb_id}`;
      } else if (extData.tvdb_id) {
        tvmazeLookupUrl = `https://api.tvmaze.com/lookup/shows?thetvdb=${extData.tvdb_id}`;
      }

      if (tvmazeLookupUrl) {
        const tvmazeSearchResponse = await fetch(tvmazeLookupUrl);
        if (tvmazeSearchResponse.ok) {
          const tvmazeShow = await tvmazeSearchResponse.json();
          if (tvmazeShow && tvmazeShow._links && tvmazeShow._links.nextepisode) {
             const nextEpResponse = await fetch(tvmazeShow._links.nextepisode.href);
             const nextEpData = await nextEpResponse.json();
             if (nextEpData.airstamp) {
               setNextEpisodeAirstamp(nextEpData.airstamp);
             }
          }
        }
      }
    } catch (e) {
      console.error("TVmaze fetch failed", e);
    } finally {
      setIsFetchingCountdown(false);
    }
  };

  const handleNkiri = () => {
    const title = encodeURIComponent(movie.title || movie.name);
    window.open(`https://thenkiri.com/?s=${title}`, '_blank');
  };

  const handleAnimeSuge = () => {
    const title = encodeURIComponent(movie.title || movie.name);
    window.open(`https://animesuge.cz/filter?keyword=${title}`, '_blank');
  };

  const handleAnilab = () => {
    if (isAndroid) {
      const package_name = "com.anilab.android";
      const fallback_url = "https://anilab.to/";
      const intentUrl = `intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=${package_name};S.browser_fallback_url=${fallback_url};end`;
      window.location.href = intentUrl;
    } else if (isIOS) {
      const appDeepLink = `anilab://`;
      const appDownloadUrl = `https://anilab.to/`;
      window.location.href = appDeepLink;
      setTimeout(() => {
        if (!document.hidden) {
          if (confirm("Anilab App not found. Open download page?")) {
            window.location.href = appDownloadUrl;
          }
        }
      }, 2000);
    }
  };

  const handleHiAnime = () => {
    const title = encodeURIComponent(movie.title || movie.name);
    window.open(`https://hianime.lol/search?keyword=${title}`, '_blank');
  };

  const handleNet77 = () => {
    const title = encodeURIComponent(movie.title || movie.name);
    window.open(`https://net77.cc/?s=${title}`, '_blank');
  };

  const handleCineHD = () => {
    const title = encodeURIComponent(movie.title || movie.name);
    window.open(`https://cinehd.app/search?q=${title}`, '_blank');
  };

  const handleM4uhd = () => {
    const title = encodeURIComponent(movie.title || movie.name);
    window.open(`https://m4uhd.cx/watch/${title}`, '_blank');
  };

  const handleDulo = () => {
    const title = encodeURIComponent(movie.title || movie.name);
    window.open(`https://dulo.cx/?s=${title}`, '_blank');
  };

  const primaryButtonText = "Watch on Nkiri";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-24 bg-black/80 backdrop-blur-sm md:pb-4" onClick={onClose}>
        <motion.div
          className="relative w-full max-w-4xl bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}

          // Animation Props
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}

          // Drag Props (Mobile Only)
          drag={!showTrailer ? "y" : false} // Disable drag when video is playing
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.2 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 && !showTrailer) {
              onClose();
            }
          }}
        >

          {/* TRAILER VIEW */}
          {showTrailer && trailerKey ? (
            <div className="w-full h-full min-h-[50vh] flex flex-col bg-black relative">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 right-4 z-50 p-2 text-white bg-black/60 hover:bg-red-600 rounded-full transition-colors flex items-center gap-2 px-4 shadow-lg border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-bold">Close Trailer</span>
              </button>

              <iframe
                className="w-full h-full flex-grow"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-50">
                <button
                  onClick={() => window.open(fallbackTrailerUrl, '_blank')}
                  className="pointer-events-auto bg-black/80 hover:bg-black text-white border border-gray-600 px-5 py-2.5 rounded-full text-sm font-semibold shadow-2xl backdrop-blur-md transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Video blocked? Search on YouTube
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* NORMAL DETAIL VIEW */}

              {/* Mobile Drag Handle */}
              <div className="md:hidden w-full flex justify-center pt-3 pb-1 absolute top-0 z-30 pointer-events-none">
                <div className="w-12 h-1.5 bg-gray-600 rounded-full opacity-50"></div>
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white bg-black/60 rounded-full transition-colors"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="w-full md:w-[45%] h-64 md:h-auto bg-black flex items-center justify-center p-2 pt-8 md:pt-2">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
                  alt={movie.title || movie.name}
                  className="max-h-full w-auto object-contain shadow-lg rounded-lg"
                  loading="lazy"
                />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col gap-4 overflow-y-auto">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-3xl font-bold text-white leading-tight">{movie.title || movie.name}</h2>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie);
                    }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isFavorite ? "red" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-8 h-8 ${isFavorite ? "text-red-500" : "text-gray-400"}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                    <img src="/star.svg" alt="star" className="w-4 h-4" />
                    <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{movie.original_language}</span>
                  <span>•</span>
                  <span>{movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : 'N/A')}</span>
                </div>

                <div className="mt-2">
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Overview</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {movie.overview || "No description available."}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-8 flex justify-center py-8"
                    >
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex flex-col"
                    >
                      {/* TV SHOW / ANIME WEEKLY TRACKER */}
                      {mediaType === 'tv' && (tvStatus || nextEpisode) && (
                        <div className="mt-4 bg-[#2a2a2a] border border-gray-700 rounded-lg p-3">
                          {tvStatus === 'Ended' || tvStatus === 'Canceled' ? (
                            <p className="text-gray-300 text-sm">📺 Series Status: <span className="text-white font-semibold">{tvStatus === 'Ended' ? 'Completed' : 'Canceled'}</span></p>
                          ) : nextEpisode ? (
                            <div>
                              <p className="text-gray-300 text-sm mb-1">
                                📺 Next Episode: <span className="text-white font-semibold">Season {nextEpisode.season_number}, Episode {nextEpisode.episode_number}</span>
                              </p>
                              {nextEpisode.name && <p className="text-gray-400 text-xs mb-1">"{nextEpisode.name}"</p>}
                              <p className="text-indigo-400 text-xs font-medium mb-2">
                                Airs on {new Date(nextEpisode.air_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              
                              <button
                                onClick={fetchExactCountdown}
                                className="text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 py-1.5 px-3 rounded-full transition-colors border border-indigo-500/30 block mb-2"
                              >
                                {showCountdown ? 'Hide Countdown' : 'See exact countdown in my timezone'}
                              </button>
                              
                              {showCountdown && (
                                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                                  {isFetchingCountdown ? (
                                    <div className="animate-pulse flex flex-col gap-2 py-1">
                                      <div className="h-2.5 bg-gray-600/50 rounded w-1/3"></div>
                                      <div className="h-4 bg-gray-600/50 rounded w-1/2"></div>
                                    </div>
                                  ) : timeLeft && nextEpisodeAirstamp ? (
                                    <>
                                      <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Starts in (Local Time)</p>
                                      <p className="text-green-400 font-mono text-sm tracking-wide font-bold">{timeLeft}</p>
                                    </>
                                  ) : (
                                     <p className="text-red-400 text-xs italic">Exact network broadcast time not available.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-300 text-sm">📺 Series Status: <span className="text-white font-semibold">{tvStatus || 'Ongoing'}</span></p>
                          )}
                        </div>
                      )}

                      <div className="mt-6 flex flex-col gap-3">
                        {/* TRAILER BUTTON */}
                        {(trailerKey || fallbackTrailerUrl) && (
                          <button
                            onClick={() => {
                              if (trailerKey) {
                                setShowTrailer(true);
                              } else {
                                window.open(fallbackTrailerUrl, '_blank');
                              }
                            }}
                            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2 mb-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                            </svg>
                            {trailerKey ? 'Watch Trailer' : 'Find Trailer on YouTube'}
                          </button>
                        )}

                        <div className="flex flex-col gap-3">
                          {isReleased ? (
                            <>
                              <p className="text-gray-300 text-sm font-medium mb-1">Select Streaming Source:</p>

                              {isAnime && (
                                <>
                                  <button
                                    onClick={handleAnimeSuge}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                                  >
                                    Watch on AnimeSuge
                                  </button>
                                  <button
                                    onClick={handleHiAnime}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                                  >
                                    Watch on HiAnime
                                  </button>
                                  {isMobile && (
                                    <button
                                      onClick={handleAnilab}
                                      className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                      Open Anilab App
                                    </button>
                                  )}
                                </>
                              )}

                              <button
                                onClick={handleDulo}
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                              >
                                Watch on Dulo (Movies, Series & Anime)
                              </button>

                              <button
                                onClick={handleNkiri}
                                className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                              >
                                Watch on Nkiri
                              </button>

                              <button
                                onClick={handleNet77}
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                              >
                                Watch on Net77
                              </button>

                              <button
                                onClick={handleCineHD}
                                className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                              >
                                Watch on CineHD
                              </button>

                              <button
                                onClick={handleM4uhd}
                                className="w-full py-3 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                              >
                                Watch on M4UHD
                              </button>
                            </>
                          ) : (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center mt-2">
                              <p className="text-red-400 text-sm font-medium">This title has not been released yet.</p>
                              {releaseDateStr ? (
                                 <p className="text-red-400/80 text-xs mt-1">Expected Release: {new Date(releaseDateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              ) : (
                                 <p className="text-red-400/80 text-xs mt-1">Release date is currently unknown.</p>
                              )}
                              <p className="text-red-400/80 text-xs mt-2 italic">Streaming sources will become available on release day.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4 text-xs text-gray-400">
                        <div>
                          <span className="block mb-1 uppercase">Popularity</span>
                          <span className="text-white text-sm">{Math.round(movie.popularity)}</span>
                        </div>
                        <div>
                          <span className="block mb-1 uppercase">Vote Count</span>
                          <span className="text-white text-sm">{movie.vote_count}</span>
                        </div>
                      </div>

                      {/* RECOMMENDATIONS SECTION */}
                      {recommendations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <h3 className="text-white font-semibold mb-3">You might also like</h3>
                          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {recommendations.slice(0, 10).map((rec) => (
                              <div
                                key={rec.id}
                                className="min-w-[120px] w-[120px] cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => onSelectMovie && onSelectMovie(rec)}
                              >
                                <img
                                  src={rec.poster_path ? `https://image.tmdb.org/t/p/w200${rec.poster_path}` : '/no-movie.png'}
                                  alt={rec.title || rec.name}
                                  className="w-full h-[180px] object-cover rounded-lg mb-2"
                                  loading="lazy"
                                />
                                <p className="text-xs text-center text-gray-300 line-clamp-2">{rec.title || rec.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MovieDetailsModal