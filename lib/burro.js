var Encoder   = exports.Encoder   = require("./encoder"),
    Decoder   = exports.Decoder   = require("./decoder"),
    Framer    = exports.Framer    = require("./framer"),
    Unframer  = exports.Unframer  = require("./unframer");

var stream = require("stream");

var shim = function shim(streams) {
  var inner = new stream.Duplex({objectMode: true}),
      outer = new stream.Duplex({objectMode: true});

  inner.once("error", function onError(err) {
    outer.emit("error", err);
  });

  inner.once("finish", function onFinish() {
    outer.push(null);
  });

  inner.once("end", function onEnd() {
    outer.end();
  });

  outer.once("error", function onError(err) {
    inner.emit("error", err);
  });

  outer.once("finish", function onFinish() {
    inner.push(null);
  });

  outer.once("end", function onEnd() {
    inner.end();
  });

  inner._write = function _write(input, encoding, done) {
    if (outer.push(input)) {
      return done();
    } else {
      this.continue = done;
    }
  };

  inner._read = function _read(size) {
    if (outer.continue) {
      outer.continue();
      delete outer.continue;
    }
  };

  outer._write = function _write(input, encoding, done) {
    if (inner.push(input)) {
      return done();
    } else {
      this.continue = done;
    }
  };

  outer._read = function _read(size) {
    if (inner.continue) {
      inner.continue();
      delete inner.continue;
    }
  };

  var s = inner;
  streams.concat([inner]).forEach(function(other) {
    s = s.pipe(other);
  });

  return outer;
};

exports.wrap = function wrap(metal) {
  return shim([
    new Encoder(),
    new Framer(),
    metal,
    new Unframer(),
    new Decoder(),
  ]);
};
