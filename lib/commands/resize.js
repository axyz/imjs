var fs = require('fs');
var gm = require('gm');
var im = gm.subClass({ imageMagick: true });

exports.resize = function(src, dest, w, h, q){
  console.log('resizing...');

  var readStream = fs.createReadStream(src);

  im(readStream)
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
