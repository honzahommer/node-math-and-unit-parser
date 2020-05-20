"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConversionError = exports.EvaluationError = exports.ParsingError = exports.MathParserError = exports.TokenIdToOperatorMap = exports.TokenMap = exports.TokensMap = exports.UnaryOperatorFunctionMap = exports.OperatorMap = exports.TokenId = exports.TokenType = exports.OperatorId = exports.Associativity = exports.ErrorTypes = exports.ConversionErrorType = exports.EvaluationErrorType = exports.ParsingErrorType = undefined;

var _OperatorsMap, _UnaryOperatorFunctio, _TokenIdsToOperatorMa;

var _changeCase = require("change-case");

var _makeEnum = require("../lib/makeEnum.js");

var _makeEnum2 = _interopRequireDefault(_makeEnum);

var _Units = require("../constants/Units.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ParsingErrorType = exports.ParsingErrorType = (0, _makeEnum2.default)({
  EMPTY: null,
  MISMATCHED_PARENS: null,
  SYNTAX_ERROR: null
});

var EvaluationErrorType = exports.EvaluationErrorType = (0, _makeEnum2.default)({
  DIVIDE_BY_ZERO: null,
  EXPECTED_CURRENT_VALUE: null,
  EXPECTED_MORE_ARGUMENTS: null,
  IMAGINARY_NUMBER: null,
  UNEXPECTED_TOKEN: null
});

var ConversionErrorType = exports.ConversionErrorType = (0, _makeEnum2.default)({
  INCOMPATIBLE_MEASURES: null,
  EXPECTED_PIXELS_OR_INCHES_OR_CENTIMETERS: null,
  RESOLUTION_LESS_THAN_ONE: null,
  PIXELS_LESS_THAN_ONE: null
});

var ErrorTypes = exports.ErrorTypes = {
  ParsingErrorType: ParsingErrorType,
  EvaluationErrorType: EvaluationErrorType,
  ConversionErrorType: ConversionErrorType
};

var Associativity = exports.Associativity = (0, _makeEnum2.default)({
  NONE: null,
  LEFT: null,
  RIGHT: null
});

var OperatorIds = {
  NONE: null,
  ADD: null,
  COSINE: null,
  COSECANT: null,
  COTANGENT: null,
  DIVIDE: null,
  E: null,
  EXPONENT: null,
  MULTIPLY: null,
  PAREN_L: null,
  PAREN_R: null,
  PERCENTAGE: null,
  PI: null,
  SECANT: null,
  SINE: null,
  SUBTRACT: null,
  TANGENT: null,
  TAU: null,
  TIMES: null,
  UNARY_MINUS: null,
  UNARY_PLUS: null
};

var OperatorId = exports.OperatorId = (0, _makeEnum2.default)(Object.assign({}, OperatorIds, _Units.Unit));

var TokenType = exports.TokenType = (0, _makeEnum2.default)({
  NONE: null,
  NUMBER: null,
  OPERATOR: null
});

var TokenIds = {
  NONE: null,
  ASTERISK: null,
  CARET: null,
  COS: null,
  COT: null,
  CSC: null,
  E: null,
  MINUS: null,
  PAREN_L: null,
  PAREN_R: null,
  PERCENT: null,
  PI: null,
  PLUS: null,
  SEC: null,
  SIN: null,
  SLASH: null,
  TAN: null,
  TAU: null,
  X: null,
  PRIME: null,
  DOUBLE_PRIME: null
};

var UnitTokenIds = Object.keys(_Units.UnitMap).map(function (k) {
  return _Units.UnitMap[k];
}).reduce(function (result, item) {
  if (item.abbreviation) result[(0, _changeCase.constantCase)(item.abbreviation)] = null;
  return result;
}, {});

var TokenId = exports.TokenId = (0, _makeEnum2.default)(Object.assign({}, TokenIds, UnitTokenIds));

/* eslint key-spacing: 0 */
/* eslint no-multi-spaces: 0 */
var OperatorsMap = (_OperatorsMap = {}, _defineProperty(_OperatorsMap, OperatorId.PAREN_L, { associativity: Associativity.NONE, precedence: 0, degree: 0, name: "(" }), _defineProperty(_OperatorsMap, OperatorId.PAREN_R, { associativity: Associativity.NONE, precedence: 0, degree: 0, name: ")" }), _defineProperty(_OperatorsMap, OperatorId.ADD, { associativity: Associativity.LEFT, precedence: 10, degree: 2, name: "add" }), _defineProperty(_OperatorsMap, OperatorId.SUBTRACT, { associativity: Associativity.LEFT, precedence: 10, degree: 2, name: "sub" }), _defineProperty(_OperatorsMap, OperatorId.DIVIDE, { associativity: Associativity.LEFT, precedence: 20, degree: 2, name: "div" }), _defineProperty(_OperatorsMap, OperatorId.MULTIPLY, { associativity: Associativity.LEFT, precedence: 20, degree: 2, name: "mul" }), _defineProperty(_OperatorsMap, OperatorId.PERCENTAGE, { associativity: Associativity.LEFT, precedence: 30, degree: 1, name: "%" }), _defineProperty(_OperatorsMap, OperatorId.TIMES, { associativity: Associativity.LEFT, precedence: 30, degree: 1, name: "x" }), _defineProperty(_OperatorsMap, OperatorId.COSECANT, { associativity: Associativity.RIGHT, precedence: 40, degree: 1, name: "csc" }), _defineProperty(_OperatorsMap, OperatorId.COSINE, { associativity: Associativity.RIGHT, precedence: 40, degree: 1, name: "cos" }), _defineProperty(_OperatorsMap, OperatorId.COTANGENT, { associativity: Associativity.RIGHT, precedence: 40, degree: 1, name: "cot" }), _defineProperty(_OperatorsMap, OperatorId.SECANT, { associativity: Associativity.RIGHT, precedence: 40, degree: 1, name: "sec" }), _defineProperty(_OperatorsMap, OperatorId.SINE, { associativity: Associativity.RIGHT, precedence: 40, degree: 1, name: "sin" }), _defineProperty(_OperatorsMap, OperatorId.TANGENT, { associativity: Associativity.RIGHT, precedence: 40, degree: 1, name: "tan" }), _defineProperty(_OperatorsMap, OperatorId.EXPONENT, { associativity: Associativity.RIGHT, precedence: 90, degree: 2, name: "exp" }), _defineProperty(_OperatorsMap, OperatorId.UNARY_MINUS, { associativity: Associativity.RIGHT, precedence: 100, degree: 1, name: "neg" }), _defineProperty(_OperatorsMap, OperatorId.UNARY_PLUS, { associativity: Associativity.RIGHT, precedence: 100, degree: 1, name: "pos" }), _defineProperty(_OperatorsMap, OperatorId.E, { associativity: Associativity.LEFT, precedence: 200, degree: 0, name: "e" }), _defineProperty(_OperatorsMap, OperatorId.PI, { associativity: Associativity.LEFT, precedence: 200, degree: 0, name: "pi" }), _defineProperty(_OperatorsMap, OperatorId.TAU, { associativity: Associativity.LEFT, precedence: 200, degree: 0, name: "tau" }), _OperatorsMap);

var UnitOperatorsMap = Object.keys(_Units.Unit).reduce(function (result, key) {
  result[key] = { associativity: Associativity.LEFT, precedence: 30, degree: 1, name: _Units.UnitMap[key].abbreviation };
  return result;
}, {});

var OperatorMap = exports.OperatorMap = Object.assign({}, OperatorsMap, UnitOperatorsMap);

var UnaryOperatorFunctionMap = exports.UnaryOperatorFunctionMap = (_UnaryOperatorFunctio = {}, _defineProperty(_UnaryOperatorFunctio, OperatorId.COSECANT, function (x) {
  return 1 / Math.sin(x);
}), _defineProperty(_UnaryOperatorFunctio, OperatorId.COSINE, Math.cos), _defineProperty(_UnaryOperatorFunctio, OperatorId.COTANGENT, function (x) {
  return 1 / Math.tan(x);
}), _defineProperty(_UnaryOperatorFunctio, OperatorId.SECANT, function (x) {
  return 1 / Math.cos(x);
}), _defineProperty(_UnaryOperatorFunctio, OperatorId.SINE, Math.sin), _defineProperty(_UnaryOperatorFunctio, OperatorId.TANGENT, Math.tan), _UnaryOperatorFunctio);

var TokensMap = exports.TokensMap = {
  "'": TokenId.PRIME,
  '"': TokenId.DOUBLE_PRIME,
  "%": TokenId.PERCENT,
  "(": TokenId.PAREN_L,
  ")": TokenId.PAREN_R,
  "*": TokenId.ASTERISK,
  "+": TokenId.PLUS,
  "-": TokenId.MINUS,
  "/": TokenId.SLASH,
  "^": TokenId.CARET,
  "cos": TokenId.COS,
  "cot": TokenId.COT,
  "csc": TokenId.CSC,
  "e": TokenId.E,
  "pi": TokenId.PI,
  "sec": TokenId.SEC,
  "sin": TokenId.SIN,
  "tan": TokenId.TAN,
  "tau": TokenId.TAU,
  "x": TokenId.X
};

var UnitTokensMap = Object.keys(_Units.UnitMap).map(function (k) {
  return _Units.UnitMap[k];
}).reduce(function (result, item) {
  if (item.abbreviation) {
    result[item.abbreviation] = TokenId[(0, _changeCase.constantCase)(item.abbreviation)];
  }
  return result;
}, {});

var TokenMap = exports.TokenMap = Object.assign({}, TokensMap, UnitTokensMap);

// [1]: Check if leftIsEdge when creating operator to differentiate between unary and binary operators.
var TokenIdsToOperatorMap = (_TokenIdsToOperatorMa = {}, _defineProperty(_TokenIdsToOperatorMa, TokenId.ASTERISK, OperatorId.MULTIPLY), _defineProperty(_TokenIdsToOperatorMa, TokenId.CARET, OperatorId.EXPONENT), _defineProperty(_TokenIdsToOperatorMa, TokenId.CSC, OperatorId.COSECANT), _defineProperty(_TokenIdsToOperatorMa, TokenId.COS, OperatorId.COSINE), _defineProperty(_TokenIdsToOperatorMa, TokenId.COT, OperatorId.COTANGENT), _defineProperty(_TokenIdsToOperatorMa, TokenId.DOUBLE_PRIME, OperatorId.INCHES), _defineProperty(_TokenIdsToOperatorMa, TokenId.E, OperatorId.E), _defineProperty(_TokenIdsToOperatorMa, TokenId.NONE, OperatorId.NONE), _defineProperty(_TokenIdsToOperatorMa, TokenId.MINUS, OperatorId.SUBTRACT), _defineProperty(_TokenIdsToOperatorMa, TokenId.PAREN_L, OperatorId.PAREN_L), _defineProperty(_TokenIdsToOperatorMa, TokenId.PAREN_R, OperatorId.PAREN_R), _defineProperty(_TokenIdsToOperatorMa, TokenId.PRIME, OperatorId.FEET), _defineProperty(_TokenIdsToOperatorMa, TokenId.PERCENT, OperatorId.PERCENTAGE), _defineProperty(_TokenIdsToOperatorMa, TokenId.PI, OperatorId.PI), _defineProperty(_TokenIdsToOperatorMa, TokenId.PLUS, OperatorId.ADD), _defineProperty(_TokenIdsToOperatorMa, TokenId.SEC, OperatorId.SECANT), _defineProperty(_TokenIdsToOperatorMa, TokenId.SIN, OperatorId.SINE), _defineProperty(_TokenIdsToOperatorMa, TokenId.SLASH, OperatorId.DIVIDE), _defineProperty(_TokenIdsToOperatorMa, TokenId.TAN, OperatorId.TANGENT), _defineProperty(_TokenIdsToOperatorMa, TokenId.TAU, OperatorId.TAU), _defineProperty(_TokenIdsToOperatorMa, TokenId.X, OperatorId.TIMES), _TokenIdsToOperatorMa);

var UnitTokenIdToOperatorMap = Object.keys(_Units.Unit).reduce(function (result, key) {
  result[(0, _changeCase.constantCase)(_Units.UnitMap[key].abbreviation)] = key;
  return result;
}, {});

var TokenIdToOperatorMap = exports.TokenIdToOperatorMap = Object.assign({}, TokenIdsToOperatorMap, UnitTokenIdToOperatorMap);

var MathParserError = exports.MathParserError = function (_Error) {
  _inherits(MathParserError, _Error);

  function MathParserError(errorType, filteredExpression, errorPosition, errorLength) {
    _classCallCheck(this, MathParserError);

    var _this = _possibleConstructorReturn(this, (MathParserError.__proto__ || Object.getPrototypeOf(MathParserError)).call(this));

    _this.errorType = errorType;
    _this.filteredExpression = filteredExpression;
    _this.errorPosition = errorPosition;
    _this.errorLength = errorLength;
    return _this;
  }

  return MathParserError;
}(Error);

var ParsingError = exports.ParsingError = function (_MathParserError) {
  _inherits(ParsingError, _MathParserError);

  function ParsingError(errorType) {
    var filteredExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var errorPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var errorLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, ParsingError);

    return _possibleConstructorReturn(this, (ParsingError.__proto__ || Object.getPrototypeOf(ParsingError)).call(this, errorType, filteredExpression, errorPosition, errorLength));
  }

  return ParsingError;
}(MathParserError);

var EvaluationError = exports.EvaluationError = function (_MathParserError2) {
  _inherits(EvaluationError, _MathParserError2);

  function EvaluationError(errorType) {
    var filteredExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var errorPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var errorLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, EvaluationError);

    return _possibleConstructorReturn(this, (EvaluationError.__proto__ || Object.getPrototypeOf(EvaluationError)).call(this, errorType, filteredExpression, errorPosition, errorLength));
  }

  return EvaluationError;
}(MathParserError);

var ConversionError = exports.ConversionError = function (_MathParserError3) {
  _inherits(ConversionError, _MathParserError3);

  function ConversionError(errorType) {
    var filteredExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var errorPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var errorLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, ConversionError);

    return _possibleConstructorReturn(this, (ConversionError.__proto__ || Object.getPrototypeOf(ConversionError)).call(this, errorType, filteredExpression, errorPosition, errorLength));
  }

  return ConversionError;
}(MathParserError);