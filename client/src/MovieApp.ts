namespace MovieApp {

    export interface StreamingServices {
        country?: string;
        services?: any[];
    }

    export interface Season {
        air_date?: string;
        episode_count?: number;
        poster_path?: string;
        season_number?: number;
        overview?: string;
    }

    export interface UserRatings {
        movieId: number;
        score: number;
    }

    export interface ActivityData {
        image?: string;
        movie?: string;
        list?: string;
        rating?: number;
    }

    export type Config = {
        general: GeneralConfig,
        lists: ListsConfig
    }

    export type GeneralConfig = {
        country: string
    }

    export type ListsConfig = {
        favorites: ListConfig,
        watchList: ListConfig,
        watching: ListConfig,
        watched: ListConfig
    }

    export type ListConfig = {
        sorting: string,
        filtering: {
            movies: boolean,
            tvShows: boolean
        }
    }

}
