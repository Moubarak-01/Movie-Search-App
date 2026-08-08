import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterMenu = ({ isOpen, onClose, onApplyFilters }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);

    const genres = [
        { id: 28, name: "Action" },
        { id: 10759, name: "Action & Adventure" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentary" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 10762, name: "Kids" },
        { id: 10402, name: "Music" },
        { id: 9648, name: "Mystery" },
        { id: 10763, name: "News" },
        { id: 10764, name: "Reality" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Sci-Fi" },
        { id: 10765, name: "Sci-Fi & Fantasy" },
        { id: 10766, name: "Soap" },
        { id: 10767, name: "Talk" },
        { id: 53, name: "Thriller" },
        { id: 10770, name: "TV Movie" },
        { id: 10752, name: "War" },
        { id: 10768, name: "War & Politics" },
        { id: 37, name: "Western" }
    ];

    const toggleGenre = (id) => {
        setSelectedGenres(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const handleApply = () => {
        onApplyFilters({ genres: selectedGenres, minRating });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Filter Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 bottom-4 top-20 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-5xl bg-[#141414] border border-gray-800 rounded-3xl z-50 p-6 md:p-10 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">Advanced Filters</h2>
                            <button onClick={onClose} className="p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Genres */}
                        <div className="mb-8">
                            <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {genres.map(genre => {
                                    const isSelected = selectedGenres.includes(genre.id);
                                    return (
                                        <button
                                            key={genre.id}
                                            onClick={() => toggleGenre(genre.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                }`}
                                        >
                                            {genre.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Min Rating */}
                        <div className="mb-10">
                            <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Minimum Score: {minRating}</h3>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.5"
                                value={minRating}
                                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>0</span>
                                <span>5</span>
                                <span>10</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setSelectedGenres([]);
                                    setMinRating(0);
                                    onApplyFilters({ genres: [], minRating: 0 });
                                    onClose();
                                }}
                                className="flex-1 py-3 px-4 bg-gray-800 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition"
                            >
                                Apply
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterMenu;
