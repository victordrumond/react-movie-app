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
  user: String,
  list: String,
  movie: Object
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

// GET request: receive trending movies to display on home page
app.get("/authcovers", async (req, res) => {
  let covers = [];
  for (let i = 1; i <= 3; i++) {
    await axios
      .get("https://api.themoviedb.org/3/movie/popular?api_key=" + process.env.TMDB_API_KEY + "&page=" + i)
      .then(res => {
        res.data.results.forEach(item => covers.push(item));
      });
  };
  res.json(covers);
});

// GET request: receive data from specific movie
app.get("/movie/:movieid", async (req, res) => {
  await axios.get('https://api.themoviedb.org/3/movie/' + req.params.movieid + '?api_key=' + process.env.TMDB_API_KEY + '&append_to_response=credits,release_dates')
    .then(response => {
      res.json(response.data);
    });
});

// GET request: receive data from search
app.get("/search/:query", async (req, res) => {
  await axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + process.env.TMDB_API_KEY + '&query=' + req.params.query)
    .then(response => {
      res.json(response.data);
    });
});

// POST requests: add movie to database
app.post('/addmovie', async (req, res) => {
  const movie = {
    "user": req.body.user,
    "list": req.body.list,
    "movie": req.body.movie
  };
  const findOnDatabase = await movieModel.find(movie);
  if (!findOnDatabase) {
    return res.sendStatus(404);
  } else if (findOnDatabase.length === 0) {
    const saveOnDatabase = await movieModel.create(movie);
    if (saveOnDatabase) {
      console.log("Movie saved on " + req.body.list + ".");
    } else {
      console.log("An error occurred. Please try again.");
    };
  } else {
    console.log("Movie is already on " + req.body.list + ".");
  };
});

// POST requests: delete movie from database
app.post('/deletemovie', async (req, res) => {
  const movie = {
    "user": req.body.user,
    "list": req.body.list,
    "movie": req.body.movie
  };
  const findOnDatabase = await movieModel.find(movie);
  if (findOnDatabase) {
    const deleteFromDatabase = await movieModel.deleteOne(movie);
    if (deleteFromDatabase) {
      console.log("Movie deleted from database.");
    } else {
      console.log("An error occurred. Please try again.");
    };
  } else {
    console.log("Movie is not on database.");
  };
});

// GET requests: receive movies from database
app.get('/users/:user/:list', async (req, res) => {
  const findOnDatabase = await movieModel.find({
    user: req.params.user,
    list: req.params.list
  });
  if (!findOnDatabase) {
    return res.sendStatus(404);
  } else {
    return res.json(findOnDatabase);
  };
});

// Every other GET request not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Listen connection on port
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});