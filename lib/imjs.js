var fs = require('fs');
var glob = require('glob');
var Parallel = require('paralleljs');
var path = require('path');
var mkdirp = require('mkdirp');
var magick = require('./magick');
var os = require('os');

const IMG_EXTS =
  ['jpg', 'JPG', 'jpeg', 'JPEG'
  ,'tif', 'TIF', 'tiff', 'TIFF'
  ,'png', 'PNG', 'gif' , 'GIF'];

var wm = require('./assets/watermark-presets');

function timeStamp(){
  return Date()
    .toString()
    .slice(0,24)
    .replace(/:/g,'')
    .replace(/ /g, '');
}

function isImage(fileName) {
  if(IMG_EXTS.indexOf(fileName.split('.').pop()) == -1) {
    return false;
  }else {
    return true;
  }
}

function isDir(path) {
  try{
    var stats = fs.lstatSync(path);
    return stats.isDirectory();
  }catch(e) {
    return false;
  }
}

function prepareDest(p) {
  var uid = timeStamp();
  if(isDir(p)){
    var newDir = p + '-' + uid;
    mkdirp(newDir, function(err) {
      if(!err) {
        console.log('directory created: ' + newDir);
      }else {
        console.log(err);
      }
    })
    return newDir;
  }else {
    mkdirp(p, function(err) {
      if(err) console.log(err);
    })
    return p;
  }
}

function resizeDirIn(src, dest, w, h, q) {
  dest = prepareDest(path.join(src, dest));
  fs.readdir(src, function(err, files) {
    var images = files.filter(isImage);
    var batch = []
    images.forEach(function(name, index) {
      batch.push({src: path.join(src, name), dest: dest, w: w, h: h, q: q});
      if(index == images.length-1) {
        var pimgs = new Parallel(batch);
        pimgs.map(function(el) {
          var output = require('path').join(el.dest, require('path').basename(el.src));
          var destWriteStream = require('fs').createWriteStream(output);
          require('../../../lib/commands').resize(el.src, output, el.w, el.h, el.q, function(err, stdout, stderr) {
            stdout.pipe(destWriteStream);
            stdout.on('finish', function() {
              return 0;
            })
          })
        });
      }
    })
  })
}

function resizeGlobIn(src, dest, w, h, q) {
  dest = prepareDest(path.join(path.dirname(src), dest));
  glob(src, function(err, files) {
    var images = files.filter(isImage);
    var batch = []
    images.forEach(function(name, index) {
      batch.push({src: name, dest: dest, w: w, h: h, q: q});
      if(index == images.length-1) {
        var pimgs = new Parallel(batch);
        pimgs.map(function(el) {
          var output = require('path').join(el.dest, require('path').basename(el.src));
          require('../../../lib/commands').resize(el.src, output, el.w, el.h, el.q);
          return 0;
        })
      }
    })
  })
}

function watermarkDirIn(src, dest, type) {
  dest = prepareDest(path.join(src, dest));
  fs.readdir(src, function(err, files) {
    var images = files.filter(isImage);
    var batch = []
    images.forEach(function(name, index) {
      magick(path.join(src, name)).size(function(err, dims) {
        if(!err) {
          var offX = (wm[type].xRelOffset * dims.width) | 0;
          var offY = (wm[type].yRelOffset * dims.height) | 0;
          var size = (wm[type].scale * dims.width) | 0;
          batch.push({src: path.join(src, name), dest: dest, type: type, offX: offX, offY: offY, size: size});
          if(index == images.length-1) {
            var pimgs = new Parallel(batch);
            pimgs.map(function(el) {
              var output = require('path').join(el.dest, require('path').basename(el.src));
              require('../../../lib/commands').watermarkWorker(el.src, output, el.type, el.offX, el.offY, el.size);
              return 0;
            })
          }
        }else {
          console.log(err);
        }
      })
    })
  })
}

function watermarkGlobIn(src, dest, type) {
  dest = prepareDest(path.join(path.dirname(src), dest));
  glob(src, function(err, files) {
    var images = files.filter(isImage);
    var batch = []
    images.forEach(function(name, index) {
      magick(name).size(function(err, dims) {
        if(!err) {
          var offX = (wm[type].xRelOffset * dims.width) | 0;
          var offY = (wm[type].yRelOffset * dims.height) | 0;
          var size = (wm[type].scale * dims.width) | 0;
          batch.push({src: name, dest: dest, type: type, offX: offX, offY: offY, size: size});
          if(index == images.length-1) {
            var pimgs = new Parallel(batch);
            pimgs.map(function(el) {
              var output = require('path').join(el.dest, require('path').basename(el.src));
              require('../../../lib/commands').watermarkWorker(el.src, output, el.type, el.offX, el.offY, el.size);
              return 0;
            })
          }
        }else {
          console.log(err);
        }
      })
    })
  })
}

exports.resizeIn= function(src, dest, w, h, q) {
  console.log('resizing in ' + dest);
  if(isDir(src)) {
    resizeDirIn(src, dest, w, h, q);
  }else {
    resizeGlobIn(src, dest, w, h, q);
  }
}

exports.watermarkIn= function(src, dest, type) {
  console.log('watermarking in ' + dest);
  if(isDir(src)) {
    watermarkDirIn(src, dest, type);
  }else {
    watermarkGlobIn(src, dest, type);
  }
}

