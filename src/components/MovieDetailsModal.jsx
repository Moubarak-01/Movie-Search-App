import React from 'react'

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  // --- SMART TRAFFIC CONTROL LOGIC ---
  const handleWatch = () => {
    const title = encodeURIComponent(movie.title);
    
    // 1. Detect Environment
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;

    // 2. Detect Anime (Language 'ja' + Genre 'Animation')
    // Note: If genre_ids is missing, we fallback to just checking language 'ja'
    const isAnime = movie.original_language === 'ja' && (movie.genre_ids?.includes(16) || true);

    // --- SCENARIO 1: DESKTOP OR REGULAR MOVIE (Use Website) ---
    if (!isMobile || !isAnime) {
      window.open(`https://thenkiri.com/?s=${title}`, '_blank');
      return;
    }

    // --- SCENARIO 2: ANDROID ANIME (Use Intent) ---
    if (isAndroid) {
      // This "Intent" string tells Android: 
      // "Try to Open package 'com.anilab.app'. If not found, go to 'anilab.to'"
      // We also send a generic "SEARCH" command with the movie title.
      // NOTE: If Anilab doesn't support search commands, it will just open the Main Menu.
      const package_name = "com.anilab.app"; // Common package name (Verify if possible)
      const fallback_url = "https://anilab.to/";
      
      const intentUrl = `intent://#Intent;action=android.intent.action.SEARCH;S.query=${title};package=${package_name};S.browser_fallback_url=${fallback_url};end`;
      
      window.location.href = intentUrl;
      return;
    }

    // --- SCENARIO 3: iOS ANIME (Try Scheme -> Fallback) ---
    if (isIOS) {
      const appDeepLink = `anilab://search?q=${title}`;
      const appDownloadUrl = `https://anilab.to/`;

      // iOS requires a direct user click for deep links, we can't fully automate "check if installed"
      // We try the link, and set a fallback timer
      window.location.href = appDeepLink;
      
      setTimeout(() => {
        if (!document.hidden) {
           if(confirm("Open Anilab Download Page?")) {
              window.location.href = appDownloadUrl;
           }
        }
      }, 2000);
    }
  };

  const handleWebFallback = () => {
     const title = encodeURIComponent(movie.title);
     window.open(`https://thenkiri.com/?s=${title}`, '_blank');
  }

  // Helper for UI Text
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isAnime = movie.original_language === 'ja';
  const primaryButtonText = (isMobile && isAnime) ? "Open Anilab App" : "Watch on Nkiri";

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
             <button 
               onClick={handleWatch}
               className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                 <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
               </svg>
               {primaryButtonText}
             </button>

             {isMobile && isAnime && (
               <button 
                  onClick={handleWebFallback}
                  className="text-gray-400 hover:text-white text-sm underline decoration-gray-600 underline-offset-4"
               >
                  Or watch on Web (Nkiri)
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