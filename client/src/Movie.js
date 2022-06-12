class Movie {

    constructor(movieObj) {
        this.movie = movieObj;
    }

    isMovie() {
        return this.movie.media_type === 'movie';
    }

    isTvShow() {
        return this.movie.media_type === 'tv';
    }

    getId() {
        return this.movie.id;
    }

    getTitle() {
        if (this.isMovie()) {
            return this.movie.title || '';
        }
        if (this.isTvShow()) {
            return this.movie.name || '';
        }
        return this.movie.title || this.movie.name || '';
    }

    getOriginalTitle() {
        if (this.isMovie()) {
            return this.movie.original_title || '';
        }
        if (this.isTvShow()) {
            return this.movie.original_name || '';
        }
        return this.movie.original_title || this.movie.original_name || '';
    }

    getReleaseDate() {
        if (this.isMovie()) {
            return this.movie.release_date || '';
        }
        if (this.isTvShow()) {
            return this.movie.first_air_date || '';
        }
        return this.movie.release_date || this.movie.first_air_date || '';
    }

    getReleaseYear() {
        if (this.isMovie()) {
            return this.movie.release_date ? this.movie.release_date.substring(0, 4) : '';
        }
        if (this.isTvShow()) {
            return this.movie.first_air_date ? this.movie.first_air_date.substring(0, 4) : '';
        }
        return this.getReleaseDate().substring(0, 4);
    }

    getPosterPath() {
        if (this.movie.poster_path) {
            return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
        }
        return null;
    }

    getBackdropPath() {
        if (this.movie.backdrop_path) {
            return `https://image.tmdb.org/t/p/w500${this.movie.backdrop_path}`;
        }
        return null;
    }

    getStatus() {
        return this.movie.status || 'Unknown';
    }

    getRuntime() {
        if (this.movie.runtime) {
            return `${this.movie.runtime} min`;
        }
        return 'Not Available';
    }

    getAverageRating() {
        if (this.movie.vote_average) {
            let rating = this.movie.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        }
        return 'Not Rated';
    }

    getParentalRating() {
        if (this.movie.release_dates) {
            let worldReleases = this.movie.release_dates.results;
            let usRelease = worldReleases.filter(item => item.iso_3166_1 === 'US');
            let usParentalRating = usRelease.length > 0 ? usRelease[0].release_dates[0].certification : 'PG not found';
            return usParentalRating || 'PG not found';
        } else {
            return 'PG not found';
        }
    }

    getOverview() {
        return this.movie.overview || 'Overview not found';
    }

    getGenres() {
        if (this.movie.genres.length > 0) {
            return this.movie.genres.map(item => (item.name));
        }
        return [];
    }

    getCast() {
        if (this.movie.credits.cast.length > 0) {
            return this.movie.credits.cast.filter((item, i) => item.known_for_department === "Acting" && i < 8).map(item => (item.name));
        }
        return [];
    }

    getDirection() {
        if (this.movie.credits.crew.length > 0) {
            return this.movie.credits.crew.filter(item => item.job === "Director").map(item => (item.name));
        }
        return [];
    }
    
    getProductionCompanies() {
        if (this.movie.production_companies.length > 0) {
            return this.movie.production_companies.map(item => (item.name));
        }
        return [];
    }

    getStreamingServices() {
        let providers = Object.entries(this.movie["watch/providers"].results);
        let streamingServices = []
        for (const provider of providers) {
            let code = provider[0];
            let data = provider[1];
            if (data.hasOwnProperty('flatrate')) {
                streamingServices.push({
                    country: code,
                    services: data.flatrate
                });
            };
        };
        return streamingServices;
    }
}

export default Movie;
