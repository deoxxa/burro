var assert    = require("assert"),
    burro     = require("../lib/burro"),
    stream    = require("stream");

describe("Burro socket", function(){

  var bob, alice, metal, socket, events;

  beforeEach(function() {
    events = [];
    bob    = new stream.PassThrough();
    alice  = new stream.PassThrough();
    metal  = new stream.PassThrough();
    socket = burro.wrap(metal);
    bob.pipe(socket).pipe(alice);
  });

  it("should end all the sockets", function(done) {
    var goodbye = function(id) {
      events.push(id);
    };
    bob.on("end", goodbye.bind(null, "bob"));
    socket.on("end", goodbye.bind(null, "socket"));
    metal.on("end", goodbye.bind(null, "metal"));
    alice.on("end", function() {
      assert.deepEqual(events, ["bob", "socket", "metal"]);
      done();
    });
    bob.end();
  });

});
