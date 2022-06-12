class SearchResult {

    constructor(resultObj) {
        this.result = resultObj;
    }

    isMovie() {
        return this.result.media_type === 'movie' || this.result.title;
    }

    isTvShow() {
        return this.result.media_type === 'tv' || this.result.name;
    }

    getTitle() {
        if (this.isMovie()) {
            return this.result.title || '';
        }
        if (this.isTvShow()) {
            return this.result.name || '';
        }
        return this.result.title || this.result.name || '';
    }

    getOriginalTitle() {
        if (this.isMovie()) {
            return this.result.original_title || '';
        }
        if (this.isTvShow()) {
            return this.result.original_name || '';
        }
        return this.result.original_title || this.result.original_name || '';
    }

    getReleaseDate() {
        if (this.isMovie()) {
            return this.result.release_date || '';
        }
        if (this.isTvShow()) {
            return this.result.first_air_date || '';
        }
        return this.result.release_date || this.result.first_air_date || '';
    }

    getReleaseYear() {
        return this.getReleaseDate().substring(0, 4);
    }

    getPosterPath() {
        if (this.result.poster_path) {
            return `https://image.tmdb.org/t/p/w500${this.result.poster_path}`;
        }
        return null;
    }

    getBackdropPath() {
        if (this.result.backdrop_path) {
            return `https://image.tmdb.org/t/p/w500${this.result.backdrop_path}`;
        }
        return null;
    }

    getAverageRating() {
        if (this.result.vote_average) {
            let rating = this.result.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        }
        return 'Not Rated';
    }
}

export default SearchResult;
