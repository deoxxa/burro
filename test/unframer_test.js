var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Unframer", function(){

  var unframer, writable;

  beforeEach(function() {
    unframer = new burro.Unframer();
    unframer.writeBytes = function() {
      this.write(Buffer(arguments));
      return this;
    };
    writable = new stream.Writable();
    unframer.pipe(writable);
  });

  it("should unframe a packet", function(done) {
    var expected = Buffer([255,255,255,255]);
    writable._write = function(chunk, _) {
      assert.deepEqual(chunk, expected);
      done();
    };
    unframer.writeBytes(0, 0, 0, 4, 255, 255, 255, 255);
  });

  it("should unframe a split packet", function(done) {
    var expected = Buffer([255,255,255,255]);
    writable._write = function(chunk, _) {
      assert.deepEqual(chunk, expected);
      done();
    };
    unframer.writeBytes(0)
            .writeBytes(0, 0)
            .writeBytes(4)
            .writeBytes(255,255)
            .writeBytes(255,255);
  });

  it("should unframe joined packets", function(done) {
    var expected = [
      Buffer([255]),
      Buffer([255,255]),
      Buffer([255,255,255])
    ];
    writable._write = function _write(chunk, callback) {
      assert.deepEqual(chunk, expected.shift());
      callback(null);
      if (expected.length === 0) {
        done();
      }
    };
    unframer.writeBytes(
      0,0,0,1,255,
      0,0,0,2,255,255,
      0,0,0,3,255,255,255
    );
  });

});
