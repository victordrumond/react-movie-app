namespace TMDb {
    
    export interface MovieObject {
        backdrop_path?: string | null;
        credits?: Credits;
        genres?: Genre[] | string[];
        id?: number;
        media_type?: string;
        original_title?: string;
        overview?: string;
        poster_path?: string;
        production_companies?: ProductionCompany[];
        release_date?: string;
        release_dates?: ReleaseDates;
        runtime?: number | null;
        status?: string;
        title?: string;
        vote_average?: number;
        "watch/providers"?: WatchProviders;
    }

    export interface TvShowObject {
        backdrop_path?: string | null;
        created_by?: Person[];
        credits?: Credits;
        content_ratings?: ContentRatings;
        first_air_date?: string;
        genres?: Genre[] | string[];
        id?: number;
        in_production?: boolean;
        last_air_date?: string;
        media_type?: string;
        name?: string;
        networks?: Network[];
        number_of_episodes?: number;
        number_of_seasons?: number;
        original_name?: string;
        overview?: string;
        poster_path?: string;
        production_companies?: ProductionCompany[];
        seasons?: Season[];
        status?: string;
        vote_average?: number;
        "watch/providers"?: WatchProviders;
    }

    export interface SearchObject {
        backdrop_path?: string | null;
        first_air_date?: string;
        id?: number;
        media_type?: string;
        name?: string;
        original_name?: string;
        original_title?: string;
        poster_path?: string | null;
        release_date?: string;
        title?: string;
        vote_average?: number;
    }

    interface Genre {
        name?: string;
    }

    interface Credits {
        cast?: Person[] | string[];
        crew?: Person[] | string[];
    }

    interface Person {
        known_for_department?: string;
        name?: string;
        job?: string;
    }

    interface ProductionCompany {
        name?: string;
    }

    interface ReleaseDates {
        results?: ReleaseDateResult[];
    }

    interface ReleaseDateResult {
        iso_3166_1?: string;
        release_dates?: ReleaseDatesObject[];
    }

    interface ReleaseDatesObject {
        certification?: string;
    }

    interface WatchProviders {
        results?: WatchProvidersObject;
    }

    interface WatchProvidersObject {
        [key: string]: any;
    }

    interface ContentRatings {
        results?: ContentRatingsObject[];
    }

    interface ContentRatingsObject {
        iso_3166_1?: string;
        rating?: string;
    }

    interface Season {
        season_number?: number;
    }

    interface Network {
        name?: string;
    }

}
