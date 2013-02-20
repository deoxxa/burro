Burro
=====

Burro is a useful creature that auto-packages objects in length-prefixed JSON byte streams.

Example
-------

```js
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
```

Tests
-----

requires: `npm install mocha`

Burro is a pretty versatile beast and can even handle very large payloads.
See `test/burro_test.js` for more details.
