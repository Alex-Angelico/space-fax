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

// app.get('/', renderLaunch);

app.post('/image-results', searchImages);

function renderHomePage(req, res) {
  let url = 'https://api.nasa.gov/planetary/apod?api_key=tpyerW9B64hL6VL3kBNEvRgba4gVOAtlugwQmPhk';

  superagent.get(url)
    .then(data => {
      // console.log(data);
      return new FaX(data.body);
    })
    .then(result => {
      res.render('index', { dailyUpdate: result });

    })
    .catch(err => console.error(err));
}

function searchImages(req, res){

  let url = 'https://images-api.nasa.gov/search?q=';

  if(req.body.search[1] === 'image' ) {url += `${req.body.search[0]}`; }
  
  // console.log(url);
  superagent.get(url)
    .then(data => {
      return data.body.collection.items.map(imageObj => {
        // console.log('d', imageObj);
        // console.log('hopefully an imageObj:', imageObj.links[0].href);
        return new SpaceImages(imageObj)
      })
    })
    .then(results =>{
      console.log('results:', results)
      res.render('image-results', { imageList: results})
    })
    .catch(err => console.error(err));
}

// function renderLaunch(req, res) {
//   let SQL = 'SELECT * FROM launch_schedule';
//   return client.query()
// }

function SpaceImages(spaceImg){
  console.log('spaceImg.links:', spaceImg.links);

  this.thumbImage = spaceImg.links ? spaceImg.links[0].href : 'No image found' ;
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
