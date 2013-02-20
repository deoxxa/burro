// Buffer.concat 100 B x 212,666 ops/sec ±6.51% (65 runs sampled)
// buffer.write  100 B x 256,045 ops/sec ±4.56% (73 runs sampled) 
// buffer.copy   100 B x 241,399 ops/sec ±7.16% (80 runs sampled) <<<
// Buffer.concat 1024 B x 155,594 ops/sec ±8.18% (61 runs sampled)
// buffer.write  1024 B x 166,768 ops/sec ±7.31% (48 runs sampled)
// buffer.copy   1024 B x 150,536 ops/sec ±13.16% (63 runs sampled)
// Fastest is buffer.write  100 B,buffer.copy   100 B

// NOTES: I dislike buffer.write due to buf.write(chunk.toString() ...);
// converting a buffer to a string seems like it could have some potentialliy
// adverse side effects; chunk.copy(buf...) is slightly slower, but it is
// more favorable in my opinion

var Benchmark = require("benchmark"),
    crypto    = require("crypto");

var suite = new Benchmark.Suite;

suite.add('Buffer.concat 100 B', function() {
  crypto.randomBytes(100, function(error, bytes){;
    var buf = Buffer.concat([new Buffer(4), bytes]);
    buf.writeUInt32BE(buf.length, 0);
  });
});

suite.add('buffer.write  100 B', function() {
  crypto.randomBytes(100, function(error, bytes) {
    var len = bytes.length;
    var buf = new Buffer(len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(bytes.toString(), 4);
  });
});

suite.add('buffer.copy   100 B', function() {
  crypto.randomBytes(100, function(error, bytes) {
    var len = bytes.length;
    var buf = new Buffer(len + 4);
    buf.writeUInt32BE(len, 0);
    bytes.copy(buf, 4);
  });
});

suite.add('Buffer.concat 1024 B', function() {
  crypto.randomBytes(1024, function(error, bytes){;
    var buf = Buffer.concat([new Buffer(4), bytes]);
    buf.writeUInt32BE(buf.length, 0);
  });
});

suite.add('buffer.write  1024 B', function() {
  crypto.randomBytes(1024, function(error, bytes) {
    var len = bytes.length;
    var buf = new Buffer(len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(bytes.toString(), 4);
  });
});

suite.add('buffer.copy   1024 B', function() {
  crypto.randomBytes(1024, function(error, bytes) {
    var len = bytes.length;
    var buf = new Buffer(len + 4);
    buf.writeUInt32BE(len, 0);
    bytes.copy(buf, 4);
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run({async: true});