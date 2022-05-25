import { createContext } from 'react';

let initUser = {
    email: "email",
    email_verified: false,
    name: "name",
    nickname: "nickname",
    picture: "picture",
    sub: "sub",
    updated_at: "updated_at"
}

export const UserContext = createContext(initUser);
