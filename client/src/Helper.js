class Helper {

    // Format movie title on card
    static formatTitle = (title) => {
        if (title.length > 40) return title.substring(0, 40) + "...";
        else return title;
    };

    // Format movie description on card
    static formatDescription = (text, title) => {
        if (title.length > 25) {
            if (text.length > 120) return text.substring(0, 120) + "...";
            else return text;
        } else {
            if (text.length > 140) return text.substring(0, 140) + "...";
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

};

export default Helper;