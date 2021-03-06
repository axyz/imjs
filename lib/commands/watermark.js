var fs = require('fs');
var magick = require('../magick');

var wm = require('../assets/watermark-presets');

function adaptWatermark(src, type, cb) {
  console.log('adapting')
  magick(src).size(function(err, dims) {
    if(!err) {
      var offX = (wm[type].xRelOffset * dims.width) | 0;
      var offY = (wm[type].yRelOffset * dims.height) | 0;
      var size = (wm[type].scale * dims.width) | 0;
      cb(null, src, offX, offY, size);
    }else {
      console.log(err);
    }
  })
}

exports.watermark = function(src, dest, type) {
  console.log('watermarking ' + src);

  adaptWatermark(src, type, function(err, src, offX, offY, size) {
    console.log('watermarking...')
    magick(src)
      .command('composite')
      .in('-compose', wm[type].composeMethod)
      .in(wm[type].path)
      .geometry(size, '+' + offX + '+' + offY)
      .gravity(wm[type].gravity)
      .write(dest, function(err) {
        if(!err) {
          console.log('Done!');
          return 0;
        }else {
          console.log(err);
        }
      })
  })
}

exports.watermarkWorker = function(src, dest, type, offX, offY, size) {
  console.log('watermarking ' + src);

    magick(src)
      .command('composite')
      .in('-compose', wm[type].composeMethod)
      .in(wm[type].path)
      .geometry(size, '+' + offX + '+' + offY)
      .gravity(wm[type].gravity)
      .write(dest, function(err) {
        if(!err) {
          console.log('Done!');
          return 0;
        }else {
          console.log(err);
        }
      })
}
