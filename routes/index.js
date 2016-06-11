var express = require('express');
var router = express.Router();
var imageStitcher = require('../scripts/services/imageStitcher');
var streetmapImgSvc = require('../scripts/services/streetmapImgSvc');

/* GET home page. */
router.get('/stitchtest', function(req, res, next) {
  streetmapImgSvc.getCompleteImage(40.720032,-73.988354);
  imageStitcher.stitchImages();
  // res.render('index', {
  //   title: 'Express'
  // });
});

module.exports = router;
