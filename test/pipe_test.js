var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Burro", function(){

  var bob, socket;

  beforeEach(function() {
    socket = burro.wrap(new stream.PassThrough());
    bob = new stream.PassThrough();
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
    bob.on("pipe", function() {
      done();
    });
    socket.pipe(bob);
  });

  it("should unpipe successfully", function(done) {
    bob.on("pipe", function() {
      bob.on("unpipe", function() {
        done();
      });

      socket.unpipe(bob);
    });

    socket.pipe(bob);
  });

});
