var gm = require('gm');
var sizeOf = require('image-size');
var q = require('q');
var randomstring = require('randomstring');

var imageStitcher = function() {

  var stitchImages = function() {
    var imageStitcherPromise = q.defer();
    console.log('in stitch')
    var imageFileName = randomstring.generate(5);
    console.log(imageFileName);
    var dimensionsImg1 = sizeOf('pano1.jpg');
    var dimensionsImg2 = sizeOf('pano2.jpg');
    console.log(imageFileName);
    gm().in('-page', '+0+0').in('pano1.jpg').in('-page', '+0' + dimensionsImg1.width).in('pano2.jpg').in('-page', '+0' + (dimensionsImg1.width + dimensionsImg2.width)).in('pano3.jpg').mosaic().write('public/'+imageFileName+'.jpg', function(err) {
      if (err) {
        console.log(err);
        imageStitcherPromise.resolve('f****');
      }
      imageStitcherPromise.resolve(imageFileName);
    });
    return imageStitcherPromise.promise;
  }
  return {
    stitchImages: stitchImages
  }
}();

module.exports = imageStitcher;
