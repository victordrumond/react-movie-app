export class TvShow {

    item: TMDb.TvShowObject;
    timestamp: number;

    constructor(tvShowObj: TMDb.TvShowObject, timestamp: number) {
        this.item = tvShowObj;
        this.timestamp = timestamp;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    getId(): number | null {
        return this.item.id || null;
    }

    getTitle(): string {
        return this.item.name || '';
    }

    getOriginalTitle(): string {
        return this.item.original_name || '';
    }

    getReleaseDate(seasonNumber?: string): string {
        if (!seasonNumber || seasonNumber === '0') {
            return this.item.first_air_date || '';
        }
        if (this.getSeasons()[parseInt(seasonNumber) - 1]) {
            return this.getSeasons()[parseInt(seasonNumber) - 1].air_date || '';
        }
        return '';
    }

    getReleaseYear(seasonNumber?: string): string {
        return this.getReleaseDate(seasonNumber).substring(0, 4);
    }

    getYears(seasonNumber?: string): string {
        if (!seasonNumber || seasonNumber === '0') {
            let firstYear = this.getReleaseYear(seasonNumber) || 'Unknown';
            let lastYear = this.item.in_production ? 'Today' : this.item.last_air_date ? this.item.last_air_date.substring(0, 4) : 'Unknown';
            return `${firstYear} - ${lastYear}`;
        }
        return '';
    }

    getPosterPath(seasonNumber?: string): string | null {
        if ((!seasonNumber || seasonNumber === '0') && this.item.poster_path) {
            return `https://image.tmdb.org/t/p/w500${this.item.poster_path}`;
        }
        if (seasonNumber && parseInt(seasonNumber) > 0) {
            const season = this.getSeasons()[parseInt(seasonNumber) - 1];
            if (season && season.poster_path) {
                return `https://image.tmdb.org/t/p/w500${season.poster_path}`;
            }
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

    getAverageRating(): string {
        if (this.item.vote_average) {
            let rating = this.item.vote_average.toString();
            return rating.length === 1 ? rating + '.0' : rating;
        }
        return 'Not Rated';
    }

    getParentalRating(countryCode: string): string {
        if (this.item.content_ratings && this.item.content_ratings.results) {
            let worldRatings = this.item.content_ratings.results;
            let localRatings = worldRatings.filter(item => item.iso_3166_1 === countryCode);
            if (localRatings.length > 0 && localRatings[0].rating) {
                return localRatings[0].rating;
            }
        }
        return 'PG not found';
    }

    getNumberOfSeasons(): string {
        let numOfSeasons = this.item.number_of_seasons;
        if (!numOfSeasons) {
            return 'Unknown';
        }
        return numOfSeasons === 1 ? `${numOfSeasons} Season` : `${numOfSeasons} Seasons`;
    }

    getOverview(seasonNumber?: string): string {
        if (!seasonNumber || seasonNumber === '0') {
            return this.item.overview || 'Overview not found';
        }
        const season = this.getSeasons()[parseInt(seasonNumber) - 1];
        return season && season.overview ? season.overview : 'Overview not found';
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

    getCreators(): string[] {
        let creators: string[] = [];
        if (this.item.created_by) {
            for (const person of this.item.created_by) {
                if (person.name) {
                    creators.push(person.name);
                }
            }
        }
        return creators;
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

    getNetworks(): string[] {
        let networks: string[] = [];
        if (this.item.networks) {
            for (const network of this.item.networks) {
                if (network.name) {
                    networks.push(network.name);
                }
            }
        }
        return networks;
    }

    getStreamingServices(): MovieApp.StreamingServices[] {
        let streamingServices: MovieApp.StreamingServices[] = [];
        if (this.item["watch/providers"] && this.item["watch/providers"].results) {
            let providers = Object.entries(this.item["watch/providers"].results);
            for (const provider of providers) {
                let [code, data] = [provider[0], provider[1]];
                if (data.hasOwnProperty('flatrate')) {
                    streamingServices.push({
                        country: code,
                        services: data.flatrate
                    })
                }
            }
        }
        return streamingServices;
    }

    getSeasons(): MovieApp.Season[] {
        let seasons: MovieApp.Season[] = [];
        if (this.item.seasons) {
            for (const season of this.item.seasons) {
                if (season.season_number && season.season_number > 0) {
                    seasons.push(season);
                }
            }
        }
        return seasons;
    }

    getNumberOfEpisodes(seasonNumber?: string): string {
        let numOfEpisodes = this.item.number_of_episodes;
        if ((!seasonNumber || seasonNumber === '0') && numOfEpisodes) {
            return numOfEpisodes === 1 ? `${numOfEpisodes} Episode` : `${numOfEpisodes} Episodes`;
        }
        if (seasonNumber && parseInt(seasonNumber) > 0) {
            const season = this.getSeasons()[parseInt(seasonNumber) - 1];
            if (season && season.episode_count) {
                return season.episode_count === 1 ? `${season.episode_count} Episode` : `${season.episode_count} Episodes`;
            }
        }
        return 'Unknown';
    }

}
