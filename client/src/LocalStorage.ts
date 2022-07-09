import { Helper } from './Helper';

export module LocalStorage {

    export function hasExpandedItem(id: number, type: string): boolean {
        let expandedItems = JSON.parse(localStorage.getItem('expandedMovies')!);
        updateExpandedItems(expandedItems);
        if (!expandedItems || expandedItems.data.length === 0) return false;
        for (const item of expandedItems.data) {
            if (type === 'movie' && item.hasOwnProperty('title')) {
                if (item.id === id) return true;
            }
            if (type === 'tv' && item.hasOwnProperty('name')) {
                if (item.id === id) return true;
            }
        }
        return false;
    }

    export function getExpandedItem(id: number, type: string): any | null {
        let expandedItems = JSON.parse(localStorage.getItem('expandedMovies')!);
        updateExpandedItems(expandedItems);
        if (!expandedItems || expandedItems.data.length === 0) return null;
        for (const item of expandedItems.data) {
            if (type === 'movie' && item.hasOwnProperty('title') && item.id === id) {
                return item;
            }
            if (type === 'tv' && item.hasOwnProperty('name') && item.id === id) {
                return item;
            }
        }
        return null;
    }

    export function setExpandedItem(item: TMDb.SearchObject): void {
        let expandedItems = JSON.parse(localStorage.getItem('expandedMovies')!);
        updateExpandedItems(expandedItems);
        try {
            if (!expandedItems) {
                let expandedItems = { data: [item], updated: Date.now() };
                localStorage.setItem('expandedMovies', JSON.stringify(expandedItems));
                return;
            }
            expandedItems.data.push(item);
            localStorage.setItem('expandedMovies', JSON.stringify(expandedItems));
        } catch (e) {
            clearExpandedMovies();
            setExpandedItem(item);
        }
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

    function clearExpandedMovies(): void {
        let expandedItems = JSON.parse(localStorage.getItem('expandedMovies')!);
        if (expandedItems) {
            localStorage.setItem('expandedMovies', JSON.stringify({ data: [], updated: Date.now() }));
        }
    }

    function updateExpandedItems(expandedItems: any): void {
        if (expandedItems && expandedItems.hasOwnProperty('updated')) {
            const updatedAt = Helper.getComparableDate(expandedItems.updated);
            const today = Helper.getComparableDate(Date.now());
            if (updatedAt === today) {
                return;
            }
            clearExpandedMovies();
        }
    }

}
