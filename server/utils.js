const recordActivity = async (userData, label, data) => {
    const newActivity = { label: label, data: data, timestamp: Date.now() };
    await userData.activities.unshift(newActivity);
    userData.activities = await resizeActivities(userData.activities);
    return userData;
}

const resizeActivities = (activities) => {
    if (activities.length > 50) {
        let elementsToRemove = activities.length - 50;
        activities.splice(50, elementsToRemove);
    }
    return activities;
}

const prepareToAdd = (object, detailedObj) => {
    let finalObj = object;
    const propsToRemove = ['genre_ids', 'origin_country', 'popularity', 'video', 'vote_count'];
    const propsToAdd = ['adult', 'runtime', 'status'];
    for (const prop of propsToRemove) {
        if (finalObj.hasOwnProperty(prop)) {
            delete finalObj[prop];
        }
    }
    for (const prop of propsToAdd) {
        if (detailedObj.hasOwnProperty(prop) && !finalObj.hasOwnProperty(prop)) {
            finalObj[prop] = detailedObj[prop];
        }
    }
    finalObj = editProps(finalObj, detailedObj);
    return finalObj;
}

const prepareToUpdate = (detailedObj, type) => {
    let finalObj = detailedObj;
    const propsToRemove = ['belongs_to_collection', 'budget', 'homepage', 'imdb_id', 'popularity', 'production_countries', 'revenue', 'spoken_languages', 'tagline', 'video', 'vote_count', 'episode_run_time', 'in_production', 'languages', 'last_air_date', 'last_episode_to_air', 'next_episode_to_air', 'number_of_episodes', 'origin_country', 'seasons', 'type'];
    for (const prop of propsToRemove) {
        if (finalObj.hasOwnProperty(prop)) {
            delete finalObj[prop];
        }
    }
    finalObj = editProps(finalObj, detailedObj);
    finalObj.media_type = type;
    return finalObj;
}

const editProps = (object, detailedObj) => {
    let result = object;
    const genres = detailedObj.genres;
    if (genres) {
        result.genres = getNameFromPropArray(genres);
    }
    const companies = detailedObj.production_companies;
    if (companies) {
        result.production_companies = getNameFromPropArray(companies);
    }
    const networks = detailedObj.networks;
    if (networks) {
        result.networks = getNameFromPropArray(networks);
    }
    const creators = detailedObj.created_by;
    if (creators) {
        result.created_by = getNameFromPropArray(creators);
    }
    const credits = detailedObj.credits || detailedObj.aggregate_credits;
    if (credits) {
        let cast = [];
        if (credits.cast && credits.cast.length > 0) {
            for (const person of credits.cast) {
                if (person.name && person.known_for_department === 'Acting') {
                    cast.push(person.name);
                }
            }
        }
        let crew = [];
        if (credits.crew && credits.crew.length > 0) {
            for (const person of credits.crew) {
                if (person.name && person.job === 'Director') {
                    crew.push(person.name);
                }
            }
        }
        const finalCast = cast.length > 10 ? cast.slice(0, 10) : cast;
        const finalCrew = crew.length > 5 ? crew.slice(0, 5) : crew;
        result.credits = { cast: finalCast, crew: finalCrew };
    }
    const seasons = detailedObj.seasons;
    if (seasons) {
        let realSeasons = [];
        for (const season of seasons) {
            if (season.season_number && season.season_number > 0) {
                realSeasons.push(season);
            }
        }
        result.number_of_seasons = realSeasons.length;
    }
    return result;
}

const getNameFromPropArray = (array) => {
    let final = [];
    if (array.length > 0) {
        for (const item of array) {
            if (item.name) {
                final.push(item.name);
            }
        }
    }
    return final;
}

const getComparableDate = (timestamp) => {
    if (!timestamp) return 0;
    let dateObj = new Date(timestamp);
    let isoDateString = dateObj.toISOString();
    return +isoDateString.substring(10, 0).replaceAll('-', '');
}

module.exports = { recordActivity, resizeActivities, prepareToAdd, prepareToUpdate, getComparableDate };
