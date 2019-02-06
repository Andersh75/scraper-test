// const request = require("request");
const logger = require('morgan')
const express = require('express')
var request = require('request')
var cheerio = require('cheerio')
const axios = require('axios')
let fs = require('fs')
let path = require('path')

// Create an Express application
const app = express()

// Configure the app port
const port = process.env.PORT || 3000

app.set('port', port)

// Load middlewares
app.use(logger('dev'))

app.get('/bilder/', (req, res, next) => {
  axios.get('https://sv.wikipedia.org/wiki/Kommunvapen_i_Sverige').then(response => {
    if (response.status === 200) {
      const html = response.data
      const $ = cheerio.load(html)
      let h2text = []
      $('img').each(function(i, e) {
        h2text[i] = { src: $(this).attr('src') }
        // let img_url = $(this).attr('href')
        try {
          if (i < 290) request('https:' + $(this).attr('src')).pipe(fs.createWriteStream('image' + i + '.png'))
        } catch (error) {
          console.log(error)
        }
      })

      // let imgs = $('.image').toArray()
      // console.log('Downloading...')
      // imgs.forEach(function(img) {
      //   //console.log(img.attribs.src)
      //   process.stdout.write('.')
      //   let img_url = im..attr().src
      //   console.log(img_url)
      //   if (/^https?:\/\//.test(img_url)) {
      //     let img_name = path.basename(img_url)
      //     request(img_url).pipe(fs.createWriteStream(img_name))
      //   }
      // })
      // console.log('Done!')

      // console.log(h2text)
      res.json(h2text)
    }
  })
})

// const rp = require("request-promise");
// const $ = require("cheerio");
// const url = "https://en.wikipedia.org/wiki/George_Washington";

// rp(url)
//   .then(function(html) {
//     console.log($(".firstHeading", html).text());
//     console.log($(".bday", html).text());
//   })
//   .catch(function(err) {
//     //handle error
//   });

// const { sendResponse } = require("./app/helpers");
// const { fetchHtmlFromUrl } = require("./app/helpers");

// app.get("/scotch/", (req, res, next) => {
//   const author = req.params.author;
//   sendResponse(res)(
//     fetchHtmlFromUrl("https://en.wikipedia.org/wiki/George_Washington")
//   );
// });

// fetchHtmlFromUrl("https://en.wikipedia.org/wiki/George_Washington").then(html =>
//   console.log(html)
// );

// request("https://en.wikipedia.org/wiki/George_Washington", function(
//   err,
//   resp,
//   html
// ) {
//   if (!err) {
//     const $ = cheerio.load(html);
//     console.log(html);
//   }
// });

// Start the server and listen on the preconfigured port
app.listen(port, () => console.log(`App started on port ${port}.`))
