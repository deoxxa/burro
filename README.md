Burro
=====

Burro is a useful creature that auto-packages objects in length-prefixed JSON byte streams.

Example
-------

```js
var burro  = require("burro"),
    stream = require("stream");

// dummy i/o
var dummy = new stream.PassThrough();
    
// wrap! auto encode/decode json frames
var socket = burro.wrap(dummy);

// send data
socket.write({message: "どもうありがとう！", from: "japan", to: "usa"});
socket.write({message: "thank you!", from: "usa", to: "japan"});

// dummy parser; extracts message from payload
var parser = new stream.Transform({objectMode: true});
parser._transform = function _transform (obj, encoding, done) {
  var str = obj.from + " says: " + obj.message + "\n";
  this.push(str);
  done();
};

// cross the streams!
socket.pipe(parser).pipe(process.stdout);
```


Output
------

```
japan says: どもうありがとう！
usa says: thank you!
```


Tests
-----

requires: `npm install mocha`

Burro is a pretty versatile beast and can even handle very large payloads.
See the [tests][1] for more details.

[1]: https://github.com/naomik/burro/tree/master/test
