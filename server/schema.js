const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const movieSchema = new mongoose.Schema({
    user: {
        email: String,
        sub: String
    },
    data: {
        favorites: [{ timestamp: Number, data: Object }],
        watchList: [{ timestamp: Number, data: Object }],
        watching: [{ timestamp: Number, data: Object }],
        watched: [{ timestamp: Number, data: Object }],
        ratings: [{ movieId: Number, score: Number }]
    },
    config: {
        lists: {
            favorites: { sorting: String },
            watchList: { sorting: String },
            watching: { sorting: String },
            watched: { sorting: String }
        }
    },
    activities: Array
})

const movieModel = mongoose.model("Movie", movieSchema);

module.exports = { movieModel };
