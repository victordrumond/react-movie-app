class TvShow {

    constructor(tvShowObj, timestamp) {
        this.item = tvShowObj;
        this.timestamp = timestamp;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getId() {
        return this.item.id;
    }

    getTitle() {
        return this.item.name || '';
    }

    getOriginalTitle() {
        return this.item.original_name || '';
    }

    getReleaseDate() {
        return this.item.first_air_date || '';
    }

    getReleaseYear() {
        return this.getReleaseDate().substring(0, 4);
    }

    getYears() {
        let releaseYear = this.getReleaseYear();
        let lastYear = this.item.in_production ? 'Today' : this.item.last_air_date.substring(0, 4);
        return `${releaseYear} - ${lastYear}`;
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

    getAverageRating() {
        if (this.item.vote_average) {
            let rating = this.item.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        }
        return 'Not Rated';
    }

    getParentalRating() {
        if (this.item.content_ratings) {
            let worldRatings = this.item.content_ratings.results;
            let usRating = worldRatings.filter(item => item.iso_3166_1 === 'US');
            let usParentalRating = usRating.length > 0 ? usRating[0].rating : 'PG not found';
            return usParentalRating || 'PG not found';
        }
        return 'PG not found';
    }

    getNumberOfSeasons() {
        let numOfSeasons = this.item.number_of_seasons === 1 ? `${this.item.number_of_seasons} Season` : `${this.item.number_of_seasons} Seasons`;
        return numOfSeasons || 'Unknown';
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

    getCreators() {
        if (this.item.created_by.length > 0) {
            return this.item.created_by.map(item => (item.name));
        }
        return [];
    }
    
    getProductionCompanies() {
        if (this.item.production_companies.length > 0) {
            return this.item.production_companies.map(item => (item.name));
        }
        return [];
    }

    getNetworks() {
        if (this.item.networks.length > 0) {
            return this.item.networks.map(item => (item.name));
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

export default TvShow;
