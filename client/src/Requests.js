import axios from 'axios';

class Requests {

    // Edit user profile
    static editUserProfile = (token, userId, name, nickname, picture) => {
        const body = { userId: userId, name: name, nickname: nickname, picture: picture };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.patch('/api/users/edituser', body, config)
    }

    // Get trending movies to display on home page
    static getCovers = () => {
        return axios.get("/api/authcovers");
    }

    // Get user from database
    static getUser = (userObj) => {
        return axios.get(`/api/users/${userObj.email}`);
    }

    // Set new user on database
    static setUser = (userObj) => {
        return axios.post(`/api/users/newuser`, { user: userObj });
    }

    // Get data to fill search results
    static searchFor = (query) => {
        return axios.get(`/api/search/${query}`);
    }

    // Get detailed data from specific movie
    static getMovieData = (movieId) => {
        return axios.get(`/api/movie/${movieId}`);
    }

    // Set movie on database
    static addMovie = (userObj, list, movie) => {
        return axios.post('/api/addmovie', { user: userObj, list: list, movie: movie });
    }

    // Delete movie from database
    static deleteMovie = (userObj, list, movie) => {
        return axios.post('/api/deletemovie', { user: userObj, list: list, movie: movie });
    }

    // Set filtering option to list
    static setFilter = (userObj, list, filter) => {
        return axios.post('/api/updatefilter', { user: userObj, list: list, value: filter });
    }

    // Update movie rating
    static updateMovieRating = (userObj, movie, score) => {
        return axios.post('/api/updaterating', { user: userObj, movie: movie, score: score })
    }

}

export default Requests;
