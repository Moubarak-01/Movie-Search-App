import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGenreNames } from '../utils.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
  }
};

const MovieCard = ({ movie, onClick, isFavorite, toggleFavorite, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const hoverTimeoutRef = useRef(null);
  const cardRef = useRef(null);
  const iframeRef = useRef(null);
  const [hoverStyle, setHoverStyle] = useState({ transformOrigin: 'center center', left: '-10%', top: '-10%' });

  const updateHoverPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      let originX = 'center';
      let originY = 'center';
      let left = '-10%';
      let top = '-10%';

      // Adjust X axis if too close to edges
      if (rect.left < 50) { originX = 'left'; left = '0%'; }
      else if (window.innerWidth - rect.right < 50) { originX = 'right'; left = '-20%'; }

      // Adjust Y axis if too close to edges
      if (rect.top < 100) { 
        originY = 'top'; 
        top = rect.top < 20 ? `${20 - rect.top}px` : '0%'; 
      }
      else if (window.innerHeight - rect.bottom < 100) { 
        originY = 'bottom'; 
        top = '-20%'; 
        const bottomDist = window.innerHeight - rect.bottom;
        if (bottomDist < 20) {
           top = `calc(-20% - ${20 - bottomDist}px)`;
        }
      }

      setHoverStyle({ transformOrigin: `${originX} ${originY}`, left, top });
    }
  };

  const handleMouseEnter = () => {
    // Only show hover card on desktop (prevent sticky hover on mobile)
    if (window.innerWidth > 768) {
      hoverTimeoutRef.current = setTimeout(() => {
        updateHoverPosition();
        setIsHovered(true);
      }, 400); // reduced delay for snappier trailers
    }
  };

  useEffect(() => {
    if (isHovered) {
      window.addEventListener('scroll', updateHoverPosition, { passive: true });
      
      let isMounted = true;
      const fetchTrailer = async () => {
        try {
          const type = movie.title ? 'movie' : 'tv';
          const response = await fetch(`${API_BASE_URL}/${type}/${movie.id}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`, API_OPTIONS);
          const data = await response.json();
          
          if (isMounted && data.results && data.results.length > 0) {
            const trailer = data.results.find(vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser'));
            if (trailer) {
              setTrailerKey(trailer.key);
            }
          }
        } catch (error) {
          console.error("Error fetching hover trailer:", error);
        }
      };
      
      fetchTrailer();

      return () => {
        isMounted = false;
        window.removeEventListener('scroll', updateHoverPosition);
      };
    } else {
      setTrailerKey(null);
      setIsVideoLoaded(false);
    }
  }, [isHovered]);

  useEffect(() => {
    if (trailerKey) {
      // 7-second delay from hover to guarantee YouTube UI is fully faded
      const timer = setTimeout(() => setIsVideoLoaded(true), 7000);
      return () => clearTimeout(timer);
    } else {
      setIsVideoLoaded(false);
    }
  }, [trailerKey]);

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
    setIsMuted(true); // reset mute state
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const title = movie.title || movie.name;
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : 'N/A');
  const genres = getGenreNames(movie.genre_ids).slice(0, 3);

  // Calculate a fake match percentage based on vote average or default to 85%
  const matchPercentage = movie.vote_average ? Math.round(movie.vote_average * 10) : 85;

  return (
    <motion.li 
      className="movie-card cursor-pointer relative group transition-transform duration-200" 
      onClick={() => onClick(movie)} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.3, delay: ((movie.batchIndex !== undefined ? movie.batchIndex : index) % 20) * 0.05 }}
    >
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-700/50 animate-pulse"></div>
        )}
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
          alt={title}
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Favorite Button (Standard Card) */}
      <button
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/70"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
        }}
        onMouseEnter={() => {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        }}
        onMouseLeave={() => {
          // Restart the timer when the mouse leaves the button but is still on the card
          handleMouseEnter();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isFavorite ? "red" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-6 h-6 ${isFavorite ? "text-red-600" : "text-white"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      <div className="hidden md:block mt-4">
        <h3 className="text-white font-bold text-base line-clamp-1">{title}</h3>

        <div className="content mt-2 flex flex-row items-center flex-wrap gap-2">
          <div className="rating flex flex-row items-center gap-1">
            <img src="/star.svg" alt="Star Icon" className="size-4 object-contain" />
            <p className="font-bold text-base text-white">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span className="text-sm text-gray-100">•</span>
          <p className="lang capitalize text-gray-100 font-medium text-base">{movie.original_language}</p>

          <span className="text-sm text-gray-100">•</span>
          <p className="year text-gray-100 font-medium text-base">
            {releaseYear}
          </p>
        </div>
      </div>

      {/* HOVER CARD (Netflix Style) */}
      {isHovered && (
        <div
          className="absolute z-[100] transform scale-125 bg-[#141414] rounded-lg shadow-2xl shadow-black/80 flex flex-col transition-all duration-300"
          style={{
            width: '120%',
            left: hoverStyle.left,
            top: hoverStyle.top,
            transformOrigin: hoverStyle.transformOrigin,
            boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with hover card
        >
          {/* Backdrop Image & Video */}
          <div className="relative w-full aspect-video bg-black cursor-pointer rounded-t-lg overflow-hidden" onClick={() => onClick(movie)}>
            {/* 1. Video Layer (Bottom) - Always opaque so browser doesn't throttle autoplay */}
            {trailerKey && (
              <>
                <div className="absolute inset-0 z-0 overflow-hidden rounded-t-lg">
                    <iframe
                      ref={iframeRef}
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playlist=${trailerKey}&fs=0&modestbranding=1&playsinline=1&rel=0&start=12&enablejsapi=1`}
                      title="Trailer preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="absolute top-1/2 left-1/2 w-[125%] h-[125%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      tabIndex="-1"
                    ></iframe>
                </div>
                {/* Invisible shield to completely block all cursor interactions with YouTube */}
                <div className="absolute inset-0 z-[5] w-full h-full bg-transparent cursor-pointer"></div>
              </>
            )}

            {/* 2. Static Image Layer (Top) - Covers the video while it buffers and while controls flash, then fades out */}
            <img
              src={movie.backdrop_path ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}` : (movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png')}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 pointer-events-none ${trailerKey && isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
            />
            
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none z-20"></div>
            <h3 className="absolute bottom-3 left-4 pr-12 text-white font-bold text-lg drop-shadow-md line-clamp-2 max-w-[90%] z-30">{title}</h3>
            
            {/* Custom Mute Toggle Button */}
            {trailerKey && isVideoLoaded && (
              <button 
                onClick={toggleMute}
                className="absolute bottom-3 right-3 z-50 p-1.5 bg-black/40 hover:bg-black/60 rounded-full border border-white/20 text-white transition-colors"
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 4.5 4.5 0 0 1 0 6.364.75.75 0 0 1-1.06-1.06 3 3 0 0 0 0-4.243.75.75 0 0 1 0-1.061Z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Details Section */}
          <div className="p-4 flex flex-col gap-3 rounded-b-lg">
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Play Button */}
                <button
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => onClick(movie)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-4 h-4 ml-0.5">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Add/Favorite Button */}
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isFavorite ? 'border-red-600 bg-red-600/20 text-red-500' : 'border-gray-400 bg-[#2a2a2a] hover:border-white text-gray-200 hover:text-white hover:bg-white/10'}`}
                  onClick={() => toggleFavorite(movie)}
                >
                  {isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                </button>
              </div>

              {/* More Info Button */}
              <button
                className="w-8 h-8 rounded-full border border-gray-400 bg-[#2a2a2a] flex items-center justify-center hover:border-white text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => onClick(movie)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-[11px] font-semibold mt-1">
              <span className="text-[#46d369]">{matchPercentage}% match</span>
              <span className="px-1 py-0 border border-gray-500 text-gray-300">HD</span>
              <span className="text-gray-300">{releaseYear}</span>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1 text-[11px] text-gray-400 mt-1">
                {genres.map((g, idx) => (
                  <span key={g} className="flex items-center">
                    <span className="text-gray-200">{g}</span>
                    {idx < genres.length - 1 && <span className="mx-1.5 text-gray-600 font-bold text-[8px]">•</span>}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </motion.li>
  )
}

export default MovieCard