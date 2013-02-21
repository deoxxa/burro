var assert    = require("assert"),
    burro     = require("../lib/burro");

describe("Burro", function(){

  var bob, alice;

  beforeEach(function() {
    bob   = new burro.Sender();
    alice = new burro.Receiver();
    bob.pipe(alice);
  });

  it("should serialize a simple string", function(done){
    alice.on("packet", function(packet) {
      assert.equal("hello", packet);
      done();
    });
    bob.pack("hello");
  });

  it("should serialize a simple object", function(done){
    var obj = {a: "a", b: "b"};
    alice.on("packet", function(packet) {
      assert.deepEqual(obj, packet);
      done();
    });
    bob.pack(obj);
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
    bob.pack(obj);
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
      bob.pack(obj);
    });    
  });

  it("should serialize utf8 properly", function(done) {
    var message = "どうもありがとう";
    alice.on("packet", function(packet) {
      assert.equal(message, packet);
      done();
    });
    bob.pack(message);
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
      bob.pack(str);
    });
  });
  
});