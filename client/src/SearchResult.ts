export class SearchResult {

    result: TMDb.SearchObject;

    constructor(resultObj: TMDb.SearchObject) {
        this.result = resultObj;
    }

    isMovie(): boolean {
        return (this.result.media_type === 'movie' || this.result.title) ? true : false;
    }

    isTvShow(): boolean {
        return (this.result.media_type === 'tv' || this.result.name) ? true : false;
    }

    getTitle(): string {
        if (this.isMovie()) {
            return this.result.title || '';
        }
        if (this.isTvShow()) {
            return this.result.name || '';
        }
        return '';
    }

    getOriginalTitle(): string {
        if (this.isMovie()) {
            return this.result.original_title || '';
        }
        if (this.isTvShow()) {
            return this.result.original_name || '';
        }
        return '';
    }

    getReleaseDate(): string {
        if (this.isMovie()) {
            return this.result.release_date || '';
        }
        if (this.isTvShow()) {
            return this.result.first_air_date || '';
        }
        return '';
    }

    getReleaseYear(): string {
        return this.getReleaseDate().substring(0, 4);
    }

    getPosterPath(): string | null {
        if (this.result.poster_path) {
            return `https://image.tmdb.org/t/p/w500${this.result.poster_path}`;
        }
        return null;
    }

    getBackdropPath(): string | null {
        if (this.result.backdrop_path) {
            return `https://image.tmdb.org/t/p/w500${this.result.backdrop_path}`;
        }
        return null;
    }

    getAverageRating(): string {
        if (this.result.vote_average) {
            let rating = this.result.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        }
        return 'Not Rated';
    }
    
}
