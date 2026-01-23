import useLocalStorage from './useLocalStorage';

export const useFavorites = () => {
    const [favorites, setFavorites] = useLocalStorage('movie-app-favorites', []);

    const addFavorite = (movie) => {
        if (!favorites.some(fav => fav.id === movie.id)) {
            setFavorites([...favorites, movie]);
        }
    };

    const removeFavorite = (movieId) => {
        setFavorites(favorites.filter(movie => movie.id !== movieId));
    };

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId);
    };

    return { favorites, addFavorite, removeFavorite, isFavorite };
};
