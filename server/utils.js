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
    const propsToAdd = ['adult', 'runtime', 'status', 'number_of_seasons'];
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
    const genres = detailedObj.genres;
    if (genres) {
        finalObj.genres = getNameFromPropArray(genres);
    }
    const companies = detailedObj.production_companies;
    if (companies) {
        finalObj.production_companies = getNameFromPropArray(companies);
    }
    const networks = detailedObj.networks;
    if (networks) {
        finalObj.networks = getNameFromPropArray(networks);
    }
    const creators = detailedObj.created_by;
    if (creators) {
        finalObj.created_by = getNameFromPropArray(creators);
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
        finalObj.credits = { cast: finalCast, crew: finalCrew };
    }
    return finalObj;
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

module.exports = { recordActivity, resizeActivities, prepareToAdd };
