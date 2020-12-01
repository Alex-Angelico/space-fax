'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const dotenv = require('dotenv');
const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');

dotenv.config();

const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

app.use(cors());
app.use(methodOverride('_warp'));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', renderHomePage);
app.get('/favorites', renderFavoriteImages);
app.get('/launch-results', renderUpcomingLaunches);
app.get('/about-us', renderAboutUsPage);
// app.get('/tracking', renderTrackedLaunches)

app.post('/launch-results', trackLaunch);
app.post('/image-results', searchImages);
app.post('/favorites', addFavoriteImage);

app.delete('/favorites/:id', deleteFavoriteImage);
app.delete('/:id', deleteTrackedLaunch);



function renderHomePage(req, res) {
  const promise1 = renderAPODData();
  const promise2 = renderTrackedLaunches();

  Promise.all([promise1, promise2])
    .then((results) => {
      res.render('index', { homePageObject: results });
    })
    .catch(err => console.error(err.status));
}

function getAPODDate() {
  let date = new Date()
  let dayUTC = date.getUTCDate();

  let month = date.getMonth() + 1;
  let day = date.getDate();
  let dayLocal = day;
  let year = date.getFullYear();
  if (month < 10) { month = '0' + month; }
  if (day < 10) { day = '0' + day; }

  let localDate = `${year}-${month}-${day}`;

  return [localDate, dayLocal, dayUTC];
}

function renderAPODData() {
  let dateAPOD = getAPODDate();
  let newest = 'https://api.nasa.gov/planetary/apod?api_key=tpyerW9B64hL6VL3kBNEvRgba4gVOAtlugwQmPhk';
  let current = `https://api.nasa.gov/planetary/apod?api_key=tpyerW9B64hL6VL3kBNEvRgba4gVOAtlugwQmPhk&date=${dateAPOD[0]}`;

  if (dateAPOD[1] === dateAPOD[2]) {
    return superagent.get(newest)
      .then(data => {
        return new FaX(data.body);
      })
  } else {
    return superagent.get(current)
      .then(data => {
        return new FaX(data.body);
      })
  }
}

function searchImages(req, res) {
  let url = 'https://images-api.nasa.gov/search?q=';
  if (req.body.search[1] === 'image') { url += `${req.body.search[0]}`; }

  superagent.get(url)
    .then(data => {
      return data.body.collection.items.map(imageObj => {
        return new SpaceImages(imageObj)
      })
    })
    .then(results => {
      res.render('image-results', { imageList: results })
      return results;
    })
    .catch(err => console.error(err));
}

function renderFavoriteImages(req, res) {
  let SQL = 'SELECT * FROM fav_images;';

  return client.query(SQL)
    .then(images => {
      res.render('favorites', { favoriteImages: images.rows });
    })
    .catch(err => console.error(err))
}

function renderTrackedLaunches() {
  let SQL = 'SELECT * FROM tracked_launches;';

  return client.query(SQL)
}

function addFavoriteImage(req, res) {
  let { img_url, title } = req.body;
  let SQL = 'INSERT INTO fav_images (img_url, title) VALUES ($1, $2);';
  let values = [img_url, title];

  return client.query(SQL, values)
    .then(res.redirect('/'))
    .catch(err => console.error(err));
}

function trackLaunch(req, res) {
  const trackedLaunch = JSON.parse(req.body.launch);
  let { date, launchProvider, missionName, statusName, missionDescription, orbit, rocketName, rocketStartWindow, rocketEndWindow } = trackedLaunch;
  let SQL = 'INSERT INTO tracked_launches (date, launchProvider, missionName, statusName, missionDescription, orbit, rocketName, rocketStartWindow, rocketEndWindow) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);';
  let values = [date, launchProvider, missionName, statusName, missionDescription, orbit, rocketName, rocketStartWindow, rocketEndWindow];

  return client.query(SQL, values)
    .then(res.redirect('/'))
    .catch(error => console.error(error));
}

function deleteFavoriteImage(req, res) {
  let SQL = `DELETE FROM fav_images WHERE id=${req.params.id};`;

  client.query(SQL)
    .then(res.redirect('/'))
    .catch(err => console.error(err));
}

function deleteTrackedLaunch(req, res) {
  let SQL = `DELETE FROM tracked_launches WHERE id=${req.params.id};`;

  client.query(SQL)
    .then(res.redirect('/'))
    .catch(err => console.error(err));
}

function renderUpcomingLaunches(req, res) {
  let url = 'https://ll.thespacedevs.com/2.1.0/launch/upcoming';

  superagent.get(url)
    .then(data => {
      return data.body.results.map(launchObj => { return new Launch(launchObj) })
    })
    .then(results => {
      res.render('launch-results', { launchList: results })
      return results;
    })
    .catch(err => console.error(err));
}

function renderAboutUsPage(req, res) {
  res.render('about-us');
}

function SpaceImages(spaceImg) {
  this.img_url = spaceImg.links ? spaceImg.links[0].href : 'No image found.';
  this.title = spaceImg.data ? spaceImg.data[0].title : 'No title available.';
}

function FaX(spaceFaX) {
  this.img_url = spaceFaX.url;
  this.title = spaceFaX.title;
  this.explanation = spaceFaX.explanation;
}

function Launch(rocket) {
  // these will be for search
  this.date = rocket.net ? rocket.net : 'No launch date yet.';
  this.launchProvider = rocket.launch_service_provider ? rocket.launch_service_provider.name : 'Unknown launch provider.';
  this.missionName = rocket.mission ? rocket.mission.name : 'Mission name unavailable.';
  this.statusName = rocket.status ? rocket.status.name.toUpperCase() : 'Launch status unknown.';
  // these will be for detailed view
  this.missionDescription = rocket.mission ? rocket.mission.description : 'Mission description unavailable.';
  this.orbit = rocket.mission ? rocket.mission.orbit.name : 'Orbital profile unknown.';
  this.rocketName = rocket.rocket.configuration ? rocket.rocket.configuration.name : 'Launch vehicle unknown.';
  this.rocketStartWindow = rocket.window_start ? rocket.window_start : 'Launch window opening unknown.';
  this.rocketEndWindow = rocket.window_end ? rocket.window_start : 'Launch window closing unknown.';
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server up: ${PORT}`)
    });
  })
client.on('error', err => console.err(err));


// app.get('/tracking/:id', trackedLaunchDetails);
// function trackedLaunchDetails(req, res) {
//   let SQL = 'SELECT * FROM launch_schedule WHERE id=$1;';
//   let values = [req.params.id];

//   return client.query(SQL, values)
//     .then(data => {
//       res.render('tracking/:id')
//     })
// }
