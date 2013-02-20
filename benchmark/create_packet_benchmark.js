var Benchmark = require("benchmark"),
    crypto    = require("crypto");

var suite = new Benchmark.Suite;

suite.add('Buffer.concat 100 B', function() {
  crypto.randomBytes(100, function(error, bytes){;
    var buf = Buffer.concat([new Buffer(4), bytes]);
    buf.writeUInt32BE(buf.length, 0);
  });
});

suite.add('buffer.write 100 B', function() {
  crypto.randomBytes(100, function(error, bytes) {
    var len = bytes.length;
    var buf = new Buffer(len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(bytes.toString(), 4);
  });
});

suite.add('buffer.copy 100 B', function() {
  crypto.randomBytes(100, function(error, bytes) {
    var len = bytes.length;
    var buf = new Buffer(len + 4);
    buf.writeUInt32BE(len, 0);
    bytes.copy(buf, 4);
  });
});

suite.add('Buffer.concat 1 KB', function() {
  crypto.randomBytes(1024, function(error, bytes){;
    var buf = Buffer.concat([new Buffer(4), bytes]);
    buf.writeUInt32BE(buf.length, 0);
  });
});

suite.add('buffer.write 1 KB', function() {
  crypto.randomBytes(1024, function(error, bytes) {
    var len = bytes.length;
    var buf = new Buffer(len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(bytes.toString(), 4);
  });
});

suite.add('buffer.copy 1 KB', function() {
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