class ListConfig {

    // Apply sorting to data
    static sortData = (data, config) => {
        if (config.sorting === 'title') {
            return data.sort((a, b) => a.item.title.localeCompare(b.item.title));
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
    
}

export default ListConfig;
