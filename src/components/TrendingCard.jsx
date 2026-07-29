import React from 'react';
import { getGenreNames } from '../utils.js';

const TrendingCard = ({ item, index, onClick, isFavorite, toggleFavorite }) => {
  const title = item.title || item.name;

  return (
    <li
      className="relative cursor-pointer hover:scale-[1.02] transition-transform duration-200"
      onClick={() => onClick(item)}
    >
      <p>{index + 1}</p>
      <img src={item.poster_url || (item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : '/no-movie.png')} alt={title} />
    </li>
  );
};

export default TrendingCard;
