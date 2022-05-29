class LocalStorage {

    static isMovieInLocalStorage = (movieId) => {
        let expandedMoviesFromLS = JSON.parse(localStorage.getItem('expandedMovies'));
        if (!expandedMoviesFromLS) {
            return false;
        }
        for (const movie of expandedMoviesFromLS) {
            if (movie.id === movieId) {
                return true;
            }
        }
        return false;
    }

    static getMovieFromLocalStorage = (movieId) => {
        let expandedMoviesFromLS = JSON.parse(localStorage.getItem('expandedMovies'));
        if (!expandedMoviesFromLS) {
            return null;
        }
        for (const movie of expandedMoviesFromLS) {
            if (movie.id === movieId) {
                return movie;
            }
        }
        return null;
    }

    static setMovieInLocalStorage = (movieObj) => {
        let expandedMoviesFromLS = JSON.parse(localStorage.getItem('expandedMovies'));
        if (!expandedMoviesFromLS) {
            let expandedMovies = [movieObj];
            localStorage.setItem('expandedMovies', JSON.stringify(expandedMovies));
            return;
        }
        expandedMoviesFromLS.push(movieObj);
        localStorage.setItem('expandedMovies', JSON.stringify(expandedMoviesFromLS));
    }

}

export default LocalStorage;
