var Encoder = require("./encoder"),
    Decoder = require("./decoder");

module.exports = {
  
  encoder: function encoder() {
    return new Encoder();
  },
  
  decoder: function decoder() {
    return new Decoder();
  },

  wrap: function wrap(stream) {
    var enc = new Encoder();
    var dec = new Decoder();
    
    enc.pipe(stream).pipe(dec);
    enc.pipe = function(dest) {
      return dec.pipe(dest);
    };
    
    return enc;
  }

};
