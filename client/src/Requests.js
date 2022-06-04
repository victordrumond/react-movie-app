import axios from 'axios';

class Requests {

    // Edit user profile
    static editUserProfile = (token, userId, name, nickname) => {
        const body = { userId: userId, name: name, nickname: nickname };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.patch('/user/edituser', body, config)
    }

    // Get trending movies to display on home page
    static getCovers = () => {
        return axios.get("/authcovers");
    }

    // Get user from database
    static getUser = (user) => {
        return axios.get(`/users/${user}`);
    }

    // Set new user on database
    static setUser = (userObj) => {
        return axios.post(`/newuser`, { user: userObj });
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

    // Update movie rating
    static updateMovieRating = (user, movie, score) => {
        return axios.post('/updaterating', { user: user, movie: movie, score: score })
    }

}

export default Requests;
