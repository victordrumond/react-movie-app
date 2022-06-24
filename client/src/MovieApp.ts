namespace MovieApp {

    export type UserData = {
        user: User;
        data: Data;
        config: Config;
        activities: Activity[];
    }

    export type User = {
        email: string,
        sub: string
    }

    export type Data = {
        favorites: Production[],
        watchList: Production[],
        watching: Production[],
        watched: Production[],
        ratings: UserRatings[]
    }

    export type StreamingServices = {
        country?: string;
        services?: any[];
    }

    export type Season = {
        air_date?: string;
        episode_count?: number;
        poster_path?: string;
        season_number?: number;
        overview?: string;
    }

    export type Production = {
        timestamp: number;
        data: TMDb.MovieObject | TMDb.TvShowObject;
    }

    export type UserRatings = {
        movieId: number;
        score: number;
    }

    export type Activity = {
        label: string,
        data: ActivityData,
        timestamp: number
    }

    export type ActivityData = {
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
