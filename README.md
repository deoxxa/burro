Burro
=====

Burro is a useful creature that auto-packages objects in length-prefixed JSON
byte streams.


Overview
--------

Burro is made up of **4 streams** that makes sending/receiving objects a breeze

Sender streams:

* _burro.Encoder_ - encodes objects into proper JSON strings
* _burro.Framer_ - frames JSON in a **uint32be** length-prefixed buffer

Receiver streams:

* _burro.Unframer_ - processes length prefix and parses out JSON
* _burro.Decoder_ - decodes JSON into objects


Example
-------

```js
var burro  = require("burro"),
    stream = require("stream");

// dummy network stream
var network = new stream.PassThrough();
    
// wrap! auto encode/decode json frames
var socket = burro.wrap(network);

// send data
socket.write({message: "どもうありがとう！", from: "japan", to: "usa"});
socket.write({message: "thank you!", from: "usa", to: "japan"});

// dummy parser; extracts message from payload
var parser = new stream.Transform({objectMode: true});
parser._transform = function _transform (obj, encoding, done) {
  this.push(obj.from + " says: " + obj.message + "\n");
  done();
};

// cross the streams!
socket.pipe(parser).pipe(process.stdout);
```


Output

```
japan says: どもうありがとう！
usa says: thank you!
```


Installation
------------

Available via [npm][burro]:

> $ npm install burro

Or via git:

> $ git clone git://github.com/naomik/burro.git node_modules/burro


API
---

**wrap**

This is burro's easy mode. It will automatically construct the entire burro
chain around your existing duplex stream. If you want to configure the burro
chain manually, please see [lib/burro.js][lib]

```js
var socket = burro.wrap([duplexStream]);
```

Arguments

* _duplexStream_ - an object implementing the `stream.Duplex` API. It must have 
  the following functions defined: `_read`, `_write`, `pipe`, `unpipe`.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


Tests
-----

Burro is a pretty versatile beast and can even handle very large payloads. It is
also tested against network packet **fragmenting** and **buffering**, thanks to
[hiccup][hiccup]. See the [tests][tests] for more details.

Development dependencies: 

* [mocha][mocha]
* [hiccup][hiccup]

> $ npm install mocha

> $ npm install hiccup

[burro]: https://npmjs.org/package/burro
[lib]: https://github.com/naomik/burro/blob/master/lib/burro.js#L10-L14
[tests]: https://github.com/naomik/burro/tree/master/test
[mocha]: https://npmjs.org/package/mocha
[hiccup]: https://npmjs.org/package/hiccup
