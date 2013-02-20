#!/usr/bin/env node

var Burro = require("./lib/burro");

// --------------------------------------------------------------
// send somes stuff
var client = new Burro();
var upstream = client.send();

upstream.on("packet", function(packet) {
  console.log("sending:", packet);
});

upstream
  .pack({message: "どもうありがとう！", from: "japan", to: "usa"})
  .pack({message: "thank you!", from: "usa", to: "japan"});


// --------------------------------------------------------------
// receive some stuff
var server = new Burro();
var downstream = server.receive(upstream);
downstream.on("packet", function(packet) {
  console.log("received:", packet);
});


// --------------------------------------------------------------
// send some more; pipe remains open
setTimeout(function() {
  upstream.pack("^.^");
}, 1000);
