namespace MovieApp {

    export type UserData = {
        user: User;
        movies: SavedItem[];
        config: Config;
        activities: Activity[];
    }

    export type User = {
        email: string,
        sub: string
    }

    export type SavedItem = {
        data: TMDb.MovieObject | TMDb.TvShowObject,
        lists: SavedList[],
        score: number | null,
        timestamp: number
    }

    export type SavedList = {
        list: string,
        timestamp: number
    }

    export type CountryWatchServices = {
        country: string;
        services: WatchServices;
    }

    export type WatchServices = {
        buy: object[];
        flatrate: object[];
        rent: object[];
    }

    export type Season = {
        air_date?: string;
        episode_count?: number;
        poster_path?: string;
        season_number?: number;
        overview?: string;
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

    export type Filtering = {
        movies: boolean,
        tvShows: boolean
    }

}
