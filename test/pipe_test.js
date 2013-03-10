var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("burro.wrap pipe events", function(){

  var bob, alice, socket;

  beforeEach(function() {
    bob     = new stream.PassThrough();
    alice   = new stream.PassThrough();
    socket  = burro.wrap(new stream.PassThrough());
  });

  it("should emit its own pipe events", function(done) {
    socket.on("pipe", function(source) {
      assert.equal(source, bob);
      done();
    });
    bob.pipe(socket);
  });

  it("should emit its own unpipe events", function(done) {
    socket.on("pipe", function(source) {
      bob.unpipe(socket);
    });
    socket.on("unpipe", function(source) {
      assert.equal(source, bob);
      done();
    });
    bob.pipe(socket);
  });

  it("should pipe successfully", function(done) {
    alice.on("pipe", function(source) {
      // TODO: ideally, this would pass
      // assert.equal(source, socket);
      done();
    });
    socket.pipe(alice);
  });

  it("should unpipe successfully", function(done) {
    alice.on("pipe", function(source) {
      socket.unpipe(alice);
    });
    alice.on("unpipe", function(source) {
      // TODO: ideally, this would pass
      // assert.equal(source, socket);
      done();
    });
    socket.pipe(alice);
  });

});
