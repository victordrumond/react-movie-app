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

module.exports = { recordActivity, resizeActivities };
