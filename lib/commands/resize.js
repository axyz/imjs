var fs = require('fs');
var magick = require('../magick');

exports.resize = function(src, dest, w, h, q){
  console.log('resizing...');

  var readStream = fs.createReadStream(src);

  magick(readStream)
    .profile(__dirname + '/../assets/sRGB.icc')
    .filter('lanczos')
    .resize(w,h)
    .quality(q)
    .define('filter:lobes=8')
    .samplingFactor(2,2)
    .interlace('Line')
    .stream(function (err, stdout, stderr) {
        var writeStream = fs.createWriteStream(dest);
        stdout.pipe(writeStream);
    });
}
