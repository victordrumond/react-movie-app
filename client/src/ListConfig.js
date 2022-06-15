import Movie from "./Movie";
import TvShow from "./TvShow";

class ListConfig {

    // Apply sorting to data
    static sortData = (data, config) => {
        if (data.length === 0) return data;
        if (config.sorting === 'title') {
            return data.sort((a, b) => {
                let aTitle = a.item.title || a.item.name;
                let bTitle = b.item.title || b.item.name;
                return aTitle.localeCompare(bTitle)
            });
        }
        if (config.sorting === 'highest_score') {
            return data.sort((a, b) => b.item.vote_average - a.item.vote_average);
        }
        if (config.sorting === 'lowest_score') {
            return data.sort((a, b) => a.item.vote_average - b.item.vote_average);
        }
        if (config.sorting === 'last_added') {
            return data.sort((a, b) => b.timestamp - a.timestamp);
        }
        if (config.sorting === 'first_added') {
            return data.sort((a, b) => a.timestamp - b.timestamp);
        }
    }

    // Apply filtering to data
    static filterData = (data, config) => {
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
    }

    // Chunk to data
    static chunkData = (data, size) => {
        if (data.length === 0) return data;
        let quotient = Math.floor(data.length / size);
        let remainder = data.length % size;
        let numberOfChunks = (remainder === 0) ? quotient : quotient + 1;
        let result = [];
        for (let i = 0; i < numberOfChunks; i++) {
            let chunk = data.slice(size * i, size * (i + 1));
            result.push(chunk);
        }
        return result;
    }

}

export default ListConfig;
