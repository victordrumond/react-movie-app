import Helper from './Helper';

class LocalStorage {

    static hasExpandedMovie = (movieId) => {
        let expandedMovies = JSON.parse(localStorage.getItem('expandedMovies'));
        if (!expandedMovies) {
            return false;
        }
        for (const movie of expandedMovies) {
            if (movie.id === movieId) {
                return true;
            }
        }
        return false;
    }

    static getExpandedMovie = (movieId) => {
        let expandedMovies = JSON.parse(localStorage.getItem('expandedMovies'));
        if (!expandedMovies) {
            return null;
        }
        for (const movie of expandedMovies) {
            if (movie.id === movieId) {
                return movie;
            }
        }
        return null;
    }

    static setExpandedMovie = (movie) => {
        let expandedMovies = JSON.parse(localStorage.getItem('expandedMovies'));
        if (!expandedMovies) {
            let expandedMovies = [movie];
            localStorage.setItem('expandedMovies', JSON.stringify(expandedMovies));
            return;
        }
        expandedMovies.push(movie);
        localStorage.setItem('expandedMovies', JSON.stringify(expandedMovies));
    }

    static hasUpdatedTrendingCovers = () => {
        let trendingCovers = JSON.parse(localStorage.getItem('trendingCovers'));
        if (trendingCovers && trendingCovers.covers.length > 0) {
            let today = Helper.getComparableDate(Date.now());
            let lastUpdate = Helper.getComparableDate(trendingCovers.updated);
            if (today === lastUpdate) {
                return true;
            }
        }
        return false;
    }

    static getTrendingCovers = () => {
        let trendingCovers = JSON.parse(localStorage.getItem('trendingCovers'));
        if (trendingCovers) {
            return trendingCovers.covers;
        }
        return null;
    }

    static setTrendingCovers = (movies) => {
        let covers = [];
        for (const movie of movies) {
            covers.push(movie);
        }
        let updatedTrendingCovers = {
            updated: Date.now(),
            covers: covers
        }
        localStorage.setItem('trendingCovers', JSON.stringify(updatedTrendingCovers));
    }

    static hasUpdatedCountryList = () => {
        let countryList = JSON.parse(localStorage.getItem('countryList'));
        if (countryList && countryList.data.length > 0) {
            let today = Helper.getComparableDate(Date.now());
            let lastUpdate = Helper.getComparableDate(countryList.updated);
            if (today === lastUpdate) {
                return true;
            }
        }
        return false;
    }

    static getCountryList = () => {
        let countryList = JSON.parse(localStorage.getItem('countryList'));
        if (countryList) {
            return countryList.data;
        }
        return null;
    }

    static setCountryList = (countries) => {
        let updatedCountryList = {
            updated: Date.now(),
            data: countries
        }
        localStorage.setItem('countryList', JSON.stringify(updatedCountryList));
    }

}

export default LocalStorage;
