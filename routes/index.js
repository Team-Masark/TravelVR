var express = require('express');
var router = express.Router();
var imageStitcher = require('../scripts/services/imagestitcher2');
var streetmapImgSvc = require('../scripts/services/streetmapImgSvc');
var fs = require('fs');
var request = require('request');

var imgInContext = '';
/* GET home page. */
router.post('/stitchtest', function(req, res, next) {
  fs.unlink('public/' + imgInContext + '.jpg', function(unlinkRes, err) {
    streetmapImgSvc.getCompleteImage(req.body.lat, req.body.long).then(function(data) {
      console.log('reading');
      imgInContext = data;
      var img = fs.readFileSync('public/' + imgInContext + '.jpg');
      res.status(200).send('/' + data + '.jpg');
    });
  })
});

router.get('/places', function(req, res, next){
  console.log(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBKMNsXHIvpHQsH3ED2xYa-GQPL2gSNSFA&keyword=${req.query.keyword}&radius=500&location=${req.query.location}`)
  request(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBKMNsXHIvpHQsH3ED2xYa-GQPL2gSNSFA&keyword=${req.query.keyword}&radius=500&location=${req.query.location}`, (err, response, body)=>{
    if(err){
      console.log(err)
    }
    res.json(JSON.parse(body))
  });
});

module.exports = router;
