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
        if (score === 0) return 'colorNR';
        if (score < 4) return 'colorF';
        if (score < 6) return 'colorE';
        if (score < 7) return 'colorD';
        if (score < 8) return 'colorC';
        if (score < 9) return 'colorB';
        if (score <= 10) return 'colorA';
    }

    // Format movie score
    static formatScore = (score) => {
        if (score.toString().length === 1) return score.toString() + ".0";
        else return score.toString();
    }

    // Normalize list name
    static getNormalizedListName = (listName) => {
        return listName.replace(' ', '').replace(listName[0], listName[0].toLowerCase());
    }

    // Get comparable date
    static getComparableDate = (timestamp) => {
        let dateObj = new Date(timestamp);
        let IsoDateString = dateObj.toISOString();
        return IsoDateString.substring(10, 0).replaceAll('-', '');
    }

}

export default Helper;
