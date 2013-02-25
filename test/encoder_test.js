var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Encoder", function(){

  var encoder, writable;

  beforeEach(function() {
    encoder  = new burro.Encoder();
    writable = new stream.Writable({objectMode: true});
    encoder.pipe(writable);
  });

  it("should encode a string", function(done) {
    var expected = "hello";
    writable._write = function(chunk, _) {
      assert.strictEqual(chunk, JSON.stringify(expected));
      done();
    };
    encoder.write(expected);
  });

  it("should encode an object", function(done) {
    var expected = {a: "b", c: "d"};
    writable._write = function(chunk, _) {
      assert.strictEqual(chunk, JSON.stringify(expected));
      done();
    };
    encoder.write(expected);
  });

});
