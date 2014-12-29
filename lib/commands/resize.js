var fs = require('fs');
var magick = require('../magick');

exports.resize = function(src, dest, w, h, q, cb) {
  console.log('resizing ' + src);

  var destWriteStream = fs.createWriteStream(dest);

  magick(src)
    .profile(__dirname + '/../assets/sRGB.icc')
    .filter('lanczos')
    .resize(Number(w),Number(h))
    .quality(Number(q))
    .define('filter:lobes=8')
    .samplingFactor(2,2)
    .interlace('Line')
    .stream(function(err, stdout, stderr) {
      cb(err, stdout, stderr);
    })
}

