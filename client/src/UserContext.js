import { createContext } from 'react';

export const initUserData = {
    user: {
        email: "email",
        sub: "sub"
    },
    data: {
        favorites: [],
        watchList: [],
        watching: [],
        watched: [],
        ratings: []
    },
    config: {
        lists: {
            favorites: {
                sorting: "last_added", filtering: { movies: true, tvShows: true }
            },
            watchList: {
                sorting: "last_added", filtering: { movies: true, tvShows: true }
            },
            watching: {
                sorting: "last_added", filtering: { movies: true, tvShows: true }
            },
            watched: {
                sorting: "last_added", filtering: { movies: true, tvShows: true }
            }
        }
    },
    activities: []
}

export const UserContext = createContext({
    userData: initUserData,
    setUserData: () => {}
});
