var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Framer", function(){

  var framer, writable;

  beforeEach(function() {
    framer   = new burro.Framer();
    writable = new stream.Writable();
    framer.pipe(writable);
  });

  it("should prepend uint32be packet length", function(done) {
    var expected = Buffer([255,255,255,255]);
    writable._write = function(chunk, encoding, callback) {
      assert.deepEqual(chunk, Buffer([0,0,0,4,255,255,255,255]));
      done();
    };
    framer.write(expected);
  });

});
