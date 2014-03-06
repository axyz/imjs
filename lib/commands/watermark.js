var fs = require('fs');
var gm = require('gm');
var im = gm.subClass({ imageMagick: true });

var wm = { big: { path: __dirname + '../assets/watermark.jpg'
                , gravity: 'south'
                , scale: 1
                , xRelOffset: 0
                , yRelOffset: 0.1459
                , composeMethod: 'hardlight'
                }
         , small: { path: __dirname + '../assets/watermark-small.jpg'
                  , gravity: 'SouthWest'
                  , scale: 0.3
                  , xRelOffset: 0
                  , yRelOffset: 0
                  , composeMethod: 'hardlight'
                  }
};

exports.resize = function(src, dest, type){
  console.log('watermarking...');

  var wmReadStream = fs.createReadStream(wm[type]);
  var imgReadStream = fs.createReadStream(src);

  im(imgReadStream).size(function(err, dims) {
    im(wmReadStream)
      .resize(dims.width * wm[type].scale)
  })

  im(wmReadStream)
    .resize(w,h)
    .stream(function (err, stdout, stderr) {
        var writeStream = fs.createWriteStream(dest);
          stdout.pipe(writeStream);
    });
}
