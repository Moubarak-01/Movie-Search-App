import React from 'react'
import { useTypewriter } from '../hooks/useTypewriter';

const SEARCH_PROMPTS = [
  "Search for Movies, Series & Animes...",
  "Search... can't download em though😓😓 but I gat YOU",
  "Try searching 'Spider-Man'...",
  "Find your next binge-watch...",
  "Looking for 'Inception'?",
  "In the mood for a Comedy?",
  "How about some classic Anime?",
  "Explore trending Sci-Fi movies...",
  "Looking for a weekend Thriller?",
  "Find that movie you forgot the name of...",
  "Need some Romance in your life?",
  "Search for 'The Dark Knight'...",
  "Try searching 'Interstellar'...",
  "Looking for some Studio Ghibli magic?",
  "Search for 'Game of Thrones'...",
  "Try 'Attack on Titan' or 'Jujutsu Kaisen'...",
  "Search for 'Breaking Bad'...",
  "Check out 'Stranger Things'...",
  "Search for 'One Piece' (it's long, I know)...",
  "Find some highly rated Action films...",
  // --- Movies (Classics & Masterpieces) ---
  "Try searching 'The Godfather'...",
  "Looking for 'The Lord of the Rings'?",
  "Search for 'The Matrix'...",
  "Try 'Pulp Fiction'...",
  "Search for 'The Shawshank Redemption'...",
  "Looking for 'Forrest Gump'?",
  "Try 'Fight Club'...",
  "Search for 'Goodfellas'...",
  "Looking for 'Star Wars'?",
  "Try searching 'Jurassic Park'...",
  "Search for 'The Silence of the Lambs'...",
  "Looking for 'Schindler\\'s List'?",
  "Try 'Se7en'...",
  "Search for 'Gladiator'...",
  "Looking for 'Titanic'?",
  "Try searching 'Avatar'...",
  "Search for 'The Lion King'...",
  "Looking for 'Terminator 2: Judgment Day'?",
  "Try 'Back to the Future'...",
  "Search for 'Alien' or 'Aliens'...",
  // --- Movies (Modern & Popular) ---
  "Try searching 'Parasite'...",
  "Looking for 'Whiplash'?",
  "Search for 'Mad Max: Fury Road'...",
  "Try 'Avengers: Endgame'...",
  "Search for 'Dune'...",
  "Looking for 'Oppenheimer'?",
  "Try searching 'Spider-Man: Across the Spider-Verse'...",
  "Search for 'Everything Everywhere All at Once'...",
  "Looking for 'Joker'?",
  "Try 'The Batman'...",
  "Search for 'Deadpool'...",
  "Looking for 'John Wick'...",
  "Try searching 'Top Gun: Maverick'...",
  "Search for 'Knives Out'...",
  "Looking for 'Get Out'?",
  // --- TV Series (Masterpieces & Popular) ---
  "Try searching 'The Wire'...",
  "Looking for 'The Sopranos'?",
  "Search for 'Succession'...",
  "Try 'Mad Men'...",
  "Search for 'Chernobyl'...",
  "Looking for 'Better Call Saul'?",
  "Try searching 'True Detective'...",
  "Search for 'The Office'...",
  "Looking for 'Seinfeld'?",
  "Try 'Friends'...",
  "Search for 'Dark'...",
  "Looking for 'The Boys'...",
  "Try searching 'Invincible'...",
  "Search for 'Arcane'...",
  "Looking for 'Peaky Blinders'?",
  "Try 'Black Mirror'...",
  "Search for 'The Crown'...",
  "Looking for 'Fargo'?",
  "Try searching 'Severance'...",
  "Search for 'The Last of Us'...",
  "Looking for 'House of the Dragon'?",
  "Try 'The Mandalorian'...",
  "Search for 'Loki'...",
  "Looking for 'WandaVision'?",
  "Try searching 'The Witcher'...",
  "Search for 'Squid Game'...",
  "Looking for 'Money Heist'?",
  "Try 'Mindhunter'...",
  "Search for 'Mr. Robot'...",
  // --- Anime (Masterpieces & Classics) ---
  "Try searching 'Fullmetal Alchemist: Brotherhood'...",
  "Looking for 'Death Note'?",
  "Search for 'Cowboy Bebop'...",
  "Try 'Neon Genesis Evangelion'...",
  "Search for 'Akira'...",
  "Looking for 'Ghost in the Shell'?",
  "Try searching 'Hunter x Hunter'...",
  "Search for 'Steins;Gate'...",
  "Looking for 'Code Geass'?",
  "Try 'Monster'...",
  "Search for 'Berserk'...",
  "Looking for 'Gintama'...",
  "Try searching 'JoJo\\'s Bizarre Adventure'...",
  "Search for 'Dragon Ball Z'...",
  "Looking for 'Naruto Shippuden'?",
  "Try 'Bleach'...",
  "Search for 'Spirited Away'...",
  "Looking for 'Princess Mononoke'?",
  "Try searching 'Howl\\'s Moving Castle'...",
  // --- Anime (Modern & Popular) ---
  "Search for 'Demon Slayer'...",
  "Looking for 'My Hero Academia'?",
  "Try 'Chainsaw Man'...",
  "Search for 'Vinland Saga'...",
  "Looking for 'Mob Psycho 100'?",
  "Try searching 'One Punch Man'...",
  "Search for 'Violet Evergarden'...",
  "Looking for 'A Silent Voice'?",
  "Try 'Your Name'...",
  "Search for 'Cyberpunk: Edgerunners'...",
  "Looking for 'Frieren: Beyond Journey\\'s End'?",
  "Try searching 'Solo Leveling'...",
  "Search for 'Spy x Family'...",
  "Looking for 'Oshi no Ko'?",
  "Try 'Blue Lock'...",
  "Search for 'Haikyuu!!'...",
  "Looking for 'Tokyo Ghoul'?",
  "Try searching 'Sword Art Online'...",
  "Search for 'Fate/stay night'...",
  "Looking for 'Re:Zero'?"
];

const Search = ({ searchTerm, setSearchTerm, isSearching, onSubmit, onFilterClick }) => {
  const placeholder = useTypewriter(SEARCH_PROMPTS, 60, 40, 2500);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(searchTerm);
    }
  };

  return (
    <div className="search relative">
      <div>
        <img src="/search.svg" alt="search" />

        {!searchTerm && (
          <div className="absolute left-10 right-[80px] md:right-[230px] pointer-events-none text-light-200 text-xs sm:text-sm opacity-80 leading-tight md:text-base md:leading-normal">
            <span>{placeholder}</span>
            <span className="animate-pulse font-light ml-0.5">|</span>
          </div>
        )}

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={handleKeyDown}
          className="relative z-10 pr-[80px] md:pr-[230px] text-sm md:text-base"
        />

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3 z-20">
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-light-100/10 hover:bg-light-100/20 text-gray-300 hover:text-white rounded-full transition-colors text-sm font-medium mr-1"
              title="Filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filter
            </button>
          )}
          {isSearching && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <svg className="animate-spin h-5 w-5 text-[#ab8bff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-400 hover:text-white transition-colors bg-light-100/10 hover:bg-light-100/20 rounded-full p-1"
              title="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export default Search
