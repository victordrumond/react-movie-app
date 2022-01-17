// Require dependencies & basic configuration
const path = require('path');
const express = require("express");
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

// POST requests: add movie to database
app.post('/addmovie', async (req, res) => {
  const newMovie = {
    "user": req.body.user,
    "list": req.body.list,
    "movie": req.body.movie
  };
  const findOnDatabase = await movieModel.find(newMovie);
  if (!findOnDatabase) {
    return res.sendStatus(404);
  } else if (findOnDatabase.length === 0) {
    const saveOnDatabase = await movieModel.create(newMovie);
    if (saveOnDatabase) {
      console.log("Movie saved on " + req.body.list + ".");
    } else {
      console.log("An error occurred. Please try again.");
    };
  } else {
    console.log("Movie is already on " + req.body.list + ".");
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