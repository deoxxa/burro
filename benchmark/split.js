var Benchmark = require("benchmark"),
    crypto    = require("crypto"),
    Burro     = require("../lib/burro");

// -----------------------------------------------------------
// create some sender/receiver streams
var Transform = require("stream").Transform,
    util      = require("util");

var Sender = function Sender() {
  Transform.call(this);
};
util.inherits(Sender, Transform);
Sender.prototype._transform = function _transform(packet, outputFn, callback) {
  var buf = new Buffer(JSON.stringify(packet.toString()) + "\n");
  // console.log("send:", buf); //UNCOMMENT
  this.emit("packet", buf);
  outputFn(buf);
  callback(null);
};

var Receiver = function Receiver() {
  Transform.call(this);
  this._remainder = "";
}
util.inherits(Receiver, Transform);
Receiver.prototype._transform = function _transform(chunk, outputFn, callback) {
  this._remainder += chunk.toString();
  var packets = this._remainder.split("\n");
  for (var i=0; i<packets.length-1; i++) {
    var packet = JSON.parse(packets[i]);
    // console.log("receive:", packet); //UNCOMMENT
    this.emit("packet", packet);
    outputFn(packet);
  };
  this._remainder = packets[i];
  callback(null);
};


// -----------------------------------------------------------
// benchmark
var suite = new Benchmark.Suite;

suite.add('split 100 B', function() {
  var sender = new Sender();
  var receiver = new Receiver();
  sender.pipe(receiver);
  crypto.randomBytes(100, function(error, bytes){;
    sender.write(bytes.toString('base64'));
  });
});

suite.add('burro 100 B', function() {
  var client = new Burro();
  var server = new Burro();
  var upstream = client.send();
  var downstream = server.receive(upstream);
  // upstream.on("packet", function(packet) {    //UNCOMMENT
  //   console.log("sending:", packet);          //UNCOMMENT
  // });                                         //UNCOMMENT
  // downstream.on("packet", function(packet) {  //UNCOMMENT
  //   console.log("receiving:", packet);        //UNCOMMENT
  // });                                         //UNCOMMENT
  crypto.randomBytes(100, function(error, bytes) {
    upstream.pack(bytes.toString('base64'));  
  });
  
});

suite.add('split 1 KB', function() {
  var sender = new Sender();
  var receiver = new Receiver();
  sender.pipe(receiver);
  crypto.randomBytes(1024, function(error, bytes){;
    sender.write(bytes.toString('base64'));
  });
});

suite.add('burro 1 KB', function() {
  var client = new Burro();
  var server = new Burro();
  var upstream = client.send();
  var downstream = server.receive(upstream);
  crypto.randomBytes(1024, function(error, bytes) {
    upstream.pack(bytes.toString('base64'));
  });
});


suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run({async: true});