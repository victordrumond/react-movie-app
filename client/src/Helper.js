class Helper {

    // Format movie title on card
    static formatTitle = (title) => {
        if (window.innerWidth > 575) {
            if (title.length > 40) return title.substring(0, 40) + "...";
            else return title;
        } else {
            if (title.length > 50) return title.substring(0, 50) + "...";
            else return title;
        };
    };

    // Format movie description on card
    static formatDescription = (text, title) => {
        if (title.length > 25) {
            if (text.length > 50) return text.substring(0, 50) + "...";
            else return text;
        } else {
            if (text.length > 80) return text.substring(0, 80) + "...";
            else return text;
        };
    };

    // Format movie release date
    static formatDate = (date) => {
        return date.substring(0, 4);
    };

    // Format movie score
    static formatScore = (score) => {
        if (score.toString().length === 1) return score.toString() + ".0";
        else return score.toString();
    };

    // Normalize list name
    static getNormalizedListName = (listName) => {
        return listName.replace(' ', '').replace(listName[0], listName[0].toLowerCase());
    };

};

export default Helper;