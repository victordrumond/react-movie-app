import { createContext } from 'react';

export const initUserData = {
    user: "email",
    data: {
        favorites: [],
        watchList: [],
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
            watched: {
                filtering: "last_added"
            }
        }
    }
}

export const UserContext = createContext({
    userData: initUserData,
    setUserData: () => {}
});
