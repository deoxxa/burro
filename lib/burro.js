var Encoder   = exports.Encoder   = require("./encoder"),
    Decoder   = exports.Decoder   = require("./decoder"),
    Framer    = exports.Framer    = require("./framer"),
    Unframer  = exports.Unframer  = require("./unframer");

var bun = require("bun");
exports.wrap = function wrap(metal) {
  return bun([
    new Encoder(),
    new Framer(),
    metal,
    new Unframer(),
    new Decoder(),
  ]);
};
