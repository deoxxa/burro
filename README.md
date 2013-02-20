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


Output
------

```
sending: <Buffer 00 00 00 43 7b 22 6d 65 73 73 61 67 65 22 3a 22 e3 81 a9 e3 82 82 e3 81 86 e3 81 82 e3 82 8a e3 81 8c e3 81 a8 e3 81 86 ef bc 81 22 2c 22 66 72 6f 6d 22 ...>
sending: <Buffer 00 00 00 32 7b 22 6d 65 73 73 61 67 65 22 3a 22 74 68 61 6e 6b 20 79 6f 75 21 22 2c 22 66 72 6f 6d 22 3a 22 75 73 61 22 2c 22 74 6f 22 3a 22 6a 61 70 61 ...>

received: { message: 'どもうありがとう！', from: 'japan', to: 'usa' }
received: { message: 'thank you!', from: 'usa', to: 'japan' }

sending: <Buffer 00 00 00 05 22 5e 2e 5e 22>
received: ^.^
```


Tests
-----

requires: `npm install mocha`

Burro is a pretty versatile beast and can even handle very large payloads.
See `test/burro_test.js` for more details.
