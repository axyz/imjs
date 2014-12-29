module.exports =
  { big:
      { path: __dirname + '/../assets/watermark.jpg'
      , gravity: 'South'
      , scale: 1
      , xRelOffset: 0
      , yRelOffset: 0.1459
      , composeMethod: 'hardlight'
      }
  , small:
      { path: __dirname + '/../assets/watermark-small.jpg'
      , gravity: 'SouthWest'
      , scale: 0.35
      , xRelOffset: 0
      , yRelOffset: 0
      , composeMethod: 'hardlight'
      }
  }

