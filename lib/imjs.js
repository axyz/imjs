var fs = require('fs');
var glob = require('glob');
var Parallel = require('paralleljs');
var path = require('path');
var mkdirp = require('mkdirp');

const IMG_EXTS = ['jpg', 'JPG', 'jpeg', 'JPEG'
                 ,'tif', 'TIF', 'tiff', 'TIFF'
                 ,'png', 'PNG', 'gif' , 'GIF'];

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

function resizeDirIn(src, dest, w, h, q) {
  console.log('TO-DO: resize ' + src + ' content in ' + dest);
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

function resizeGlobIn(src, dest, w, h, q) {
  dest = prepareDest(dest);
  glob(src, function(err, files) {
    var images = files.filter(isImage);
    var batch = []
    images.forEach(function(name) {
      batch.push({src: name, dest: dest, w: w, h: h, q: q});
    })
    var pimgs = new Parallel(batch);
    pimgs.map(function(el) {
      var output = require('path').join(el.dest, require('path').basename(el.src));
      require('../../../lib/commands').resize(el.src, output, el.w, el.h, el.q);
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
