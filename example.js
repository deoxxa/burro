#!/usr/bin/env node

var burro  = require("./lib/burro"),
    stream = require("stream");

// dummy socket
var socket = new stream.PassThrough();
    
// wrap! auto encode/decode json frames
var gladOS = burro.wrap(socket);

// dummy parser; extracts message from payload
var parser = new stream.Transform();
parser._transform = function _transform (obj, output, done) {
  output(new Buffer(obj.from + " says: " + obj.message + "\n"));
  done();
};

// cross the streams!
gladOS.pipe(parser).pipe(process.stdout);

// send data
gladOS.write({message: "どもうありがとう！", from: "japan", to: "usa"});
gladOS.write({message: "thank you!", from: "usa", to: "japan"});

// output
// japan says: どもうありがとう！
// usa says: thank you!
