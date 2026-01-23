import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // --- ENVIRONMENT DETECTION ---
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;

  // Detect Anime (Language 'ja' + Genre 'Animation')
  const isAnime = movie.original_language === 'ja' && (movie.genre_ids?.includes(16) || true);

  // --- FETCH TRAILER ---
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`);
        const data = await response.json();

        if (data.results) {
          const trailer = data.results.find(
            (vid) => vid.site === "YouTube" && vid.type === "Trailer"
          );
          // Fallback to any YouTube video if "Trailer" not found
          const anyVideo = data.results.find((vid) => vid.site === "YouTube");
          setTrailerKey(trailer ? trailer.key : (anyVideo ? anyVideo.key : null));
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    if (movie?.id) {
      fetchTrailer();
      setShowTrailer(false); // Reset on new movie
    }
  }, [movie]);


  // --- HANDLERS ---
  const handleNkiri = () => {
    const title = encodeURIComponent(movie.title);
    window.open(`https://thenkiri.com/?s=${title}`, '_blank');
  };

  const handleHiAnime = () => {
    const title = encodeURIComponent(movie.title);
    window.open(`https://hianime.to/search?keyword=${title}`, '_blank');
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

  const primaryButtonText = "Watch on Nkiri";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm md:items-center items-end md:p-4 p-0" onClick={onClose}>
        <motion.div
          className="relative w-full max-w-4xl bg-[#1a1a1a] border border-gray-700 rounded-2xl md:rounded-2xl rounded-t-2xl rounded-b-none shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[90vh] max-h-[95vh]"
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
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Poster Side */}
              <div className="w-full md:w-[45%] h-64 md:h-auto bg-black flex items-center justify-center p-2 pt-8 md:pt-2">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
                  alt={movie.title}
                  className="max-h-full w-auto object-contain shadow-lg rounded-lg"
                  loading="lazy"
                />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col gap-4 overflow-y-auto">
                <h2 className="text-3xl font-bold text-white leading-tight">{movie.title}</h2>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                    <img src="/star.svg" alt="star" className="w-4 h-4" />
                    <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{movie.original_language}</span>
                  <span>•</span>
                  <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                </div>

                <div className="mt-2">
                  <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Overview</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {movie.overview || "No description available for this movie."}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {/* TRAILER BUTTON */}
                  {trailerKey && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2 mb-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      Watch Trailer
                    </button>
                  )}

                  {isAnime ? (
                    <div className="flex flex-col gap-3">
                      <p className="text-gray-300 text-sm font-medium mb-1">Select Streaming Source:</p>

                      {/* HiAnime */}
                      <button
                        onClick={handleHiAnime}
                        className="w-full py-3 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        Watch on HiAnime
                      </button>

                      {/* Nkiri */}
                      <button
                        onClick={handleNkiri}
                        className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        Watch on Nkiri
                      </button>

                      {/* Anilab (Mobile Only) */}
                      {isMobile && (
                        <button
                          onClick={handleAnilab}
                          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                          Open Anilab App
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Non-Anime Default (Nkiri) */
                    <button
                      onClick={handleNkiri}
                      className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      {primaryButtonText}
                    </button>
                  )}
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
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MovieDetailsModal