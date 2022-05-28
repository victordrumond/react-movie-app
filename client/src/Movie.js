class Movie {

    constructor(movieObj) {
        this.movie = movieObj;
    }

    getTitle() {
        return this.movie.title || '';
    }

    getReleaseDate() {
        return this.movie.release_date || '';
    }

    getReleaseYear() {
        return this.movie.release_date.substring(0, 4) || '';
    }

    getPosterPath() {
        return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}` || null;
    }

    getBackdropPath() {
        return `https://image.tmdb.org/t/p/w500${this.movie.backdrop_path}` || null;
    }

    getStatus() {
        return this.movie.status || 'Unknown';
    }

    getRuntime() {
        return `${this.movie.runtime} min` || 'Unknown';
    }

    getAverageRating() {
        if (this.movie.vote_average) {
            let rating = this.movie.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        } else {
            return '';
        }
    }

    getParentalRating() {
        if (this.movie.release_dates.results) {
            let worldReleases = this.movie.release_dates.results;
            let unitedStatesPR = worldReleases.filter(item => item.iso_3166_1 === 'US');
            return unitedStatesPR.length > 0 ? unitedStatesPR[0].release_dates[0].certification : 'Not Rated';
        } else {
            return 'Not found';
        }
    }

    getOverview() {
        return this.movie.overview || 'Overview not found';
    }

    getGenres() {
        return this.movie.genres.map(item => (' ' + item.name)) || 'Genres not found';
    }

    getCast() {
        return this.movie.credits.cast.filter((item, i) => item.known_for_department === "Acting" && i < 8).map(item => (' ' + item.name)) || 'Cast not found';
    }

    getDirectors() {
        return this.movie.credits.crew.filter(item => item.job === "Director").map(item => (" " + item.name)) || 'Directors not found';
    }
    
    getProductionCompanies() {
        return this.movie.production_companies.map(item => (" " + item.name)) || 'Production companies not found';
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
