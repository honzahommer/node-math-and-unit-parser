"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MathParser = require("../constants/MathParser.js");

var _Units = require("../constants/Units.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function degToRad(deg) {
  return deg * Math.PI / 180;
}

var Unit = function Unit(unitId, system, measure, abbreviation, shorthand) {
  _classCallCheck(this, Unit);

  if (_Units.UnitMap.hasOwnProperty(unitId)) {
    this.unitId = unitId;
    var unitSettings = _Units.UnitMap[unitId];
    this.measure = unitSettings.measure;
    this.system = unitSettings.system;
    this.abbreviation = unitSettings.abbreviation;
    this.shorthand = unitSettings.shorthand;
  } else {
    this.unitId = unitId;
    this.measure = measure;
    this.system = system;
    this.abbreviation = abbreviation;
    this.shorthand = shorthand;
    this.name = name;
  }
  this.anchorConversionFactor = _Units.MeasureMap[this.measure][this.system][this.unitId];
};

var Operator = function () {
  function Operator() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _MathParser.OperatorId.NONE;
    var associativity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _MathParser.Associativity.NONE;
    var precedence = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
    var degree = arguments[3];
    var name = arguments[4];

    _classCallCheck(this, Operator);

    if (_MathParser.OperatorMap.hasOwnProperty(type)) {
      var operatorSettings = _MathParser.OperatorMap[type];
      this.associativity = operatorSettings.associativity;
      this.type = type;
      this.precedence = operatorSettings.precedence;
      this.degree = operatorSettings.degree;
      this.name = operatorSettings.name;
    } else {
      this.associativity = associativity;
      this.type = type;
      this.precedence = precedence;
      this.degree = degree;
      this.name = name;
    }
  }

  _createClass(Operator, [{
    key: "eval",
    value: function _eval() {
      var values = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var config = arguments[1];
      var currentValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NaN;

      // Check if we have enough arguments for the operator type.
      if (values.length < this.degree) {
        throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.EXPECTED_MORE_ARGUMENTS);
      }

      switch (this.type) {
        case _MathParser.OperatorId.NONE:
        case _MathParser.OperatorId.PAREN_L:
        case _MathParser.OperatorId.PAREN_R:
          throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.UNEXPECTED_TOKEN);

        // Handle constants.
        case _MathParser.OperatorId.E:
          values.push(Math.E);
          break;
        case _MathParser.OperatorId.PI:
          values.push(Math.PI);
          break;
        case _MathParser.OperatorId.TAU:
          values.push(2 * Math.PI);
          break;

        case _MathParser.OperatorId.INCHES:
        case _MathParser.OperatorId.FEET:
        case _MathParser.OperatorId.YARDS:
        case _MathParser.OperatorId.MILES:
        case _MathParser.OperatorId.PICOMETERS:
        case _MathParser.OperatorId.NANOMETERS:
        case _MathParser.OperatorId.MICROMETERS:
        case _MathParser.OperatorId.MILLIMETERS:
        case _MathParser.OperatorId.CENTIMETERS:
        case _MathParser.OperatorId.DECIMETERS:
        case _MathParser.OperatorId.METERS:
        case _MathParser.OperatorId.DEKAMETERS:
        case _MathParser.OperatorId.HECTOMETERS:
        case _MathParser.OperatorId.KILOMETERS:
        case _MathParser.OperatorId.PIXELS:
        case _MathParser.OperatorId.DEGREES:
        case _MathParser.OperatorId.RADIANS:
        case _MathParser.OperatorId.COSECANT:
        case _MathParser.OperatorId.COSINE:
        case _MathParser.OperatorId.COTANGENT:
        case _MathParser.OperatorId.PERCENTAGE:
        case _MathParser.OperatorId.SECANT:
        case _MathParser.OperatorId.SINE:
        case _MathParser.OperatorId.TANGENT:
        case _MathParser.OperatorId.TIMES:
        case _MathParser.OperatorId.UNARY_MINUS:
        case _MathParser.OperatorId.UNARY_PLUS:
          {
            // Handle unary operators.
            var value = values[values.length - 1];
            values.pop();
            switch (this.type) {
              default:
                throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.UNEXPECTED_TOKEN);

              case _MathParser.OperatorId.INCHES:
              case _MathParser.OperatorId.FEET:
              case _MathParser.OperatorId.YARDS:
              case _MathParser.OperatorId.MILES:
              case _MathParser.OperatorId.PICOMETERS:
              case _MathParser.OperatorId.NANOMETERS:
              case _MathParser.OperatorId.MICROMETERS:
              case _MathParser.OperatorId.MILLIMETERS:
              case _MathParser.OperatorId.CENTIMETERS:
              case _MathParser.OperatorId.DECIMETERS:
              case _MathParser.OperatorId.METERS:
              case _MathParser.OperatorId.DEKAMETERS:
              case _MathParser.OperatorId.HECTOMETERS:
              case _MathParser.OperatorId.KILOMETERS:
              case _MathParser.OperatorId.PIXELS:
              case _MathParser.OperatorId.DEGREES:
              case _MathParser.OperatorId.RADIANS:
                value = this.convert(value, new Unit(_Units.Unit[this.type]), new Unit(config.unit), config.resolution);
                break;

              case _MathParser.OperatorId.COSECANT:
              case _MathParser.OperatorId.COSINE:
              case _MathParser.OperatorId.COTANGENT:
              case _MathParser.OperatorId.SECANT:
              case _MathParser.OperatorId.SINE:
              case _MathParser.OperatorId.TANGENT:
                {
                  var trigFunction = _MathParser.UnaryOperatorFunctionMap[this.type];
                  value = config.useDegrees ? trigFunction(degToRad(value)) : trigFunction(value);
                  break;
                }

              case _MathParser.OperatorId.PERCENTAGE:
                if (Number.isNaN(currentValue)) {
                  throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.EXPECTED_CURRENT_VALUE);
                }
                value = value * currentValue / 100.0;
                break;

              case _MathParser.OperatorId.TIMES:
                if (Number.isNaN(currentValue)) {
                  throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.EXPECTED_CURRENT_VALUE);
                }
                value = value * currentValue;
                break;

              case _MathParser.OperatorId.UNARY_MINUS:
                value *= -1.0;
                break;
              case _MathParser.OperatorId.UNARY_PLUS:
                // no-op
                break;
            }
            values.push(value);
            break;
          }

        case _MathParser.OperatorId.ADD:
        case _MathParser.OperatorId.DIVIDE:
        case _MathParser.OperatorId.EXPONENT:
        case _MathParser.OperatorId.MULTIPLY:
        case _MathParser.OperatorId.SUBTRACT:
          {
            // Handle binary operators.
            var b = values.pop();

            var a = values.pop();
            switch (this.type) {
              default:
                throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.UNEXPECTED_TOKEN);
              case _MathParser.OperatorId.ADD:
                values.push(a + b);
                break;
              case _MathParser.OperatorId.SUBTRACT:
                values.push(a - b);
                break;
              case _MathParser.OperatorId.DIVIDE:
                if (b === 0.0) {
                  throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.DIVIDE_BY_ZERO);
                }
                values.push(a / b);
                break;
              case _MathParser.OperatorId.MULTIPLY:
                values.push(a * b);
                break;
              case _MathParser.OperatorId.EXPONENT:
                {
                  var d = void 0;
                  if (a < 0 && b % 1 > 0) {
                    throw new _MathParser.EvaluationError(_MathParser.EvaluationErrorType.IMAGINARY_NUMBER);
                  } else {
                    values.push(Math.pow(a, b));
                  }
                  break;
                }
            }
          }
      }
    }
  }, {
    key: "round",
    value: function round(v, decimalPlaces) {
      if (decimalPlaces === undefined) {
        decimalPlaces = 0;
      }

      var multiplicator = Math.pow(10, decimalPlaces);
      v = parseFloat((v * multiplicator).toFixed(11));
      return Math.round(v) / multiplicator;
    }
  }, {
    key: "convert",
    value: function convert(value, from, to) {
      var resolution = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      if (resolution < 1) {
        throw new _MathParser.ConversionError(_MathParser.ConversionErrorType.RESOLUTION_LESS_THAN_ONE);
      }
      // If the base unit and desitination unit are the same, just return the value.
      if (from === to || from.unitId === to.unitId) {
        return value;
      }

      if (to.unitId === "PIXELS") {
        // resolution assumed to be in pixels per inch
        if (from.unitId === "INCHES") {
          var v = this.round(value * resolution, 4);
          if (v < 1) {
            throw new _MathParser.ConversionError(_MathParser.ConversionErrorType.PIXELS_LESS_THAN_ONE);
          }
          return v;
        } else if (from.unitId === "CENTIMETERS") {
          var _v = this.round(value / 2.54 * resolution, 4);
          if (_v < 1) {
            throw new _MathParser.ConversionError(_MathParser.ConversionErrorType.PIXELS_LESS_THAN_ONE);
          }
          return _v;
        } else {
          throw new _MathParser.ConversionError(_MathParser.ConversionErrorType.EXPECTED_PIXELS_OR_INCHES_OR_CENTIMETERS);
        }
      }

      if (from.unitId === "PIXELS" && (to.unitId === "INCHES" || to.unitId === "CENTIMETERS")) {
        if (value < 1) {
          throw new _MathParser.ConversionError(_MathParser.ConversionErrorType.PIXELS_LESS_THAN_ONE);
        }
        // resolution assumed to be in pixels per inch
        if (to.unitId === "INCHES") {
          return this.round(value / resolution, 4);
        } else {
          return this.round(value * 2.54 / resolution, 4);
        }
      }

      if (from.measure !== to.measure) {
        throw new _MathParser.ConversionError(_MathParser.ConversionErrorType.INCOMPATIBLE_MEASURES);
      }

      // Convert to system anchor unit
      value = value * from.anchorConversionFactor;

      // Convert from one system to another by multiplying by the conversion factor.
      if (from.system !== to.system) {
        value *= _Units.MeasureMap[from.measure].anchors[from.system].conversion;
      }

      return value / to.anchorConversionFactor;
    }
  }]);

  return Operator;
}();

exports.default = Operator;