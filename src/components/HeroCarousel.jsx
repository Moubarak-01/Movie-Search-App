import React, { useState, useEffect, useCallback } from 'react';

const HeroCarousel = ({ items, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length === 0) return;
    const intervalId = setInterval(handleNext, 6000); // 6 seconds
    return () => clearInterval(intervalId);
  }, [items.length, handleNext, currentIndex]); // depend on currentIndex to reset timer on manual change

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  
  // Use backdrop if available, fallback to poster
  const backgroundUrl = currentItem.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`
    : currentItem.poster_path 
      ? `https://image.tmdb.org/t/p/w1280${currentItem.poster_path}` 
      : '/no-movie.png';

  const isAnime = (item) => item.original_language === 'ja' && (item.genre_ids?.includes(16) || item.genre_ids?.includes(10759));
  const typeLabel = isAnime(currentItem) ? 'Anime' : currentItem.media_type === 'tv' ? 'Series' : 'Movie';
  const releaseYear = (currentItem.release_date || currentItem.first_air_date || '').split('-')[0];

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] max-h-[900px] rounded-2xl overflow-hidden mt-6 mb-12 shadow-2xl group">
      {/* Background Images with Crossfade */}
      {items.map((item, index) => {
        const itemBgUrl = item.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
          : item.poster_path 
            ? `https://image.tmdb.org/t/p/w1280${item.poster_path}` 
            : '/no-movie.png';
            
        return (
          <div
            key={item.id + '-' + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${itemBgUrl})` }}
            />
            {/* Gradients to match the reference images: dark bottom and left */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent w-[80%] opacity-90" />
          </div>
        );
      })}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-3xl flex flex-col gap-3 animate-fade-in-up" key={currentIndex}>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="bg-[#ab8bff] text-white px-3 py-1 rounded-md tracking-wider uppercase text-xs shadow-lg">
              {typeLabel}
            </span>
            {releaseYear && <span className="text-gray-300">{releaseYear}</span>}
            <span className="text-gray-300 flex items-center gap-1">
              <span className="text-yellow-400">⭐</span> 
              {currentItem.vote_average ? currentItem.vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            {currentItem.title || currentItem.name}
          </h2>

          <p className="text-gray-300 text-sm md:text-base line-clamp-3 mt-2 max-w-2xl drop-shadow-md">
            {currentItem.overview || "No overview available for this title."}
          </p>

          <div className="mt-4 flex gap-4">
            <button 
              onClick={() => onClick(currentItem)}
              className="bg-white text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-[#ab8bff] hover:to-[#8a68e3] hover:text-white hover:shadow-[0_0_20px_rgba(171,139,255,0.6)] active:scale-95 group/btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover/btn:rotate-12">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
              </svg>
              See Details
            </button>
          </div>
        </div>
      </div>

      {/* Manual Navigation Arrows (Bottom Right) */}
      <div className="absolute bottom-8 right-8 z-30 flex gap-3">
        <button 
          onClick={handlePrev}
          className="bg-black/20 hover:bg-black/40 backdrop-blur-sm p-3 rounded-full text-white/60 hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button 
          onClick={handleNext}
          className="bg-black/20 hover:bg-black/40 backdrop-blur-sm p-3 rounded-full text-white/60 hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Pagination Dots (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-2 bg-[#ab8bff]' 
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
