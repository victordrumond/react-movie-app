import axios from 'axios';

class Requests {

    // Edit user profile
    static editUserProfile = (token, userId, name, nickname, picture) => {
        const body = { userId: userId, name: name, nickname: nickname, picture: picture };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.patch('/api/users/edituser', body, config);
    }

    // Get trending movies to display on home page
    static getCovers = () => {
        return axios.get("/api/authcovers");
    }

    // Get user from database
    static getUser = (token, userObj) => {
        const body = { user: userObj };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/users/login', body, config);
    }

    // Set new user on database
    static setUser = (token, userObj) => {
        const body = { user: userObj };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post(`/api/users/newuser`, body, config);
    }

    // Get data to fill search results
    static searchFor = (query) => {
        return axios.get(`/api/search/${query}`);
    }

    // Get detailed data from specific movie
    static getMovieData = (token, movieId) => {
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.get(`/api/movie/${movieId}`, config);
    }

    // Set movie on database
    static addMovie = (token, userObj, list, movie) => {
        const body = { user: userObj, list: list, movie: movie };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/addmovie', body, config);
    }

    // Delete movie from database
    static deleteMovie = (token, userObj, list, movie) => {
        const body = { user: userObj, list: list, movie: movie };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/deletemovie', body, config);
    }

    // Set filtering option to list
    static setFilter = (token, userObj, list, filter) => {
        const body = { user: userObj, list: list, value: filter };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/updatefilter', body, config);
    }

    // Update movie rating
    static updateMovieRating = (token, userObj, movie, score) => {
        const body = { user: userObj, movie: movie, score: score };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/updaterating', body, config);
    }

}

export default Requests;
