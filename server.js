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
app.post('/favorites', addFavoriteImage);
app.delete('/favorites/:id', deleteFavoriteImage);
// app.get('/', renderLaunch);

app.post('/image-results', searchImages);

function getAPODDate() {
  var x = new Date()

  var month = x.getMonth() + 1;
  var day = x.getDate();
  var year = x.getFullYear();
  if (month < 10) { month = '0' + month; }
  if (day < 10) { day = '0' + day; }

  var formattedDate = `${year}-${month}-${day - 1}`;

  return formattedDate;
}

function renderHomePage(req, res) {

  let APODDate = getAPODDate();

  let url = `https://api.nasa.gov/planetary/apod?api_key=tpyerW9B64hL6VL3kBNEvRgba4gVOAtlugwQmPhk&date=${APODDate}`;

  superagent.get(url)
    .then(data => {
      return new FaX(data.body);
    })
    .then(result => {
      res.render('index', { dailyUpdate: result });

    })
    .catch(err => console.error(err));
}

function searchImages(req, res) {

  let url = 'https://images-api.nasa.gov/search?q=';


  if (req.body.search[1] === 'image') { url += `${req.body.search[0]}`; }

  // let imageJson = [];

  superagent.get(url)
    .then(data => {
      // superagent.get(data.href)
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
// RETURNING *
function addFavoriteImage(req, res) {
  let { img_url, title } = req.body;
  console.log(req.body);
  let SQL = 'INSERT INTO fav_images (img_url, title) VALUES ($1, $2);';
  let values = [img_url, title];

  return client.query(SQL, values)
    .then(res.redirect('/'))
    .catch(err => console.error(err));
}

function deleteFavoriteImage(req, res) {
  let SQL = `DELETE FROM fav_images WHERE id=${req.params.id};`;

  client.query(SQL)
    .then(res.redirect('/'))
    .catch(err => console.error(err));
}

// function renderLaunch(req, res) {
//   let SQL = 'SELECT * FROM launch_schedule';
//   return client.query()
// }

function SpaceImages(spaceImg) {

  this.img_url = spaceImg.links ? spaceImg.links[0].href : 'No image found';
  this.title = spaceImg.data ? spaceImg.data[0].title : 'No title available';

}

function FaX(spaceFaX) {
  this.img_url = spaceFaX.url;
  this.title = spaceFaX.title;
  this.explanation = spaceFaX.explanation;
}



client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server up: ${PORT}`)
    });
  })
client.on('error', err => console.err(err));


// .then(resultObj => {
//   console.log('resultObj:', resultObj);
//   superagent.get(resultObj.href)
//     .then(imageData => {
//       // console.log('this should be some href stuff:', imageData);
//     })
// })

// superagent.get(spaceImg.href)
//     .then(results => {
//       this.bigImg = results;
//     })
//   console.log('this is the bigImg:', bigImg);


// app.get('/tracking/:id', trackedLaunchDetails);
// function trackedLaunchDetails(req, res) {
//   let SQL = 'SELECT * FROM launch_schedule WHERE id=$1;';
//   let values = [req.params.id];

//   return client.query(SQL, values)
//     .then(data => {
//       res.render('tracking/:id')
//     })
// }
