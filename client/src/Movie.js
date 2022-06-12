class Movie {

    constructor(movieObj) {
        this.item = movieObj;
    }

    getId() {
        return this.item.id;
    }

    getTitle() {
        return this.item.title || '';
    }

    getOriginalTitle() {
        return this.item.original_title || '';
    }

    getReleaseDate() {
        return this.item.release_date || '';
    }

    getReleaseYear() {
        return this.getReleaseDate().substring(0, 4);
    }

    getPosterPath() {
        if (this.item.poster_path) {
            return `https://image.tmdb.org/t/p/w500${this.item.poster_path}`;
        }
        return null;
    }

    getBackdropPath() {
        if (this.item.backdrop_path) {
            return `https://image.tmdb.org/t/p/w500${this.item.backdrop_path}`;
        }
        return null;
    }

    getStatus() {
        return this.item.status || 'Unknown';
    }

    getRuntime() {
        if (this.item.runtime) {
            return `${this.item.runtime} min`;
        }
        return 'Not Available';
    }

    getAverageRating() {
        if (this.item.vote_average) {
            let rating = this.item.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        }
        return 'Not Rated';
    }

    getParentalRating() {
        if (this.item.release_dates) {
            let worldReleases = this.item.release_dates.results;
            let usRelease = worldReleases.filter(item => item.iso_3166_1 === 'US');
            let usParentalRating = usRelease.length > 0 ? usRelease[0].release_dates[0].certification : 'PG not found';
            return usParentalRating || 'PG not found';
        }
        return 'PG not found';
    }

    getOverview() {
        return this.item.overview || 'Overview not found';
    }

    getGenres() {
        if (this.item.genres.length > 0) {
            return this.item.genres.map(item => (item.name));
        }
        return [];
    }

    getCast() {
        if (this.item.credits.cast.length > 0) {
            return this.item.credits.cast.filter((item, i) => item.known_for_department === "Acting" && i < 8).map(item => (item.name));
        }
        return [];
    }

    getDirection() {
        if (this.item.credits.crew.length > 0) {
            return this.item.credits.crew.filter(item => item.job === "Director").map(item => (item.name));
        }
        return [];
    }
    
    getProductionCompanies() {
        if (this.item.production_companies.length > 0) {
            return this.item.production_companies.map(item => item.name);
        }
        return [];
    }

    getStreamingServices() {
        let providers = Object.entries(this.item["watch/providers"].results);
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
