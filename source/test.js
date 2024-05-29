const download = require('image-downloader');
var requestify = require('requestify');
var jmespath = require('jmespath');
const key = 'zTLBeTAaoWIEJFopPpkB';
const secret = 'YkvAgbLhSpbZkgGuYeaeipKrMOPsFcWc';
const tmpPath = '../../source/tmp/cover.jpg'
var album_title = '結束バンド';
var info;
var title;
var genre;
var country;
var year;
var style;
var cover_url;
var label;
requestify.get('https://api.discogs.com/database/search?q='+ album_title +'&per_page=3&page=1&key=' + key + '&secret=' + secret)
  .then(function(response) {
    // Get the response body (JSON parsed or jQuery object for XMLs)
    response.getBody();
    //console.log(response);
    info = response.body;
    //console.log(info);
  }
);

setTimeout(function(){
    console.log('Loading response...');
    data = JSON.parse(info);
    cover_url = jmespath.search(data, "results[0].cover_image");
    year = jmespath.search(data, "results[0].year");
    title = jmespath.search(data, "results[0].title");
    country = jmespath.search(data, "results[0].country");
    genre = jmespath.search(data, "results[0].genre");
    style = jmespath.search(data, "results[0].style");
    label = jmespath.search(data, "results[0].label");
    console.log(cover_url);
    console.log(year);
    console.log(title);
    console.log(country);
    console.log(genre);
    console.log(style);
    console.log(label[0]);
    download.image({
        url: cover_url,
        dest: tmpPath
    });
    //console.log(info);
}, 2000);

