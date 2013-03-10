var assert    = require("assert"),
    stream    = require("stream"),
    hiccup    = require("hiccup"),
    burro     = require("../lib/burro");

describe("Burro", function(){

  it("should receive objects from a slow stream", function(done) {
    
    // setup
    this.timeout(10000);

    // streams
    var bob     = new stream.Readable({objectMode: true}),
        alice   = new stream.Writable({objectMode: true}),
        loris   = new hiccup.Throttle({bytes: 5, latency: 100, jitter: 0.5}),
        socket  = burro.wrap(loris);
    bob._read = function _read(bytes) {};
    bob.pipe(socket).pipe(alice);
    
    // test
    var expected = [
      {cup: "cakes", want: [1,2,3], many: {plz2b: "thx"}},
      {foo: "bar", zim: "gir", dib: "gaz"},
      {string: "yay", number: 123, hex: 0xff}
    ];
    alice._write = function(obj, encoding, callback) {
      assert.deepEqual(obj, expected.shift());
      if (expected.length === 0) {
        done();
      }
      callback();
    };
    expected.forEach(function(obj) {
      bob.push(obj);
    });
  });

  it("should receive objects from a choking stream", function(done) {
    
    // setup
    this.timeout(10000);

    // streams
    var bob   = new stream.Readable({objectMode: true}),
        alice = new stream.Writable({objectMode: true}),
        loris = new hiccup.Throttle({bytes: 10, latency: 100, jitter: 0}),
        choke = new hiccup.Choke({delay: 1000, interval: 0});
    bob._read = function _read(bytes) {};

    // manual burro chain due to twin-stream socket
    bob .pipe(new burro.Encoder())
        .pipe(new burro.Framer())
        .pipe(loris)
        .pipe(choke)
        .pipe(new burro.Unframer())
        .pipe(new burro.Decoder())
        .pipe(alice);

    // test
    var expected = [
      {cup: "cakes", want: [1,2,3], many: {plz2b: "thx"}},
      {foo: "bar", zim: "gir", dib: "gaz"},
      {string: "yay", number: 123, hex: 0xff}
    ];
    alice._write = function(obj, encoding, callback) {
      assert.deepEqual(obj, expected.shift());
      if (expected.length === 0) {
        done();
      }
      callback();
    };
    expected.forEach(function(obj) {
      bob.push(obj);
    });
  });

});
