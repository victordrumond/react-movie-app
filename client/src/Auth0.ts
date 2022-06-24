namespace Auth0 {

    export interface User {
        email: string;
        email_verified: boolean;
        name: string;
        nickname: string;
        picture: string;
        sub: string;
        updated_at: string;
    }

}