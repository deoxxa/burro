// Buffer.concat 10 B x 159,628 ops/sec ±16.62% (45 runs sampled)
// Buffer.copy   10 B x 156,530 ops/sec ±20.44% (36 runs sampled)
// Buffer.concat 100 B x 214,142 ops/sec ±5.41% (82 runs sampled)
// Buffer.copy   100 B x 239,844 ops/sec ±6.68% (75 runs sampled)  <<<
// Buffer.concat 1024 B x 139,631 ops/sec ±9.08% (58 runs sampled)
// Buffer.copy   1024 B x 147,221 ops/sec ±15.42% (61 runs sampled)
// Fastest is Buffer.copy   100 B

// NOTES: this one is just weird.

var Benchmark = require("benchmark"),
    crypto    = require("crypto");

var suite = new Benchmark.Suite;

suite.add('Buffer.concat 10 B', function() {
  crypto.randomBytes(10, function(error, bytes){
    var buf = Buffer.concat([new Buffer(4), bytes]);
  });
});

suite.add('Buffer.copy   10 B', function() {
  crypto.randomBytes(10, function(error, bytes){
    var buf = new Buffer(4);
    var tmp = new Buffer(buf.length + bytes.length);
    buf.copy(tmp, 0);
    bytes.copy(tmp, buf.length);
    buf = tmp;
  });
});

suite.add('Buffer.concat 100 B', function() {
  crypto.randomBytes(100, function(error, bytes){
    var buf = Buffer.concat([new Buffer(4), bytes]);
  });
});

suite.add('Buffer.copy   100 B', function() {
  crypto.randomBytes(100, function(error, bytes){
    var buf = new Buffer(4);
    var tmp = new Buffer(buf.length + bytes.length);
    buf.copy(tmp, 0);
    bytes.copy(tmp, buf.length);
    buf = tmp;
  });
});

suite.add('Buffer.concat 1024 B', function() {
  crypto.randomBytes(1024, function(error, bytes){
    var buf = Buffer.concat([new Buffer(4), bytes]);
  });
});

suite.add('Buffer.copy   1024 B', function() {
  crypto.randomBytes(1024, function(error, bytes){
    var buf = new Buffer(4);
    var tmp = new Buffer(buf.length + bytes.length);
    buf.copy(tmp, 0);
    bytes.copy(tmp, buf.length);
    buf = tmp;
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run({async: true});