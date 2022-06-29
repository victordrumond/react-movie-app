import { Movie } from './Movie';
import { TvShow } from './TvShow';

export module ListConfig {

    export function sortData(data: (Movie | TvShow)[], config: MovieApp.ListConfig): (Movie | TvShow)[] {
        if (data.length === 0) return data;
        if (config.sorting === 'title') {
            return data.sort((a, b) => {
                let aTitle: string | undefined = (a instanceof Movie) ? a.item.title : a.item.name;
                if (!aTitle) aTitle = '';
                let bTitle: string | undefined = (b instanceof Movie) ? b.item.title : b.item.name;
                if (!bTitle) bTitle = '';
                return aTitle.localeCompare(bTitle);
            })
        }
        if (config.sorting === 'highest_score') {
            return data.sort((a, b) => {
                let aVote = a.item.vote_average || 0;
                let bVote = b.item.vote_average || 0;
                return bVote - aVote;
            })
        }
        if (config.sorting === 'lowest_score') {
            return data.sort((a, b) => {
                let aVote = a.item.vote_average || 0;
                let bVote = b.item.vote_average || 0;
                return aVote - bVote;
            })
        }
        if (config.sorting === 'last_added') {
            return data.sort((a, b) => b.timestamp - a.timestamp);
        }
        if (config.sorting === 'first_added') {
            return data.sort((a, b) => a.timestamp - b.timestamp);
        }
        return data;
    }

    export function filterData(data: (Movie | TvShow)[], config: MovieApp.ListConfig): (Movie | TvShow)[] {
        if (data.length === 0) return data;
        if (config.filtering.movies && config.filtering.tvShows) {
            return data;
        }
        if (config.filtering.movies && !config.filtering.tvShows) {
            return data.filter(item => item instanceof Movie);
        }
        if (!config.filtering.movies && config.filtering.tvShows) {
            return data.filter(item => item instanceof TvShow);
        }
        if (!config.filtering.movies && !config.filtering.tvShows) {
            return [];
        }
        return data;
    }

    export function chunkData(data: (Movie | TvShow)[], size: number): (Movie | TvShow)[][] {
        if (data.length === 0) return [[]];
        const quotient = Math.floor(data.length / size);
        const remainder = data.length % size;
        let numberOfChunks = (remainder === 0) ? quotient : quotient + 1;
        let result: (Movie | TvShow)[][] = [];
        for (let i = 0; i < numberOfChunks; i++) {
            let chunk = data.slice(size * i, size * (i + 1));
            result.push(chunk);
        }
        return result;
    }

    export function searchForItem(data: (Movie | TvShow)[], search: string): (Movie | TvShow)[] {
        if (!search) return data;
        let result = data.filter(item => {
            const [title, originalTitle, releaseYear, overview] = [item.getTitle(), item.getOriginalTitle(), item.getReleaseYear(), item.getOverview()];
            let keywords = '';
            if (title) keywords += `${title} `;
            if (originalTitle) keywords += `${originalTitle} `;
            if (releaseYear) keywords += `${releaseYear} `;
            if (overview !== 'Overview not found') keywords += `${overview} `;
            let searchForKeywords = keywords.toLowerCase().indexOf(search.toLowerCase());
            return (searchForKeywords > -1);
        });
        return result;
    }

}
