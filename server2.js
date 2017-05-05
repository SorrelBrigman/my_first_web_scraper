const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();

app.get('/scrape2', function(req, res){

  // The URL we will scrape from - yelp's the catbird seat page for reviews.

    url = 'https://www.yelp.com/biz/the-catbird-seat-nashville';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var yelp_id,
                user_name,
                user_location,
                rating,
                review_date,
                comments,
                votes_useful,
                votes_funny,
                votes_cool;


            var jsonReviews = []
              // [
              // {
              // yelp_id: "",
              // user_name: "",
              // user_location: "",
              // rating: "",
              // review_date: "",
              // comments: "",
              // votes_useful: "",
              // votes_funny: "",
              // votes_cool: ""
              // }
              // ]
           ;

           $('.reviews').filter(function () {
              var data = $(this);
              data.children().each(function(i) {
                let reviewData = $(this);
                let review = {}
                if (i >= 1) {
                  let yelp_id_href = reviewData.find('.user-display-name').attr('href');
                  let yelp_id_array = yelp_id_href.split('userid=')
                  review.user_name = reviewData.find('.user-display-name').text();
                  review.yelp_id = yelp_id_array[1];
                  let location = reviewData.find('.user-location').text();
                  console.log("location", location);
                  let locationArray = location.split('\n');
                  console.log("locationArray", locationArray);
                  review.user_location = locationArray[1].trim();
                  rawRating = reviewData.find('.i-stars').attr('title');
                  ratingArray = rawRating.split(' star rating');
                  review.rating = parseFloat(ratingArray[0]);
                  let reviewDate = reviewData.find('.rating-qualifier').text();
                  let dateArray = reviewDate.split('\n');
                  review.review_date = dateArray[1].trim();
                  review.comments =  reviewData.find('p').text()
                  let useful = reviewData.find('.useful').children().next().next().text();
                  review.votes_useful  = (useful === "") ? 0 : parseInt(useful);
                  let funny = reviewData.find('.funny').children().next().next().text();
                  review.votes_funny =  (funny === "") ? 0 : parseInt(funny);
                  let cool = reviewData.find('.cool').children().next().next().text();
                  review.votes_cool = (cool === "") ? 0 : parseInt(cool);
                  // console.log("Review # ", i)
                  // console.log("rating", rating);
                  // console.log("review_date", review_date);
                  // console.log("useful:", votes_useful)
                  // console.log("funny:", votes_funny);
                // console.log("cool:", votes_cool);
              }
                jsonReviews.push(review);

              })


           })



        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
      // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
      // Parameter 3 :  callback function - a callback function to let us know the status of our function

      fs.writeFile('outputReviews.json', JSON.stringify(jsonReviews, null, 4), function(err){

          console.log('File successfully written! - Check your project directory for the output.json file');

      })

      // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
      res.send('Check your console!')
    }
  });
});


app.listen('8080')

console.log('Magic happens on port 8080');

exports = module.exports = app;
