#!/usr/bin/env node

var burro  = require("./lib/burro"),
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

// output
// japan says: どもうありがとう！
// usa says: thank you!
