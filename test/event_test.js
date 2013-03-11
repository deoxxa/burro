var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("burro.wrap events", function(){

  var bob, alice, metal, socket, events;

  beforeEach(function() {
    events = [];
    bob    = new stream.PassThrough({objectMode: true});
    alice  = new stream.PassThrough({objectMode: true});
    metal  = new stream.PassThrough();
    socket = burro.wrap(metal);
    bob.pipe(socket).pipe(alice);
  });

  it("should end all the sockets", function(done) {
    var goodbye = function(id) {
      events.push(id);
    };
    bob.on("finish", goodbye.bind(null, "bob"));
    socket.on("finish", goodbye.bind(null, "socket"));
    metal.on("finish", goodbye.bind(null, "metal"));
    alice.on("finish", function() {
      assert.deepEqual(events, ["bob", "socket", "metal"]);
      done();
    });
    bob.end();
  });

});
