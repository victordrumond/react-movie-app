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
                filtering: "last_added"
            },
            watchList: {
                filtering: "last_added"
            },
            watching: {
                filtering: "last_added"
            },
            watched: {
                filtering: "last_added"
            }
        }
    },
    activities: []
}

export const UserContext = createContext({
    userData: initUserData,
    setUserData: () => {}
});
