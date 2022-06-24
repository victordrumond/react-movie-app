import { createContext } from 'react';

export const initUserData: MovieApp.UserData = {
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
            favorites: { sorting: "last_added", filtering: { movies: true, tvShows: true } },
            watchList: { sorting: "last_added", filtering: { movies: true, tvShows: true } },
            watching: { sorting: "last_added", filtering: { movies: true, tvShows: true } },
            watched: { sorting: "last_added", filtering: { movies: true, tvShows: true } }
        },
        general: { country: "US" }
    },
    activities: []
}

export const UserContext: React.Context<{
    userData: MovieApp.UserData;
    setUserData: () => void;
}> = createContext({
    userData: initUserData,
    setUserData: () => { }
});
