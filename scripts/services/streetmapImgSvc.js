var _ = require('lodash');
var fs = require('fs');
var request = require('request');
var Promise = require('es6-promise').Promise;
var imageStitcher = require('../services/imageStitcher');

var streetmapImgSvc = function() {
  var config = {
    'streetMapKey': 'AIzaSyDF_xPIhuK16vhxNSkHvG-u2XbVeeef0GI'
  };

  var fetchData = function(config) {
    return new Promise(function(resolve, reject) {
      request(config,
        function(error, response) {
          if (error) {
            return reject(error);
          }
          resolve(response);
        });
    });
  };

  var getStreetImage = function(lat, lang, heading) {
    var reqConfig = {
      method: 'GET',
      uri: "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + lat + "," + lang + "&fov=120&heading=" + heading + "&pitch=10&key=" + config.streetMapKey
    };
    return fetchData(reqConfig);
  };

  var getCompleteImage = function(lat, lang) {
    Promise.all([getStreetImage(lat, lang, 0),
      getStreetImage(lat, lang, 120),
      getStreetImage(lat, lang, 240)
    ]).then(function(imgs) {
      //console.log(imgs);
      var f1 = fs.createWriteStream('img1.jpg');
      var f2 = fs.createWriteStream('img2.jpg');
      var f3 = fs.createWriteStream('img3.jpg');
      f1.write(imgs[0].body);
      f1.end();
      f1.write(imgs[1].body);
      f1.end();
      f1.write(imgs[2].body);
      f1.end();
      return _.map(imgs, 'body');
    }).then(function(d) {
      //console.log(d)
    });
  }

  return {
    getCompleteImage: getCompleteImage
  }
}();

module.exports = streetmapImgSvc;
