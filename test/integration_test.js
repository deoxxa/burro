var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Burro", function(){

  var bob, alice, _socket, socket;

  beforeEach(function() {
    bob   = new stream.Readable({objectMode: true});
    bob._read = function _read() {};
    alice = new stream.Writable({objectMode: true});
    _socket = new stream.PassThrough();
    socket = burro.wrap(_socket);
    bob.pipe(socket).pipe(alice);
  });

  it("should serialize a simple string", function(done){
    var expected = "hello world";
    alice._write = function(obj, _) {
      assert.strictEqual(obj, expected);
      done();
    };
    bob.push(expected);
  });

  it("should serialize a simple object", function(done){
    var expected = {a: "a", b: "b"};
    alice._write = function(obj, _) {
      assert.deepEqual(obj, expected);
      done();
    };
    bob.push(expected);
  });

  it("should serialize a complex object", function(done){
    var expected = {
      name: "olan",
      pets: [
        {type: "cat", name: "starscream"},
        {type: "mau5", name: "dead"}
      ]
    };
    alice._write = function(obj, _) {
      assert.deepEqual(obj, expected);
      done();
    };
    bob.push(expected);
  });

  it("should serialize multiple objects", function(done) {
    var expected = [
      {cup: "cakes", want: [1,2,3], many: {plz2b: "thx"}},
      {foo: "bar", zim: "gir", dib: "gaz"},
      {string: "yay", number: 123, hex: 0xff}
    ];
    alice._write = function(obj, _) {
      assert.deepEqual(obj, expected.shift());
      _();
      if (expected.length === 0) {
        done();
      }
    };
    expected.forEach(function(obj) {
      bob.push(obj);
    });    
  });

  it("should serialize utf8 properly", function(done) {
    var expected = "どうもありがとう";
    alice._write = function(obj, _) {
      assert.strictEqual(obj, expected);
      done();
    };
    bob.push(expected);
  });

  it("should work with a 10 MB packet", function(done) {
    var expected;
    alice._write = function(obj, _) {
      assert.strictEqual(obj, expected);
      done();
    };
    require("crypto").randomBytes(1024*1024*10, function(error, chunk) {
      expected = chunk.toString("base64");
      bob.push(expected);
    });
  });

  it("should bubble `pipe' events", function(done) {
    socket.on("pipe", function() {
      done();
    });

    var pipeFrom = new stream.Readable();
    pipeFrom._read = function () {};
    pipeFrom.pipe(_socket);
  });

  it("should bubble `unpipe' events", function(done) {
    socket.on("unpipe", function() {
      done();
    });

    socket.on("pipe", function() {
      pipeFrom.unpipe(socket);
    });

    var pipeFrom = new stream.Readable();
    pipeFrom._read = function () {};
    pipeFrom.pipe(_socket);
  });

  it("should bubble `end' events", function(done) {
    socket.on("end", function() {
      done();
    });
    _socket.end();
  });

  it("should bubble `close' events", function(done) {
    socket.on("close", function() {
      done();
    });
    _socket.end();
    _socket.emit("close");
  });

  it("should bubble `error' events", function(done) {
    socket.on("error", function() {
      done();
    });
    _socket.emit("error", Error("RAISE NEW PROBLEM"));
  });

});
