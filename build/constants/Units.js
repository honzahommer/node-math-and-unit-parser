"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnitMap = exports.MeasureMap = exports.Measure = exports.System = exports.Unit = undefined;

var _anchors, _Measure$ANGLE, _System$METRIC, _System$IMPERIAL, _anchors2, _Measure$LENGTH, _Measure$SCALAR, _Measure$SCREEN, _MeasureMap, _UnitMap;

var _makeEnum = require("../lib/makeEnum.js");

var _makeEnum2 = _interopRequireDefault(_makeEnum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Unit = exports.Unit = (0, _makeEnum2.default)({
  // Length
  // Imperial
  INCHES: null,
  FEET: null,
  YARDS: null,
  MILES: null,
  // Metric
  PICOMETERS: null,
  NANOMETERS: null,
  MICROMETERS: null,
  MILLIMETERS: null,
  CENTIMETERS: null,
  DECIMETERS: null,
  METERS: null,
  DEKAMETERS: null,
  HECTOMETERS: null,
  KILOMETERS: null,

  // Screen
  PIXELS: null,

  // Angle
  DEGREES: null,
  RADIANS: null,

  NONE: null
});

var System = exports.System = (0, _makeEnum2.default)({
  IMPERIAL: null,
  METRIC: null,

  SI: null,
  NON_SI: null,

  NONE: null
});

var Measure = exports.Measure = (0, _makeEnum2.default)({
  ANGLE: null,
  LENGTH: null,
  SCALAR: null,
  SCREEN: null
});

var MeasureMap = exports.MeasureMap = (_MeasureMap = {}, _defineProperty(_MeasureMap, Measure.ANGLE, (_Measure$ANGLE = {}, _defineProperty(_Measure$ANGLE, System.SI, _defineProperty({}, Unit.RADIANS, 1)), _defineProperty(_Measure$ANGLE, System.NON_SI, _defineProperty({}, Unit.DEGREES, 1)), _defineProperty(_Measure$ANGLE, "anchors", (_anchors = {}, _defineProperty(_anchors, System.SI, {
  unit: Unit.RADIANS,
  conversion: 180 / Math.PI
}), _defineProperty(_anchors, System.NON_SI, {
  unit: Unit.DEGREES,
  conversion: Math.PI / 180
}), _anchors)), _Measure$ANGLE)), _defineProperty(_MeasureMap, Measure.LENGTH, (_Measure$LENGTH = {}, _defineProperty(_Measure$LENGTH, System.METRIC, (_System$METRIC = {}, _defineProperty(_System$METRIC, Unit.PICOMETERS, 1 / 1e-12), _defineProperty(_System$METRIC, Unit.NANOMETERS, 1 / 1e-9), _defineProperty(_System$METRIC, Unit.MICROMETERS, 1 / 1e-6), _defineProperty(_System$METRIC, Unit.MILLIMETERS, 1 / 1000), _defineProperty(_System$METRIC, Unit.CENTIMETERS, 1 / 100), _defineProperty(_System$METRIC, Unit.DECIMETERS, 1 / 10), _defineProperty(_System$METRIC, Unit.METERS, 1), _defineProperty(_System$METRIC, Unit.DEKAMETERS, 10), _defineProperty(_System$METRIC, Unit.HECTOMETERS, 100), _defineProperty(_System$METRIC, Unit.KILOMETERS, 1000), _System$METRIC)), _defineProperty(_Measure$LENGTH, System.IMPERIAL, (_System$IMPERIAL = {}, _defineProperty(_System$IMPERIAL, Unit.INCHES, 1 / 12), _defineProperty(_System$IMPERIAL, Unit.FEET, 1), _defineProperty(_System$IMPERIAL, Unit.YARDS, 3), _defineProperty(_System$IMPERIAL, Unit.MILES, 5280), _System$IMPERIAL)), _defineProperty(_Measure$LENGTH, "anchors", (_anchors2 = {}, _defineProperty(_anchors2, System.METRIC, {
  unit: Unit.METERS,
  conversion: 3.28084
}), _defineProperty(_anchors2, System.IMPERIAL, {
  unit: Unit.FEET,
  conversion: 1 / 3.28084
}), _anchors2)), _Measure$LENGTH)), _defineProperty(_MeasureMap, Measure.SCALAR, (_Measure$SCALAR = {}, _defineProperty(_Measure$SCALAR, System.NONE, _defineProperty({}, Unit.NONE, 1)), _defineProperty(_Measure$SCALAR, "anchors", _defineProperty({}, System.NONE, {
  unit: Unit.NONE,
  conversion: 1
})), _Measure$SCALAR)), _defineProperty(_MeasureMap, Measure.SCREEN, (_Measure$SCREEN = {}, _defineProperty(_Measure$SCREEN, System.NONE, _defineProperty({}, Unit.PIXELS, 1)), _defineProperty(_Measure$SCREEN, "anchors", _defineProperty({}, System.NONE, {
  unit: Unit.PIXELS,
  conversion: 1
})), _Measure$SCREEN)), _MeasureMap);

var UnitMap = exports.UnitMap = (_UnitMap = {}, _defineProperty(_UnitMap, Unit.INCHES, { measure: Measure.LENGTH, system: System.IMPERIAL, abbreviation: "in", shorthand: '"' }), _defineProperty(_UnitMap, Unit.FEET, { measure: Measure.LENGTH, system: System.IMPERIAL, abbreviation: "ft", shorthand: "'" }), _defineProperty(_UnitMap, Unit.YARDS, { measure: Measure.LENGTH, system: System.IMPERIAL, abbreviation: "yd" }), _defineProperty(_UnitMap, Unit.MILES, { measure: Measure.LENGTH, system: System.IMPERIAL, abbreviation: "mi" }), _defineProperty(_UnitMap, Unit.PICOMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "pm" }), _defineProperty(_UnitMap, Unit.NANOMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "nm" }), _defineProperty(_UnitMap, Unit.MICROMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "um" }), _defineProperty(_UnitMap, Unit.MILLIMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "mm" }), _defineProperty(_UnitMap, Unit.CENTIMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "cm" }), _defineProperty(_UnitMap, Unit.DECIMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "dm" }), _defineProperty(_UnitMap, Unit.METERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "m" }), _defineProperty(_UnitMap, Unit.DEKAMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "dam" }), _defineProperty(_UnitMap, Unit.HECTOMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "hm" }), _defineProperty(_UnitMap, Unit.KILOMETERS, { measure: Measure.LENGTH, system: System.METRIC, abbreviation: "km" }), _defineProperty(_UnitMap, Unit.PIXELS, { measure: Measure.SCREEN, system: System.NONE, abbreviation: "px" }), _defineProperty(_UnitMap, Unit.DEGREES, { measure: Measure.ANGLE, system: System.NON_SI, abbreviation: "deg" }), _defineProperty(_UnitMap, Unit.RADIANS, { measure: Measure.ANGLE, system: System.SI, abbreviation: "rad" }), _defineProperty(_UnitMap, Unit.NONE, { measure: Measure.SCALAR, system: System.NONE, abbreviation: undefined }), _UnitMap);