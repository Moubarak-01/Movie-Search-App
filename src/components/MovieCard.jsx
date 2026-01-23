import React from 'react'

const MovieCard = ({ movie, onClick, isFavorite, toggleFavorite }) => {
  return (
    <div
      className="movie-card cursor-pointer hover:scale-[1.02] transition-transform duration-200 relative group"
      onClick={() => onClick(movie)}
    >
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
        alt={movie.title}
        loading="lazy"
      />

      {/* Favorite Button */}
      <button
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/70"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(movie);
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

      <div className="mt-4">
        <h3>{movie.title}</h3>

        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star Icon" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className="lang">{movie.original_language}</p>

          <span>•</span>
          <p className="year">
            {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard