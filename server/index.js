// Require dependencies & basic configuration
const path = require('path');
const express = require("express");
const axios = require("axios");
const PORT = process.env.PORT || 3001;
const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
let request = require("request");
const cors = require("cors");
require("dotenv").config();
const Utils = require("./utils");
const Schema = require("./schema");


// Mongoose model
const model = Schema.movieModel;


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));

const checkJwt = auth({
  audience: `https://${process.env.AUTH0_API_AUDIENCE}`,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});


// Get Auth0 Management API JWT
const getManagementApiJwt = () => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: `{"client_id":"${process.env.AUTH0_API_CLIENT_ID}", "client_secret":"${process.env.AUTH0_API_CLIENT_SECRET}", "audience":"https://${process.env.AUTH0_DOMAIN}/api/v2/", "grant_type":"client_credentials"}`
    }
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    })
  })
}


// Edit user profile - Auth0
app.patch("/api/users/edituser", checkJwt, (req, res) => {
  getManagementApiJwt().then(data => {
    const token = data.access_token;
    const options = {
      method: 'PATCH',
      url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/users/' + req.body.userId,
      headers: { 'authorization': 'Bearer ' + token, 'content-type': 'application/json' },
      body: { "name": req.body.name, "nickname": req.body.nickname, user_metadata: { picture: req.body.picture } },
      json: true
    }
    request(options, (error, response, body) => {
      if (error) throw new Error(error);
      res.json(body);
    })
  })
});


// Hello from server!
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


// Get trending movies
app.get("/api/authcovers", async (req, res) => {
  let covers = [];
  for (let i = 1; i <= 3; i++) {
    await axios
      .get("https://api.themoviedb.org/3/trending/all/day?api_key=" + process.env.TMDB_API_KEY + "&page=" + i)
      .then(response => {
        let filteredResults = response.data.results.filter(item => item.media_type !== 'person');
        filteredResults.forEach(item => covers.push(item.poster_path));
      })
    ;
  }
  return res.json(covers);
})


// Get countries
app.get("/api/config/countries", async (req, res) => {
  await axios
    .get("https://api.themoviedb.org/3/configuration/countries?api_key=" + process.env.TMDB_API_KEY)
    .then(response => {
      return res.json(response.data);
    })
  ;
})


// Get movie data by id
app.get("/api/movie/:id", checkJwt, async (req, res) => {
  await axios.get('https://api.themoviedb.org/3/movie/' + req.params.id + '?api_key=' + process.env.TMDB_API_KEY + '&append_to_response=credits,release_dates,watch/providers')
    .then(response => {
      return res.json(response.data);
    });
})


// Get tv show data by id
app.get("/api/tv/:id", checkJwt, async (req, res) => {
  await axios.get('https://api.themoviedb.org/3/tv/' + req.params.id + '?api_key=' + process.env.TMDB_API_KEY + '&append_to_response=aggregate_credits,content_ratings,watch/providers')
    .then(response => {
      response.data.credits = response.data.aggregate_credits;
      delete response.data.aggregate_credits;
      return res.json(response.data);
    });
})


// Get search results
app.get("/api/search/:query", async (req, res) => {
  await axios
    .get('https://api.themoviedb.org/3/search/multi?api_key=' + process.env.TMDB_API_KEY + '&query=' + encodeURIComponent(req.params.query))
    .then(response => {
      let filteredResults = response.data.results.filter(item => item.media_type !== 'person');
      response.data.results = filteredResults;
      return res.json(response.data);
    });
});


// Update movie/tv show data
app.patch("/api/updateitem", checkJwt, async (req, res) => {
  const [email, sub, id, type] = [req.body.user.email, req.body.user.sub, req.body.itemId, req.body.itemType];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) return res.sendStatus(404);
  if (userData.user.email !== email || userData.user.sub !== sub) return res.sendStatus(401);
  const isItemSaved = userData.movies.findIndex(item => item.data.id === parseInt(id) && item.data.media_type === type);
  if (isItemSaved < 0) {
    console.log(`Item is not saved`);
    return;
  }
  const lastUpdated = Utils.getComparableDate(userData.movies[isItemSaved].updated);
  const newUpdate = Utils.getComparableDate(Date.now());
  if (newUpdate === lastUpdated) {
    console.log(`Item is already updated`);
    return res.json(userData);
  }
  const credits = (type === 'tv') ? 'aggregate_credits' : 'credits';
  let itemName = '';
  await axios
    .get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=${credits}`)
    .then(async (response) => {
      itemName = (response.data.title || response.data.name);
      if (type === 'tv') {
        response.data.credits = response.data.aggregate_credits;
        delete response.data.aggregate_credits;
      }
      const movie = Utils.prepareToUpdate(response.data, type);
      userData.movies[isItemSaved].data = movie;
      userData.movies[isItemSaved].updated = Date.now();
    })
  ;
  userData = await userData.save();
  console.log(`${itemName} data updated`);
  return res.json(userData);
});


// Add movie to list
app.post('/api/add', checkJwt, async (req, res) => {
  const [email, sub, object, list] = [req.body.user.email, req.body.user.sub, req.body.item, req.body.list];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) {
    return res.sendStatus(404);
  }
  if (userData.user.email !== email || userData.user.sub !== sub) {
    return res.sendStatus(401);
  }
  const isMovieSaved = userData.movies.findIndex(item => item.data.id === object.id);
  if (isMovieSaved > -1) {
    const isMovieOnList = userData.movies[isMovieSaved].lists.findIndex(item => item.list === list);
    if (isMovieOnList > -1) {
      console.log(`${object.title || object.name} already on ${list}`);
      return;
    }
    await userData.movies[isMovieSaved].lists.push({ list: list, timestamp: Date.now() });
  }
  if (isMovieSaved < 0) {
    const credits = object.media_type === 'tv' ? 'aggregate_credits' : 'credits';
    await axios
      .get(`https://api.themoviedb.org/3/${object.media_type}/${object.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=${credits}`)
      .then(async (response) => {
        const movie = Utils.prepareToAdd(object, response.data);
        const newMovie = { data: movie, lists: [{ list: list, timestamp: Date.now() }], score: 0, updated: null };
        await userData.movies.push(newMovie);
      })
    ;
  }
  const activityData = { image: object.poster_path, movie: object.title || object.name, list: list };
  userData = await Utils.recordActivity(userData, 'movie_added', activityData);
  userData = await userData.save();
  console.log(`${object.title || object.name} added to ${list}`);
  return res.json(userData);
})


// Delete movie from list
app.post('/api/deletemovie', checkJwt, async (req, res) => {
  const [email, sub, movie, list] = [req.body.user.email, req.body.user.sub, req.body.movie, req.body.list];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) {
    return res.sendStatus(404);
  }
  if (userData.user.email !== email || userData.user.sub !== sub) {
    return res.sendStatus(401);
  }
  const isMovieSaved = userData.movies.findIndex(item => item.data.id === movie.id);
  if (isMovieSaved < 0) {
    console.log(`${movie.title || movie.name} is not on ${list}`);
    return;
  }
  const isMovieOnList = userData.movies[isMovieSaved].lists.findIndex(e => e.list === list);
  if (isMovieOnList < 0) {
    console.log(`${movie.title || movie.name} is not on ${list}`);
    return;
  }
  await userData.movies[isMovieSaved].lists.splice(isMovieOnList, 1);
  if (userData.movies[isMovieSaved].lists.length === 0) {
    await userData.movies.splice(isMovieSaved, 1);
  }
  const activityData = { image: movie.poster_path, movie: movie.title || movie.name, list: list };
  userData = await Utils.recordActivity(userData, 'movie_deleted', activityData);
  userData = await userData.save();
  console.log(`${movie.title || movie.name} deleted from ${list}`);
  return res.json(userData);
})


// Get user data from database
app.post('/api/users/login', checkJwt, async (req, res) => {
  const [email, sub] = [req.body.user.email, req.body.user.sub];
  const userData = await model.findOne({ "user.email": email });
  if (!userData) {
    return res.json(null);
  }
  if (userData.user.email === email && userData.user.sub === sub) {
    return res.json(userData);
  }
  return res.sendStatus(401);
})


// Init user data on database
app.post('/api/users/newuser', checkJwt, async (req, res) => {
  const [email, sub] = [req.body.user.email, req.body.user.sub];
  const userData = await model.findOne({ "user.email": email });
  if (userData) {
    return res.sendStatus(403);
  }
  const newUser = {
    user: { email: email, sub: sub },
    data: [],
    config: {
      lists: {
        favorites: { sorting: "last_added", filtering: { movies: true, tvShows: true } },
        watchList: { sorting: "last_added", filtering: { movies: true, tvShows: true } },
        watching: { sorting: "last_added", filtering: { movies: true, tvShows: true } },
        watched: { sorting: "last_added", filtering: { movies: true, tvShows: true } }
      },
      general: {
        country: "US"
      }
    },
    activities: []
  }
  const saveNewUser = await model.create(newUser);
  return res.json(saveNewUser);
})


// Update list sorting
app.post('/api/updatesorting', checkJwt, async (req, res) => {
  const [email, sub, sort, list] = [req.body.user.email, req.body.user.sub, req.body.value, req.body.list];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) {
    return res.sendStatus(404);
  }
  if (userData.user.email !== email || userData.user.sub !== sub) {
    return res.sendStatus(401);
  }
  const currentSorting = userData.config.lists[list].sorting;
  if (currentSorting !== sort) {
    userData.config.lists[list].sorting = sort;
    userData = await userData.save();
    console.log(`Sorting updated to ${sort} on ${list}`);
    return res.json(userData);
  }
  console.log(`Current sorting on ${list} is already ${sort}`);
})


// Update list filtering
app.post('/api/updatefiltering', checkJwt, async (req, res) => {
  const [email, sub, filter, value, list] = [req.body.user.email, req.body.user.sub, req.body.filter, req.body.value, req.body.list];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) {
    return res.sendStatus(404);
  }
  if (userData.user.email !== email || userData.user.sub !== sub) {
    return res.sendStatus(401);
  }
  const currentFiltering = userData.config.lists[list].filtering[filter];
  if (currentFiltering !== value) {
    userData.config.lists[list].filtering[filter] = value;
    userData = await userData.save();
    console.log(`Filter ${filter} updated to ${value} on ${list}`);
    return res.json(userData);
  }
  console.log(`Filter ${filter} on ${list} is already ${value}`);
})


// Update movie rating
app.post('/api/updaterating', checkJwt, async (req, res) => {
  const [email, sub, movie, score] = [req.body.user.email, req.body.user.sub, req.body.movie, req.body.score];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) {
    return res.sendStatus(404);
  }
  if (userData.user.email !== email || userData.user.sub !== sub) {
    return res.sendStatus(401);
  }
  const isMovieSaved = userData.movies.findIndex(item => item.data.id === movie.id);
  if (isMovieSaved < 0) {
    console.log(`${movie.title || movie.name} is not saved`);
    return;
  }
  const movieRating = userData.movies[isMovieSaved].score;
  if (movieRating === score) {
    console.log(`Current rating of ${movie.title || movie.name} is already ${score}`);
    return;
  }
  userData.movies[isMovieSaved].score = score;
  console.log(`${movie.title || movie.name} rating set to ${score}`);
  const activityData = { image: movie.poster_path, movie: movie.title || movie.name, rating: score };
  userData = await Utils.recordActivity(userData, 'movie_rated', activityData);
  userData = await userData.save();
  return res.json(userData);
})


// Update country
app.post('/api/updatecountry', checkJwt, async (req, res) => {
  const [email, sub, country] = [req.body.user.email, req.body.user.sub, req.body.country];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) {
    return res.sendStatus(404);
  }
  if (userData.user.email !== email || userData.user.sub !== sub) {
    return res.sendStatus(401);
  }
  const currentCountry = userData.config.general.country;
  if (country === currentCountry) {
    console.log(`Current country is already ${country}`);
    return res.json(userData);
  }
  userData.config.general.country = country;
  console.log(`Country updated to ${country}`);
  userData = await userData.save();
  return res.json(userData);
})


// Update manage seasons
app.post('/api/tv/manageseasons', checkJwt, async (req, res) => {
  const [email, sub, showId, list, season] = [req.body.user.email, req.body.user.sub, req.body.itemId, req.body.list, req.body.season];
  let userData = await model.findOne({ "user.email": email });
  if (!userData) return res.sendStatus(404);
  if (userData.user.email !== email || userData.user.sub !== sub) return res.sendStatus(401);
  const showIndex = userData.movies.findIndex(item => item.data.id === showId);
  const listIndex = userData.movies[showIndex].lists.findIndex(item => item.list === list);
  const listInfo = userData.movies[showIndex].lists[listIndex];
  if (listInfo.seasons) {
    const hasSeason = listInfo.seasons.findIndex(item => item === season);
    if (hasSeason > -1) {
      await userData.movies[showIndex].lists[listIndex].seasons.splice(hasSeason, 1);
      console.log(`Season ${season} of ${userData.movies[showIndex].data.name} deselect on ${list}`);
      userData = await userData.save();
      return res.json(userData);
    }
    await userData.movies[showIndex].lists[listIndex].seasons.push(season);
  } else {
    userData.movies[showIndex].lists[listIndex].seasons = [season];
  }
  console.log(`Season ${season} of ${userData.movies[showIndex].data.name} selected on ${list}`);
  userData = await userData.save();
  return res.json(userData);
})


// Every other GET request not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// Listen connection on port
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
