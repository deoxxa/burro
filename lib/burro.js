var Encoder   = exports.Encoder   = require("./encoder"),
    Decoder   = exports.Decoder   = require("./decoder"),
    Framer    = exports.Framer    = require("./framer"),
    Unframer  = exports.Unframer  = require("./unframer");

exports.wrap = function wrap(stream) {
  var enc = new Encoder();
  var dec = new Decoder();
  
  // pipe burro streams
  enc .pipe(new Framer())
      .pipe(stream)
      .pipe(new Unframer())
      .pipe(dec);
  
  // shim
  var res     = Object.create(enc);
  res.pipe    = dec.pipe.bind(dec);
  res.unpipe  = dec.unpipe.bind(dec);
  return res;
};
