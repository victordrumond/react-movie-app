export class Movie {

    item: TMDb.MovieObject;
    timestamp: number;

    constructor(movieObj: TMDb.MovieObject, timestamp: number) {
        this.item = movieObj;
        this.timestamp = timestamp;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    getId(): number | null {
        return this.item.id || null;
    }

    getTitle(): string {
        return this.item.title || '';
    }

    getOriginalTitle(): string {
        return this.item.original_title || '';
    }

    getReleaseDate(): string {
        return this.item.release_date || '';
    }

    getReleaseYear(): string {
        return this.getReleaseDate().substring(0, 4);
    }

    getPosterPath(): string | null {
        if (this.item.poster_path) {
            return `https://image.tmdb.org/t/p/w500${this.item.poster_path}`;
        }
        return null;
    }

    getBackdropPath(): string | null {
        if (this.item.backdrop_path) {
            return `https://image.tmdb.org/t/p/w500${this.item.backdrop_path}`;
        }
        return null;
    }

    getStatus(): string {
        return this.item.status || 'Unknown';
    }

    getRuntime(): string {
        return this.item.runtime ? `${this.item.runtime} min` : 'Not Available';
    }

    getAverageRating(): string {
        if (this.item.vote_average) {
            let rating = this.item.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        }
        return 'Not Rated';
    }

    getParentalRating(countryCode: string): string {
        if (this.item.release_dates && this.item.release_dates.results) {
            let worldReleases = this.item.release_dates.results;
            let localReleases = worldReleases.filter(item => item.iso_3166_1 === countryCode);
            if (localReleases.length > 0) {
                if (localReleases[0].release_dates && localReleases[0].release_dates[0].certification) {
                    let rating = localReleases[0].release_dates[0].certification;
                    return rating;
                }
            }
        }
        return 'PG not found';
    }

    getOverview(): string {
        return this.item.overview || 'Overview not found';
    }

    getGenres(): string[] {
        let genres: string[] = [];
        if (this.item.genres) {
            for (const genre of this.item.genres) {
                if (genre.name) {
                    genres.push(genre.name);
                }
            }
        }
        return genres;
    }

    getCast(): string[] {
        let cast: string[] = [];
        if (this.item.credits && this.item.credits.cast) {
            for (const person of this.item.credits.cast) {
                if (person.name && person.known_for_department === 'Acting') {
                    cast.push(person.name);
                }
            }
        }
        return cast.length > 8 ? cast.slice(0, 8) : cast;
    }

    getDirection(): string[] {
        let crew: string[] = [];
        if (this.item.credits && this.item.credits.crew) {
            for (const person of this.item.credits.crew) {
                if (person.name && person.job === 'Director') {
                    crew.push(person.name);
                }
            }
        }
        return crew;
    }

    getProductionCompanies(): string[] {
        let companies: string[] = [];
        if (this.item.production_companies) {
            for (const company of this.item.production_companies) {
                if (company.name) {
                    companies.push(company.name);
                }
            }
        }
        return companies;
    }

    getWatchServices(): MovieApp.CountryWatchServices[] {
        let watchServices: MovieApp.CountryWatchServices[] = [];
        if (this.item["watch/providers"] && this.item["watch/providers"].results) {
            let providers = Object.entries(this.item["watch/providers"].results);
            for (const provider of providers) {
                let services: MovieApp.WatchServices = { flatrate: [], buy: [], rent: [] };
                let [code, data] = [provider[0], provider[1]];
                if (data.hasOwnProperty('buy')) {
                    services.buy = data['buy'];
                }
                if (data.hasOwnProperty('flatrate')) {
                    services.flatrate = data['flatrate'];
                }
                if (data.hasOwnProperty('rent')) {
                    services.rent = data['rent'];
                }
                watchServices.push({ country: code, services: services });
            }
        }
        return watchServices;
    }

}
