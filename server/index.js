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

// Every other GET request not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Listen connection on port
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});