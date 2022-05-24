import axios from 'axios';

class Requests {

    // Get trending movies to display on home page
    static getCovers = () => {
        return axios.get("/authcovers");
    }

    // Get user from database
    static getUser = (user) => {
        return axios.get(`/users/${user}`);
    }

    // Set new user on database
    static setUser = (user) => {
        return axios.post(`/newuser/${user}`);
    }

    // Get data to fill search results
    static searchFor = (query) => {
        return axios.get(`/search/${query}`);
    }

    // Get detailed data from specific movie
    static getMovieData = (movieId) => {
        return axios.get(`/movie/${movieId}`);
    }

    // Set movie on database
    static addMovie = (user, list, movie) => {
        return axios.post('/addmovie', { user: user, list: list, movie: movie });
    }

    // Delete movie from database
    static deleteMovie = (user, list, movie) => {
        return axios.post('/deletemovie', { user: user, list: list, movie: movie });
    }

    // Set filtering option to list
    static setFilter = (user, list, filter) => {
        return axios.post('/updatefilter', { user: user, list: list, value: filter });
    }

}

export default Requests;
