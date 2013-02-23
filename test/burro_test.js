var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Burro", function(){

  var bob, alice;

  beforeEach(function() {
    bob   = burro.encoder();
    alice = burro.decoder();
    bob.pipe(alice);
  });

  it("should serialize a simple string", function(done){
    alice.on("packet", function(packet) {
      assert.equal("hello", packet);
      done();
    });
    bob.write("hello");
  });

  it("should serialize a simple object", function(done){
    var obj = {a: "a", b: "b"};
    alice.on("packet", function(packet) {
      assert.deepEqual(obj, packet);
      done();
    });
    bob.write(obj);
  });

  it("should serialize a complex object", function(done){
    var obj = {
      name: "olan",
      pets: [
        {type: "cat", name: "starscream"},
        {type: "mau5", name: "dead"}
      ]
    };
    alice.on("packet", function(packet) {
      assert.deepEqual(obj, packet);
      done();
    });
    bob.write(obj);
  });

  it("should serialize multiple objects", function(done) {
    var queue = [
      'hello world',
      {foo: "bar", zim: "gir", dib: "gaz"},
      {string: "yay", number: 123, hex: 0xff}
    ];
    alice.on("packet", function(packet) {
      assert.deepEqual(queue.shift(), packet);
      if (queue.length === 0) {
        done();
      }
    });
    queue.forEach(function(obj) {
      bob.write(obj);
    });    
  });

  it("should serialize utf8 properly", function(done) {
    var message = "どうもありがとう";
    alice.on("packet", function(packet) {
      assert.equal(message, packet);
      done();
    });
    bob.write(message);
  });

  it("should work with a 10 MB packet", function(done) {
    var str;
    alice.on("packet", function(packet) {
      assert.deepEqual(str, packet);
      done();
    });
    require("crypto").randomBytes(1024*1024*10, function(error, chunk) {
      if (error) {
        done(error);
      }
      str = chunk.toString("base64");
      bob.write(str);
    });
  });

  it("should be able to wrap a stream", function(done) {
    var socket = burro.wrap(new stream.PassThrough()),
        endpoint = new stream.Writable,
        obj = {a: "b", c: "d"};
    endpoint._write = function _write(chunk, _) {
      assert.deepEqual(obj, chunk);
      done();
    };
    socket.pipe(endpoint);
    socket.write(obj);
  });
  
});