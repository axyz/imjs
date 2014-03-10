var fs = require('fs');
var magick = require('../magick');

exports.resize = function(src, dest, w, h, q) {
  console.log('resizing ' + src);

  magick(src)
    .profile(__dirname + '/../assets/sRGB.icc')
    .filter('lanczos')
    .resize(w,h)
    .quality(q)
    .define('filter:lobes=8')
    .samplingFactor(2,2)
    .interlace('Line')
    .write(dest, function(err) {
      if(!err) {
        console.log('Done!');
      }else {
        console.log(err);
      }
    })
}

