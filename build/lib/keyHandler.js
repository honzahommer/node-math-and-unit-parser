"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** keyHandler: a handler for use with a Proxy, (eg, new Proxy({}, keyHandler);)
* This handler checks to see if a key exists in an object and throws an error if it
* does not.
*/

var keyHandler = {
  get: function get(target, name) {
    if (name in target) {
      return target[name];
    }
    throw new Error("No key named " + name + " in " + target);
  },
  has: function has(target, name) {
    return name in target;
  }
};

exports.default = keyHandler;