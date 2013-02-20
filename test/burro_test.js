var assert    = require("assert"),
    Burro     = require("../lib/burro");

describe("Burro", function(){

  var bob, alice, upstream, downstream;

  beforeEach(function() {
    // sender
    bob = new Burro();
    upstream = bob.send();
    
    // receiver
    alice = new Burro();
    downstream = alice.receive(upstream);
  });


  it("should serialize a simple string", function(done){
    downstream.on("packet", function(packet) {
      assert.equal("hello", packet);
      done();
    });
    upstream.pack("hello");
  });

  it("should serialize a simple object", function(done){
    var obj = {a: "a", b: "b"};
    downstream.on("packet", function(packet) {
      assert.deepEqual(obj, packet);
      done();
    });
    upstream.pack(obj);
  });

  it("should serialize a complex object", function(done){
    var obj = {
      name: "olan",
      pets: [
        {type: "cat", name: "starscream"},
        {type: "mau5", name: "dead"}
      ]
    };
    downstream.on("packet", function(packet) {
      assert.deepEqual(obj, packet);
      done();
    });
    upstream.pack(obj);
  });

  it("should serialize multiple objects", function(done) {
    var queue = [
      'hello world',
      {foo: "bar", zim: "gir", dib: "gaz"},
      {string: "yay", number: 123, hex: 0xff}
    ];
    downstream.on("packet", function(packet) {
      assert.deepEqual(queue.shift(), packet);
      if (queue.length === 0) {
        done();
      }
    });
    queue.forEach(function(obj) {
      upstream.pack(obj);
    });    
  });

  it("should serialize utf8 properly", function(done) {
    var message = "どうもありがとう";
    downstream.on("packet", function(packet) {
      assert.equal(message, packet);
      done();
    });
    upstream.pack(message);
  });

  it("should work with a 10 MB packet", function(done) {
    var str;
    downstream.on("packet", function(packet) {
      assert.deepEqual(str, packet);
      done();
    });
    require("crypto").randomBytes(1024*1024*10, function(error, chunk) {
      if (error) {
        done(error);
      }
      str = chunk.toString("base64");
      upstream.pack(str);
    });
  });
  
});