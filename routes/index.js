var express = require('express');
var router = express.Router();
var imageStitcher = require('../scripts/services/imageStitcher');
var streetmapImgSvc = require('../scripts/services/streetmapImgSvc');
var fs = require('fs');

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

module.exports = router;
