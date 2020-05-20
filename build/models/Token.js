"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MathParser = require("../constants/MathParser.js");

var _Operator = require("../models/Operator.js");

var _Operator2 = _interopRequireDefault(_Operator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = function () {
  function Token() {
    var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var leftIsEdge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Token);

    this.string = string;
    this.id = this.stringToId(string);
    this.type = this.id === _MathParser.TokenId.NONE ? _MathParser.TokenType.NUMBER : _MathParser.TokenType.OPERATOR;
    this.op = this.idToOperator(this.id, leftIsEdge);
    this.position = -1;
    this.value = NaN;
    if (this.type === _MathParser.TokenType.NUMBER) this.value = +this.string;
  }

  _createClass(Token, [{
    key: "stringToId",
    value: function stringToId(string) {
      if (_MathParser.TokenMap.hasOwnProperty(string)) {
        return _MathParser.TokenMap[string];
      }
      return _MathParser.TokenId.NONE;
    }

    /* eslint no-multi-spaces: 0 */

  }, {
    key: "idToOperator",
    value: function idToOperator(id) {
      var leftIsEdge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var type = void 0;
      if (id === _MathParser.TokenId.MINUS && leftIsEdge) {
        type = _MathParser.OperatorId.UNARY_MINUS;
      } else if (id === _MathParser.TokenId.PLUS && leftIsEdge) {
        type = _MathParser.OperatorId.UNARY_PLUS;
      } else {
        type = _MathParser.TokenIdToOperatorMap[id];
      }
      return new _Operator2.default(type);
    }
  }]);

  return Token;
}();

exports.default = Token;