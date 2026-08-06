import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterMenu = ({ isOpen, onClose, onApplyFilters }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minRating, setMinRating] = useState(0);

    const genres = [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 27, name: "Horror" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Sci-Fi" },
        { id: 53, name: "Thriller" },
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
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-[85vw] max-w-sm bg-[#1a1a1a] border-l border-gray-800 z-50 p-6 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Filters</h2>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
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
