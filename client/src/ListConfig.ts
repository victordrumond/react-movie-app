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
            const [genres, cast, crew, companies] = [item.getGenres(), item.getCast(), item.getDirection(), item.getProductionCompanies()];
            let keywords = '';
            if (title) keywords += `${title} `;
            if (originalTitle) keywords += `${originalTitle} `;
            if (releaseYear) keywords += `${releaseYear} `;
            if (overview !== 'Overview not found') keywords += `${overview} `;
            if (genres && genres.length > 0) genres.forEach(item => keywords += `${item} `);
            if (cast && cast.length > 0) cast.forEach(item => keywords += `${item} `);
            if (crew && crew.length > 0) crew.forEach(item => keywords += `${item} `);
            if (companies && companies.length > 0) companies.forEach(item => keywords += `${item} `);
            if (item instanceof TvShow) {
                const [networks, creators] = [item.getNetworks(), item.getCreators()];
                if (networks && networks.length > 0) networks.forEach(item => keywords += `${item} `);
                if (creators && creators.length > 0) creators.forEach(item => keywords += `${item} `);
            }
            let searchForKeywords = keywords.toLowerCase().indexOf(search.toLowerCase());
            return (searchForKeywords > -1);
        })
        return result;
    }

}
