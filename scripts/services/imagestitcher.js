var gm = require('gm');
var sizeOf = require('image-size');
var q = require('q');

var imageStitcher = function() {

  var stitchImages = function() {
    var imageStitcherPromise = q.defer();
    var dimensionsImg1 = sizeOf('pano1.jpg');
    var dimensionsImg2 = sizeOf('pano2.jpg');
    gm().in('-page', '+0+0').in('pano1.jpg').in('-page', '+0' + dimensionsImg1.width).in('pano2.jpg').in('-page', '+0' + (dimensionsImg1.width + dimensionsImg2.width)).in('pano3.jpg').mosaic().write('public/output1.jpg', function(err) {
      if (err) {
        console.log(err);
        imageStitcherPromise.resolve('f****');
      }
      imageStitcherPromise.resolve('done');
    });
    return imageStitcherPromise.promise;
  }
  return {
    stitchImages: stitchImages
  }
}();

module.exports = imageStitcher;
