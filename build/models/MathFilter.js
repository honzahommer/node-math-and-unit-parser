"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = evaluateExpression;

var _Token = require("./Token.js");

var _Token2 = _interopRequireDefault(_Token);

var _MathParser = require("../constants/MathParser.js");

var _Units = require("../constants/Units.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var PATTERN_SPACES = "(?:\\s+)";
var PATTERN_NUMBER = "((?:\\d*[.]?\\d+)(?:e[+\\-]?\\d+)";
// Create the operator pattern programatically from the list of accepted tokens.
var PATTERN_OPERATOR = Object.keys(_MathParser.TokenMap).reduce(function (result, item, index, array) {
  result += "(?:";

  // Escape regex operator characters.
  if (["(", ")", "\\", "^", "|", "*", "+", "?", ".", "$"].indexOf(item) > -1) result += "\\";
  result += item + ")";

  // Avoid an Unterminated Group error.
  if (item === "(") result += ")";

  // Add an 'or' if it is not the last item.
  if (index !== array.length - 1) result += "|";

  // e.g. (?:\\+)
  return result;
}, "");
var PATTERN_NUMBER_OR_OPERATOR = PATTERN_NUMBER + "?|" + PATTERN_OPERATOR;
var PATTERN_NUMBER_OR_OPERATOR_OR_SPACES = PATTERN_NUMBER + "?|" + PATTERN_OPERATOR + "|" + PATTERN_SPACES;
var PATTERN_FEET_AND_INCHES = "(?:([0-9]+)(?:'|ft))(?=(?:(?: +?)?(?:[0-9]+)(?:\"|in)?))";
var PATTERN_DEGREE_SYMBOL = "\xB0";
var PATTERN_STARTS_WITH_OPERATOR_FOR_CURRENT_VALUE = "^(\\+|\\+ |\\*|- |\\/|\\^)";

// Uses Edsger Dijkstra's "shunting-yard" algorithm to parse math expression.
// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
// Expects expression to be formatted with infix notation.
// Converts into postfix notation and evaluates in place.
function evaluateExpression(expression, currentValue) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$useDegrees = _ref.useDegrees,
      useDegrees = _ref$useDegrees === undefined ? true : _ref$useDegrees,
      _ref$unit = _ref.unit,
      unit = _ref$unit === undefined ? _Units.Unit.CENTIMETERS : _ref$unit,
      _ref$resolution = _ref.resolution,
      resolution = _ref$resolution === undefined ? 1 : _ref$resolution,
      _ref$delimiters = _ref.delimiters,
      delimiters = _ref$delimiters === undefined ? { decimal: ".", group: "," } : _ref$delimiters;

  var patternSpaces = new RegExp(PATTERN_SPACES, "g");
  var patternNumberOrOperator = new RegExp(PATTERN_NUMBER_OR_OPERATOR, "g");
  var patternNumberOrOperatorOrSpaces = new RegExp(PATTERN_NUMBER_OR_OPERATOR_OR_SPACES, "g");
  var patternFeetAndInches = new RegExp(PATTERN_FEET_AND_INCHES, "g");
  var patternDegreeSymbol = new RegExp(PATTERN_DEGREE_SYMBOL, "g");
  var patternStartsWithOperatorForCurrentValue = new RegExp(PATTERN_STARTS_WITH_OPERATOR_FOR_CURRENT_VALUE, "g");

  var indexOfCurrentValueOperator = expression.search(patternStartsWithOperatorForCurrentValue);

  if (indexOfCurrentValueOperator > -1 && currentValue) {
    expression = "" + currentValue + expression;
  }

  var groupReplacement = /(\b\d{1,3}),(?=\d{3}(\D|$))/g;
  // strange whitespace character for french thousands separator
  if (delimiters.group === " " || delimiters.group === " ") {
    groupReplacement = /(\b\d{1,3})\s(?=\d{3}(\D|$))/g;
  } else if (delimiters.group === ".") {
    groupReplacement = /(\b\d{1,3})\.(?=\d{3}(\D|$))/g;
  }

  var decimalReplacement = /(\b\d+)\.(?=\d+(\D|$))/g;
  if (delimiters.decimal === ",") {
    decimalReplacement = /(\b\d+),(?=\d+(\D|$))/g;
  } else if (delimiters.decimal === " ") {
    decimalReplacement = /(\b\d+)\s(?=\d+(\D|$))/g;
  }

  var input = expression.replace(groupReplacement, "$1");

  input = input.replace(decimalReplacement, "$1.");

  // Compress whitespace.
  input = input.replace(patternSpaces, " ");

  if (input.length === 0) {
    throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.EMPTY, input, 0, 0);
  }

  // Convert to lower case
  input = input.toLowerCase();

  // Change 90° to 90deg
  input = input.replace(patternDegreeSymbol, "deg");

  // Handle 5'6", 5'6, 5ft6in, 5ft6
  // Find all matches of ' or ft preceeded by a number and followed by a number
  var footMatches = void 0;
  var footIndices = [];
  while ((footMatches = patternFeetAndInches.exec(input)) !== null) {
    footIndices.push(patternFeetAndInches.lastIndex);
  }
  // Insert '+' after every foot index, increasing the index based on the number of previous insertions.
  for (var i = 0; i < footIndices.length; i++) {
    var footIndex = footIndices[i];
    input = input.slice(0, footIndex + i) + "+" + input.slice(footIndex + i);
  }

  var lastIndex = -1;
  // Verify input by matching against valid operators, numbers, or spaces.
  var matches = void 0;
  while ((matches = patternNumberOrOperatorOrSpaces.exec(input)) !== null) {
    if (lastIndex === patternNumberOrOperatorOrSpaces.lastIndex) {
      var position = patternNumberOrOperatorOrSpaces.lastIndex;
      throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.SYNTAX_ERROR, input, position, 0);
    }
    lastIndex = patternNumberOrOperatorOrSpaces.lastIndex;
  }

  if (lastIndex < 0) {
    throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.SYNTAX_ERROR, input, 0, 0);
  }

  if (lastIndex !== input.length) {
    throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.SYNTAX_ERROR, input, lastIndex, 0);
  }

  // Info about prior token to disambiguate unary vs binary operators.
  // If the token to the left is the edge of a statement (i.e. left paren, operator, or no token).
  var leftIsEdge = true;

  // Output value stack.
  var output = [];

  // Operator stack.
  var stack = [];
  var token = void 0;
  // Algorithm starts.
  while ((matches = patternNumberOrOperator.exec(input)) !== null) {
    token = new _Token2.default(matches[0], leftIsEdge);
    token.position = matches.index;

    var leftIsEdgeOperatorExceptions = [_MathParser.OperatorId.PAREN_R, _MathParser.OperatorId.PERCENTAGE, _MathParser.OperatorId.TIMES].concat(_toConsumableArray(Object.keys(_Units.Unit).map(function (k) {
      return _Units.Unit[k];
    })));

    leftIsEdge = token.type === _MathParser.TokenType.NONE || token.type === _MathParser.TokenType.OPERATOR && leftIsEdgeOperatorExceptions.indexOf(token.op.type) === -1;

    switch (token.type) {
      case _MathParser.TokenType.NUMBER:
        {
          output.push(token.value);
          break;
        }

      case _MathParser.TokenType.OPERATOR:
        {
          switch (token.op.type) {
            default:
              while (stack.length !== 0) {
                var t = stack[stack.length - 1];
                // assert(token.op.associativity !== Associativity.NONE);
                if (token.op.associativity === _MathParser.Associativity.LEFT && token.op.precedence <= t.op.precedence || token.op.associativity === _MathParser.Associativity.RIGHT && token.op.precedence < t.op.precedence) {
                  try {
                    stack[stack.length - 1].op.eval(output, { useDegrees: useDegrees, unit: unit, resolution: resolution }, currentValue);
                  } catch (err) {
                    err.input = input;
                    err.errorPosition = token.position;
                    err.errorLength = token.string.length;
                    throw err;
                  }
                  stack.pop();
                } else {
                  break;
                }
              }

              stack.push(token);
              break;

            case _MathParser.OperatorId.PAREN_L:
              stack.push(token);break;

            case _MathParser.OperatorId.PAREN_R:
              if (stack.length === 0) {
                throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.MISMATCHED_PARENS, input, token.position, token.string.length);
              }
              while (stack.length !== 0) {
                if (stack[stack.length - 1].op.type === _MathParser.OperatorId.PAREN_L) {
                  stack.pop();
                  break;
                } else {
                  try {
                    stack[stack.length - 1].op.eval(output, { useDegrees: useDegrees, unit: unit, resolution: resolution }, currentValue);
                  } catch (err) {
                    err.input = input;
                    err.errorPosition = token.position;
                    err.errorLength = token.string.length;
                    throw err;
                  }
                  stack.pop();
                }

                if (stack.length === 0) {
                  throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.MISMATCHED_PARENS, input, token.position, token.string.length);
                }
              }
              break;
          }
          break;
        }

      case _MathParser.TokenType.NONE:
        // Should not get here since tokens have already been verified via regular expression.
        throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.UNEXPECTED_TOKEN, input, token.position, token.string.length);
    }
  }
  while (stack.length !== 0) {
    var _token = stack[stack.length - 1];
    if (_token.op.type === _MathParser.OperatorId.PAREN_L || _token.op.type === _MathParser.OperatorId.PAREN_L) {
      throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.MISMATCHED_PARENS, input, _token.string.length);
    }
    try {
      _token.op.eval(output, { useDegrees: useDegrees, unit: unit, resolution: resolution }, currentValue);
    } catch (err) {
      err.input = input;
      err.errorPosition = _token.position;
      err.errorLength = _token.string.length;
      throw err;
    }
    stack.pop();
  }

  if (output.length === 0) {
    var _position = token ? token.position : 0;
    var length = token ? token.string.length : expression.length;
    throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.EMPTY, input, _position, length);
  } else if (output.length === 1) {
    return output[output.length - 1];
  } else {
    var _position2 = token ? token.position : -1;
    var _length = token ? token.string.length : -1;
    throw new _MathParser.ParsingError(_MathParser.ParsingErrorType.SYNTAX_ERROR, input, _position2, _length);
  }
}