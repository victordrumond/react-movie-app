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
                sorting: "last_added"
            },
            watchList: {
                sorting: "last_added"
            },
            watching: {
                sorting: "last_added"
            },
            watched: {
                sorting: "last_added"
            }
        }
    },
    activities: []
}

export const UserContext = createContext({
    userData: initUserData,
    setUserData: () => {}
});
