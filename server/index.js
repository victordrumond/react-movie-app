// Require dependencies & basic configuration
const path = require('path');
const express = require("express");
const axios = require("axios");
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");
require("dotenv").config();

// MongoDB & Mongoose: connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set Mongoose schema & model
const movieSchema = new mongoose.Schema({
  user: {
    email: String,
    email_verified: Boolean,
    name: String,
    nickname: String,
    picture: String,
    sub: String,
    updated_at: String
  },
  data: {
    favorites: [{ timestamp: Number, data: Object }],
    watchList: [{ timestamp: Number, data: Object }],
    watched: [{ timestamp: Number, data: Object }],
    ratings: [{ movieId: Number, score: Number }]
  },
  config: {
    lists: {
      favorites: { filtering: String },
      watchList: { filtering: String },
      watched: { filtering: String }
    }
  }
});
const movieModel = mongoose.model("Movie", movieSchema);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));

// GET request: Hello from server!
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// GET request: fetch trending movies to display on home page
app.get("/authcovers", async (req, res) => {
  let covers = [];
  for (let i = 1; i <= 3; i++) {
    await axios
      .get("https://api.themoviedb.org/3/movie/popular?api_key=" + process.env.TMDB_API_KEY + "&page=" + i)
      .then(res => {
        res.data.results.forEach(item => covers.push(item.poster_path));
      })
    ;
  }
  return res.json(covers);
})

// GET request: fetch more complete data from specific movie
app.get("/movie/:movieid", async (req, res) => {
  await axios.get('https://api.themoviedb.org/3/movie/' + req.params.movieid + '?api_key=' + process.env.TMDB_API_KEY + '&append_to_response=credits,release_dates,watch/providers')
    .then(response => {
      return res.json(response.data);
    });
})

// GET request: receive data from search
app.get("/search/:query", async (req, res) => {
  await axios
    .get('https://api.themoviedb.org/3/search/movie?api_key=' + process.env.TMDB_API_KEY + '&query=' + encodeURIComponent(req.params.query))
    .then(response => {
      return res.json(response.data);
    });
});

// POST request: add movie to database
app.post('/addmovie', async (req, res) => {
  let userData = await movieModel.findOne({ "user.email": req.body.user });
  if (!userData) {
    return res.sendStatus(404);
  } else {
    let isMovieOnList = userData.data[req.body.list].findIndex(mov => mov.data.id === req.body.movie.id);
    if (isMovieOnList < 0) {
      let newMovie = {
        timestamp: Date.now(),
        data: req.body.movie
      }
      userData.data[req.body.list].push(newMovie);
      userData = await userData.save();
      console.log(`${req.body.movie.title} added to ${req.body.list}`);
    } else {
      console.log(`${req.body.movie.title} already on ${req.body.list}`);
    }
  }
  return res.json(userData);
})

// POST request: delete movie from database
app.post('/deletemovie', async (req, res) => {
  let userData = await movieModel.findOne({ "user.email": req.body.user });
  if (!userData) {
    return res.sendStatus(404);
  } else {
    let isMovieOnList = userData.data[req.body.list].findIndex(mov => mov.data.id === req.body.movie.id);
    if (isMovieOnList < 0) {
      console.log(`${req.body.movie.title} is not on ${req.body.list}`);
    } else {
      userData.data[req.body.list].splice(isMovieOnList, 1);
      userData = await userData.save();
      console.log(`${req.body.movie.title} deleted from ${req.body.list}`);
    }
  }
  return res.json(userData);
})

// GET request: fetch user data from database
app.get('/users/:user', async (req, res) => {
  const findUserOnDatabase = await movieModel.findOne({ "user.email": req.params.user });
  return res.json(findUserOnDatabase);
})

// POST request: init user data on database
app.post('/newuser', async (req, res) => {
  let newUser = {
    user: req.body.user,
    data: { favorites: [], watchList: [], watched: [], ratings: [] },
    config: {
      lists: {
        favorites: { filtering: "last_added" },
        watchList: { filtering: "last_added" },
        watched: { filtering: "last_added" }
      }
    }
  }
  const saveNewUser = await movieModel.create(newUser);
  return res.json(saveNewUser);
})

// POST request: update list filtering
app.post('/updatefilter', async (req, res) => {
  let userData = await movieModel.findOne({ "user.email": req.body.user });
  if (!userData) {
    return res.sendStatus(404);
  } else {
    let currentFilter = userData.config.lists[req.body.list].filtering;
    if (currentFilter !== req.body.value) {
      userData.config.lists[req.body.list].filtering = req.body.value;
      userData = await userData.save();
      console.log(`Filter updated to ${req.body.value} on ${req.body.list}`);
      return res.json(userData);
    } else {
      console.log(`Current filter on ${req.body.list} is already ${req.body.value}`);
    }
  }
})

// POST request: update movie rating
app.post('/updaterating', async (req, res) => {
  let userData = await movieModel.findOne({ "user.email": req.body.user });
  if (!userData) {
    return res.sendStatus(404);
  } else {
    let isMovieRated = userData.data.ratings.findIndex(item => item.movieId === req.body.movie.data.id);
    if (isMovieRated < 0) {
      const newRating = { movieId: req.body.movie.data.id, score: req.body.score };
      userData.data.ratings.push(newRating);
      userData = await userData.save();
      console.log(`${req.body.movie.data.title} rating set to ${req.body.score}`);
      return res.json(userData);
    } else if (userData.data.ratings[isMovieRated].score !== req.body.score) {
      userData.data.ratings[isMovieRated].score = req.body.score;
      userData = await userData.save();
      console.log(`${req.body.movie.data.title} rating updated to ${req.body.score}`);
      return res.json(userData);
    } else {
      console.log(`Current rating of ${req.body.movie.data.title} is already ${req.body.score}`);
    }
  }
})

// Every other GET request not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Listen connection on port
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
