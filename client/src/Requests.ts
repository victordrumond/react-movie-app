import axios, { AxiosPromise } from 'axios';

export module Requests {

    // Edit user profile
    export function editUserProfile(token: string, userId: string, name: string, nickname: string, picture: string): AxiosPromise {
        const body = { userId: userId, name: name, nickname: nickname, picture: picture };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.patch('/api/users/edituser', body, config);
    }

    // Get trending movies to display on home page
    export function getCovers(): AxiosPromise {
        return axios.get("/api/authcovers");
    }

    // Get TBDb country list
    export function getCountryList(): AxiosPromise {
        return axios.get("/api/config/countries");
    }

    // Get user from database
    export function getUser(token: string, userObj: Auth0.User): AxiosPromise {
        const body = { user: userObj };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/users/login', body, config);
    }

    // Set new user on database
    export function setUser(token: string, userObj: Auth0.User): AxiosPromise {
        const body = { user: userObj };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post(`/api/users/newuser`, body, config);
    }

    // Get data to fill search results
    export function searchFor(query: string): AxiosPromise {
        return axios.get(`/api/search/${query}`);
    }

    // Get detailed data from specific movie/tv show
    export function getMovieData(token: string, item: TMDb.SearchObject): AxiosPromise {
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return item.media_type === 'movie' ? axios.get(`/api/movie/${item.id}`, config) : axios.get(`/api/tv/${item.id}`, config);
    }

    // Set item on database
    export function addItem(token: string, userObj: Auth0.User, list: string, itemObj: TMDb.SearchObject): AxiosPromise {
        const body = { user: userObj, list: list, item: itemObj };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/add', body, config);
    }

    // Delete movie from database
    export function deleteMovie(token: string, userObj: Auth0.User, list: string, movie: TMDb.SearchObject): AxiosPromise {
        const body = { user: userObj, list: list, movie: movie };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/deletemovie', body, config);
    }

    // Set sorting option to list
    export function setSorting(token: string, userObj: Auth0.User, list: string, sort: string): AxiosPromise {
        const body = { user: userObj, list: list, value: sort };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/updatesorting', body, config);
    }

    // Set filtering option to list
    export function setFiltering(token: string, userObj: Auth0.User, list: string, filter: string, value: boolean): AxiosPromise {
        const body = { user: userObj, list: list, filter: filter, value: value };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/updatefiltering', body, config);
    }

    // Update movie rating
    export function updateMovieRating(token: string, userObj: Auth0.User, movie: TMDb.SearchObject, score: number | null): AxiosPromise {
        const body = { user: userObj, movie: movie, score: score };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/updaterating', body, config);
    }

    // Update country
    export function updateCountry(token: string, userObj: Auth0.User, countryCode: string): AxiosPromise {
        const body = { user: userObj, country: countryCode };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/updatecountry', body, config);
    }

    // Manage TV show seasons on each list
    export function manageSeasons(token: string, userObj: Auth0.User, id: number, list: string, season: number): AxiosPromise {
        const body = { user: userObj, itemId: id, list: list, season: season };
        const config = {
            headers: { Authorization: "Bearer " + token }
        };
        return axios.post('/api/tv/manageseasons', body, config);
    }

}
