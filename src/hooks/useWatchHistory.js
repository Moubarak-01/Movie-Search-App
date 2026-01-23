import useLocalStorage from './useLocalStorage';

export const useWatchHistory = () => {
    const [history, setHistory] = useLocalStorage('movie-app-history', []);

    const addToHistory = (movie) => {
        // Remove if already exists (to move it to top)
        const filteredHistory = history.filter(h => h.id !== movie.id);
        // Add to beginning, limit to 20 items
        setHistory([movie, ...filteredHistory].slice(0, 20));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return { history, addToHistory, clearHistory };
};
