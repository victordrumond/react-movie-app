class Helper {

    // Separate strings by comma, except for last one
    static separateByComma = (data) => {
        let formattedData = [];
        for (let i = 0; i < data.length - 1; i++) {
            formattedData.push(data[i] + ', ')
        }
        formattedData.push(data[data.length - 1]);
        return formattedData;
    }

    // Format movie release date
    static formatDate = (date) => {
        return date.substring(0, 4);
    }

    static getScoreBarColor = (score) => {
        if (score === 0 || score === 'Not Rated') return 'colorNR';
        if (score < 4) return 'colorF';
        if (score < 6) return 'colorE';
        if (score < 7) return 'colorD';
        if (score < 8) return 'colorC';
        if (score < 9) return 'colorB';
        if (score <= 10) return 'colorA';
    }

    // Format movie score
    static formatScore = (score) => {
        return score.toString().length === 1 ? score.toString() + ".0" : score.toString();
    }

    // Normalize list name
    static getNormalizedListName = (listName) => {
        return listName.replace(' ', '').replace(listName[0], listName[0].toLowerCase());
    }

    static getListName = (normalizedListName) => {
        if (normalizedListName === 'favorites') return 'Favorites';
        if (normalizedListName === 'watchList') return 'Watch List';
        if (normalizedListName === 'watched') return 'Watched';
    }

    // Get comparable date
    static getComparableDate = (timestamp) => {
        let dateObj = new Date(timestamp);
        let IsoDateString = dateObj.toISOString();
        return IsoDateString.substring(10, 0).replaceAll('-', '');
    }

    static getMovieRating = (id, userRatings) => {
        let isMovieRated = userRatings.findIndex(item => item.movieId === id);
        if (isMovieRated < 0) {
            return 0;
        }
        return userRatings[isMovieRated].score;
    }

    static validateUsername = (username) => {
        let regex = /^\w+$/;
        return regex.test(username);
    }

}

export default Helper;
