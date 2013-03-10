var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Decoder", function(){

  var decoder, writable;

  beforeEach(function() {
    decoder  = new burro.Decoder();
    writable = new stream.Writable({objectMode: true});
    decoder.pipe(writable);
  });

  it("should decode a string", function(done) {
    var expected = "hello";
    writable._write = function(chunk, encoding, callback) {
      assert.strictEqual(chunk, expected);
      done();
    };
    decoder.write(JSON.stringify(expected));
  });

  it("should decode an object", function(done) {
    var expected = {a: "b", c: "d"};
    writable._write = function(chunk, encoding, callback) {
      assert.deepEqual(chunk, expected);
      done();
    };
    decoder.write(JSON.stringify(expected));
  });

});
