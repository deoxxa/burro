#!/usr/bin/env node

var burro = require("./lib/burro");

// --------------------------------------------------------------
// send some stuff
var client = new burro.Sender();

client.on("packet", function(packet) {
  console.log("sending:", packet);
});

client
  .pack({message: "どもうありがとう！", from: "japan", to: "usa"})
  .pack({message: "thank you!", from: "usa", to: "japan"});


// --------------------------------------------------------------
// receive some stuff
var server = new burro.Receiver();

server.on("packet", function(packet) {
  console.log("received:", packet);
});


// --------------------------------------------------------------
// cross the streams!
client.pipe(server);


// --------------------------------------------------------------
// send some more; pipe remains open
setTimeout(function() {
  client.pack("^.^");
}, 1000);
