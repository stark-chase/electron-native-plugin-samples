const native = require("bindings")("greeting.node");

module.exports.greeting = function() {
    return native.GetGreetingMessage();
}