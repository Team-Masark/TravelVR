var gm = require('gm');
var sizeOf = require('image-size');

var imageStitcher = function() {

  var stitchImages = function() {
    var dimensionsImg1 = sizeOf('/Users/abhimanyuarya/personal/exvr/ExVR-be/scripts/services/va1.jpg');
    var dimensionsImg2 = sizeOf('/Users/abhimanyuarya/personal/exvr/ExVR-be/scripts/services/va2.jpg');
    gm().in('-page', '+0+0').in('/Users/abhimanyuarya/personal/exvr/ExVR-be/scripts/services/va1.jpg').in('-page','+0'+dimensionsImg1.width).in('/Users/abhimanyuarya/personal/exvr/ExVR-be/scripts/services/va2.jpg').mosaic().write('output.jpg', function(err) {
      if (err) console.log(err);
    });
  }
  return {
    stitchImages: stitchImages
  }
}();

module.exports = imageStitcher;
