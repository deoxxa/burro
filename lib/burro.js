var Upstream      = require("./upstream"),
    Downstream    = require("./downstream");

var Burro = module.exports = function Burro() {
  this.packets = [];
};

Burro.prototype.send = function send() {
  return new Upstream();
};

Burro.prototype.receive = function receive(upstream) {
  var downstream = new Downstream();
  upstream.pipe(downstream);
  return downstream;
};
