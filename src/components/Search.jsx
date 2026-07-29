import React from 'react'

const Search = ({ searchTerm, setSearchTerm, isSearching, onSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(searchTerm);
    }
  };

  return (
    <div className="search relative">
      <div>
        <img src="/search.svg" alt="search" />

        <input
          type="text"
          placeholder="Search for Movies, Series & Animes here... can't download em though😓😓"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-xs text-gray-400 font-medium">
             <svg className="animate-spin h-5 w-5 text-[#ab8bff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          </div>
        )}
      </div>
    </div>
  )
}
export default Search
