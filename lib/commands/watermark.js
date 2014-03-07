var fs = require('fs');
var magick = require('../magick');

var wm = { big: { path: __dirname + '/../assets/watermark.jpg'
                , gravity: 'South'
                , scale: 1
                , xRelOffset: 0
                , yRelOffset: 0.1459
                , composeMethod: 'hardlight'
                }
         , small: { path: __dirname + '/../assets/watermark-small.jpg'
                  , gravity: 'SouthWest'
                  , scale: 0.3
                  , xRelOffset: 0
                  , yRelOffset: 0
                  , composeMethod: 'hardlight'
                  }
};

exports.watermark = function(src, dest, type){
  console.log('watermarking ' + src);

  magick(src).size(function(err, dims) {
    if(!err) {
      var w = dims.width;
      var h = dims.height;
      var offX = (wm[type].xRelOffset * w) | 0;
      var offY = (wm[type].yRelOffset * h) | 0;
      var size = (wm[type].scale * w) | 0;

      magick(src)
        .command('composite')
        .in('-compose', wm[type].composeMethod)
        .in(wm[type].path)
        .geometry(size, '+' + offX + '+' + offY)
        .gravity(wm[type].gravity)
        .write(dest, function(err) {
          if(err) {
            console.log(err);
          }else {
            console.log('Done!');
          }
        })
    }else {
      console.log(err);
    }
  });
}
