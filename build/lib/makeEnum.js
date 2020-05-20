"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = makeEnum;

var _keyHandler = require("./keyHandler.js");

var _keyHandler2 = _interopRequireDefault(_keyHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EnumDefinition = function () {
  function EnumDefinition(description) {
    var _this = this;

    _classCallCheck(this, EnumDefinition);

    var values = {};
    Object.keys(description).forEach(function (name) {
      var value = description[name];
      if (value === null) value = name;
      if (values[value] !== undefined) throw new Error("Duplicate key " + value);
      if (_this.hasOwnProperty(name)) throw new Error("Illegal enum name " + name);
      values[value] = true;
      _this[name] = value;
    });
  }

  _createClass(EnumDefinition, [{
    key: "toString",
    value: function toString(value) {
      var _this2 = this;

      var result = Object.keys(this).find(function (k) {
        return _this2[k] === value;
      });
      if (result === undefined) throw new Error("Value is not a valid part of this enum");
      return result;
    }
  }]);

  return EnumDefinition;
}();

function makeEnum(description) {
  var enumInstance = new Proxy(new EnumDefinition(description), _keyHandler2.default);
  return enumInstance;
}