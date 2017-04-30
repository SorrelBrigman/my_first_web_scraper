const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();

app.get('/scrape', function(req, res){

  // The URL we will scrape from - yelp's the catbird seat page.

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

            var name,
            category_str_list,
            yelp_id,
            price_range,
            address_string,
            address_city,
            address_state,
            address_zip,
            neighborhood_str_list,
            website,
            phone;

            var jsonRest = {
              name : "",
              category_str_list: "",
              price_range : "",
              address_string: "",
              address_city: "Nashville",
              address_state: "TN",
              address_zip: "",
              neighborhood_str_list: "",
              website: "",
              phone: ""};


              //get restaurant name
            $('.biz-page-title').filter(function() {
                var data = $(this);
                name = data.text();
                jsonRest.name = name;
            });
            //get restaurant category
            $('.category-str-list').filter(function() {
                var data = $(this);
                category_str_list = data.text();
                jsonRest.category_str_list = category_str_list;

            });
            //get rest. price range
            $('.price-range').filter(function() {
                var data = $(this);
                price_range = data.text();
                jsonRest.price_range = price_range;
            });
            //get rest. address string
            $('address').filter(function() {
              var data = $(this);
              address_string = data.text();
              address_array = address_string.split('Nashville, TN ')
              console.log("address_string", address_string)
              // city_state_zip = data.children().children().last().text();
              // console.log("city_state_zip", city_state_zip)
              jsonRest.address_string = address_array[0];
              jsonRest.address_zip = address_array[1];
              // jsonRest.city_state_zip = city_state_zip;
            });
            //get restaurant neighborhood
            $('.neighborhood-str-list').filter(function() {
                var data = $(this);
                neighborhood_str_list = data.text();
                jsonRest.neighborhood_str_list = neighborhood_str_list;
            });
            //get website
            $('.biz-website').filter(function() {
                var data = $(this);
                website = data.children().last().text();
                jsonRest.website = website;
            });
            //get phone
            $('.biz-phone').filter(function() {
                var data = $(this);
                phone = data.text();
                jsonRest.phone = phone;
            });



        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
      // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
      // Parameter 3 :  callback function - a callback function to let us know the status of our function

      fs.writeFile('output.json', JSON.stringify(jsonRest, null, 4), function(err){

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
