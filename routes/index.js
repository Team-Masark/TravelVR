var express = require('express');
var router = express.Router();
var imageStitcher = require('../scripts/services/imageStitcher');
var streetmapImgSvc = require('../scripts/services/streetmapImgSvc');
var fs = require('fs');

/* GET home page. */
router.post('/stitchtest', function(req, res, next) {
  fs.unlink('public/output1.jpg', function(unlinkRes, err) {
    streetmapImgSvc.getCompleteImage(req.body.lat, req.body.long).then(function(data) {
      console.log('reading');
      var img = fs.readFileSync('public/output1.jpg');
      console.log(img);
      res.status(200).send('/output1.jpg');
    });
  })
});

module.exports = router;
