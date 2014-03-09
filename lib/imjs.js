var fs = require('fs');
var glob = require('glob');
var Parallel = require('paralleljs');

const IMG_EXTS = ['jpg', 'JPG', 'jpeg', 'JPEG'
                 ,'tif', 'TIF', 'tiff', 'TIFF'
                 ,'png', 'PNG', 'gif' , 'GIF'];

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

function resizeGlobIn(src, dest, w, h, q) {
  console.log('TO-DO: resize ' + src + 'in ' + dest);
  glob(src, function(err, files) {
    var images = files.filter(isImage);
    var batch = []
    images.forEach(function(name) {
      batch.push({src: name, dest: dest, w: w, h: h, q: q});
    })
    var pimgs = new Parallel(batch);
    pimgs.map(function(el) {
      console.log('resizing ' + el.src);
      //resize(el, dest + '/' + path.basename(dest), w, h, q);
      var output = require('path').join(el.dest, require('path').basename(el.src));
      console.log(output);
    });
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
