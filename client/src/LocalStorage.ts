import { Helper } from './Helper';

export module LocalStorage {

    export function hasExpandedMovie(movieId: number): boolean {
        let expandedMovies = JSON.parse(localStorage.getItem('expandedMovies')!);
        if (!expandedMovies) {
            return false;
        }
        for (const movie of expandedMovies) {
            if (movie.id === movieId) {
                return true;
            }
        }
        return false;
    }

    export function getExpandedMovie(movieId: number): boolean | null {
        let expandedMovies = JSON.parse(localStorage.getItem('expandedMovies')!);
        if (!expandedMovies) {
            return null;
        }
        for (const movie of expandedMovies) {
            if (movie.id === movieId) {
                return movie;
            }
        }
        return null;
    }

    export function setExpandedMovie(movie: TMDb.SearchObject): void {
        let expandedMovies = JSON.parse(localStorage.getItem('expandedMovies')!);
        if (!expandedMovies) {
            let expandedMovies = [movie];
            localStorage.setItem('expandedMovies', JSON.stringify(expandedMovies));
            return;
        }
        expandedMovies.push(movie);
        localStorage.setItem('expandedMovies', JSON.stringify(expandedMovies));
    }

    export function hasUpdatedTrendingCovers(): boolean {
        let trendingCovers = JSON.parse(localStorage.getItem('trendingCovers')!);
        if (trendingCovers && trendingCovers.covers.length > 0) {
            let today = Helper.getComparableDate(Date.now());
            let lastUpdate = Helper.getComparableDate(trendingCovers.updated);
            if (today === lastUpdate) {
                return true;
            }
        }
        return false;
    }

    export function getTrendingCovers(): string[] | null {
        let trendingCovers = JSON.parse(localStorage.getItem('trendingCovers')!);
        if (trendingCovers) {
            return trendingCovers.covers;
        }
        return null;
    }

    export function setTrendingCovers(movies: string[]): void {
        let covers = [];
        for (const movie of movies) {
            covers.push(movie);
        }
        let updatedTrendingCovers = {
            updated: Date.now(),
            covers: covers
        }
        localStorage.setItem('trendingCovers', JSON.stringify(updatedTrendingCovers));
    }

    export function hasUpdatedCountryList(): boolean {
        let countryList = JSON.parse(localStorage.getItem('countryList')!);
        if (countryList && countryList.data.length > 0) {
            let today = Helper.getComparableDate(Date.now());
            let lastUpdate = Helper.getComparableDate(countryList.updated);
            if (today - lastUpdate < 30) {
                return true;
            }
        }
        return false;
    }

    export function getCountryList(): any[] | null {
        let countryList = JSON.parse(localStorage.getItem('countryList')!);
        if (countryList) {
            return countryList.data;
        }
        return null;
    }

    export function setCountryList(countries: any[]): void {
        let updatedCountryList = {
            updated: Date.now(),
            data: countries
        }
        localStorage.setItem('countryList', JSON.stringify(updatedCountryList));
    }

}
