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

}
