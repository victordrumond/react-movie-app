class ListConfig {

    // Apply filtering to data
    static sortData = (data, config) => {
        if (config.filtering === 'title') {
            return data.sort((a, b) => a.data.title.localeCompare(b.data.title));
        }
        if (config.filtering === 'highest_score') {
            return data.sort((a, b) => b.data.vote_average - a.data.vote_average);
        }
        if (config.filtering === 'lowest_score') {
            return data.sort((a, b) => a.data.vote_average - b.data.vote_average);
        }
        if (config.filtering === 'last_added') {
            return data.sort((a, b) => b.timestamp - a.timestamp);
        }
        if (config.filtering === 'first_added') {
            return data.sort((a, b) => a.timestamp - b.timestamp);
        }
    }
    
}

export default ListConfig;
