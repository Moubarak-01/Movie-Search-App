import React from 'react'

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  // --- ENVIRONMENT DETECTION ---
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;

  // Detect Anime (Language 'ja' + Genre 'Animation')
  const isAnime = movie.original_language === 'ja' && (movie.genre_ids?.includes(16) || true);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl bg-[#1a1a1a] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white bg-black/60 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Poster Side */}
        <div className="w-full md:w-[45%] h-64 md:h-auto bg-black flex items-center justify-center p-2">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
            alt={movie.title}
            className="max-h-full w-auto object-contain shadow-lg rounded-lg"
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
      </div>
    </div>
  )
}

export default MovieDetailsModal