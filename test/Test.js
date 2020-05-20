const { Status, ParsingErrorType, EvaluationErrorType, ConversionErrorType } = require("../build/constants/MathParser.js");
const { Unit } = require("../build/constants/Units.js");
const evaluateExpression = require("../build/models/MathFilter.js").default;
const assert = require("assert");

describe.only("MathFilter", () => {

  class TestCaseError extends Error {
    constructor(type, expected, actual) {
      super(type + " expected: " + expected + " actual: " + actual);
    }
  }

  class TestCase {
    constructor(expression, errorType, errorPosition, errorLength, currentValue, config = {useDegrees: true}, result) {
      this.expression = expression;
      this.currentValue = currentValue;
      this.config = config;
      this.result = result;
      this.errorType = errorType;
      this.errorPosition = errorPosition;
      this.errorLength = errorLength;
      this.description = `${expression} returns `;
    }
  }

  class SuccessfulTestCase extends TestCase {
    constructor(expression, result, currentValue, config) {
      super(expression, undefined, -1, -1, currentValue, config, result);
      this.description += `${result}`;
      if (currentValue) {
        this.description += ` when currentValue is: ${currentValue}`;
      }
      if (config) {
        this.description += ` and config: ${JSON.stringify(config)}`;
      }
    }

    test() {
      const result = evaluateExpression(this.expression, this.currentValue, this.config);
      assert.equal(result, this.result);
    }
  }

  class ErrorTestCase extends TestCase {
    constructor(expression, errorType, errorPosition, errorLength, currentValue, config) {
      super(expression, errorType, errorPosition, errorLength, currentValue, config);
      this.description += `${errorType} at position: ${errorPosition} with length: ${errorLength}`;
    }

    test() {
      assert.throws(() => {
        evaluateExpression(this.expression, this.currentValue, this.config);
      },
        (err) => {
          if (err.errorType !== this.errorType) {
            throw new TestCaseError("errorType", this.errorType, err.errorType);
          }
          // TODO(Alex): Make the error position and length more accurate.
          // if (err.errorPosition !== this.errorPosition) {
          //   throw new TestCaseError("errorPosition", this.errorPosition, err.errorPosition);
          // }
          // if (err.errorLength !== this.errorLength) {
          //   throw new TestCaseError("errorLength", this.errorLength, err.errorLength);
          // }
          return true;
        }
      );
    }
  }

  before(()=> {
    // runs once
  });

  const testCases = [
    new ErrorTestCase("", ParsingErrorType.EMPTY, 0, 0),
    new ErrorTestCase(" \f\n\r\t\v", ParsingErrorType.EMPTY, 0, 6),
    new ErrorTestCase("()", ParsingErrorType.EMPTY, 1, 1),
    new ErrorTestCase("1(1+", ParsingErrorType.MISMATCHED_PARENS, 1, 1),
    new ErrorTestCase("((1)", ParsingErrorType.MISMATCHED_PARENS, 1, 1),
    new ErrorTestCase("(1))", ParsingErrorType.MISMATCHED_PARENS, 3, 1),
    new ErrorTestCase("1 + (2 - (3 * (4 / (5)))))", ParsingErrorType.MISMATCHED_PARENS, 25, 1),
    new ErrorTestCase("(1)1", ParsingErrorType.SYNTAX_ERROR, 3, 1),
    new ErrorTestCase("1a", ParsingErrorType.SYNTAX_ERROR, 1, 0),
    new ErrorTestCase("abc", ParsingErrorType.SYNTAX_ERROR, 0, 0),
    new ErrorTestCase("a + b * c", ParsingErrorType.SYNTAX_ERROR, 0, 0),
    new ErrorTestCase("1 2 3", ParsingErrorType.SYNTAX_ERROR, 1, 1),
    new ErrorTestCase("12.", ParsingErrorType.SYNTAX_ERROR, 2, 0),
    new ErrorTestCase("1 + 2 # 3", ParsingErrorType.SYNTAX_ERROR, 6, 1),
    new ErrorTestCase("1 / (1 - 1)", EvaluationErrorType.DIVIDE_BY_ZERO, 2, 1),
    new ErrorTestCase("50%", EvaluationErrorType.EXPECTED_CURRENT_VALUE, 2, 1),
    new ErrorTestCase("+", EvaluationErrorType.EXPECTED_MORE_ARGUMENTS, 0, 1),
    new ErrorTestCase("1 *", EvaluationErrorType.EXPECTED_MORE_ARGUMENTS, 2, 1),
    new ErrorTestCase("(1 + ) + 1", EvaluationErrorType.EXPECTED_MORE_ARGUMENTS, 5, 1),
    new ErrorTestCase("-", EvaluationErrorType.EXPECTED_MORE_ARGUMENTS, 0, 1),
    new ErrorTestCase("--", EvaluationErrorType.EXPECTED_MORE_ARGUMENTS, 1, 1),
    new ErrorTestCase("-1 ^ 2 ^ 3.4", EvaluationErrorType.IMAGINARY_NUMBER, 3, 1),
    new SuccessfulTestCase("1", 1),
    new SuccessfulTestCase("123", 123),
    new SuccessfulTestCase("1.23", 1.23),
    new SuccessfulTestCase(".12", 0.12),
    new SuccessfulTestCase("1e2", 100),
    new SuccessfulTestCase("1e+2 + 3", 103),
    new SuccessfulTestCase("1e-2 - 3", -2.99),
    new SuccessfulTestCase("+1", 1),
    new SuccessfulTestCase("++1", 1),
    new SuccessfulTestCase("+++1", 1),
    new SuccessfulTestCase("-1", -1),
    new SuccessfulTestCase("--1", 1),
    new SuccessfulTestCase("---1", -1),
    new SuccessfulTestCase("((1))", 1),
    new SuccessfulTestCase("1 + 2", 3),
    new SuccessfulTestCase("1 + (2)", 3),
    new SuccessfulTestCase("(1) + 2", 3),
    new SuccessfulTestCase("+(1 + 2)", 3),
    new SuccessfulTestCase("-(1 - 2)", 1),
    new SuccessfulTestCase("1 + 2 * 3", 7),
    new SuccessfulTestCase("1 + (2 * 3)", 7),
    new SuccessfulTestCase("(1 + 2) * 3", 9),
    new SuccessfulTestCase("1 ^ 2", 1),
    new SuccessfulTestCase("-1 ^ 2", 1),
    new SuccessfulTestCase("(-1) ^ 2", 1),
    new SuccessfulTestCase("-(1 ^ 2)", -1),
    new SuccessfulTestCase("4 ^ -2", 0.0625),
    new SuccessfulTestCase("(-4 ^ 2)", 16),
    new SuccessfulTestCase("2 * 2 ^ 3", 16),
    new SuccessfulTestCase("2 * (2 ^ 3)", 16),
    new SuccessfulTestCase("(2 * 2) ^ 3", 64),
    new SuccessfulTestCase("2 ^ 2 ^ 3", 256),
    new SuccessfulTestCase("2 ^ (2 ^ 3)", 256),
    new SuccessfulTestCase("(2 ^ 2) ^ 3", 64),
    new SuccessfulTestCase("1 + .2 * -3 / +4 ^ 5", 0.9994140625),
    new SuccessfulTestCase("+-+-1++--++--++--+2-3+4", 4),
    new SuccessfulTestCase("50%", 7, 14),
    new SuccessfulTestCase("%50", 7, 14),
    new SuccessfulTestCase("50%-1", 6, 14),
    new SuccessfulTestCase("25%*2", 8, 16),
    new SuccessfulTestCase("2x", 6, 3),
    new SuccessfulTestCase("x2", 6, 3),
    new SuccessfulTestCase("3X", 12, 4),
    new SuccessfulTestCase("2x-1", 7, 4),
    new SuccessfulTestCase("2x*3", 6, 1),
    new SuccessfulTestCase("/2", 3, 6),
    new SuccessfulTestCase("*2", 12, 6),
    new SuccessfulTestCase("+2", 8, 6),
    new SuccessfulTestCase("+ 2", 8, 6),
    new SuccessfulTestCase("-2", -2, 6),
    new SuccessfulTestCase("- 2", 4, 6),
    new SuccessfulTestCase("^2", 36, 6),
    new SuccessfulTestCase("E", Math.E),
    new SuccessfulTestCase("e", Math.E),
    new SuccessfulTestCase("pi", Math.PI),
    new SuccessfulTestCase("Pi", Math.PI),
    new SuccessfulTestCase("PI", Math.PI),
    new SuccessfulTestCase("tau", 2 * Math.PI),
    new SuccessfulTestCase("Tau", 2 * Math.PI),
    new SuccessfulTestCase("TAU", 2 * Math.PI),
    new SuccessfulTestCase("cos 180", Math.cos(Math.PI)),
    new SuccessfulTestCase("cos(TAU)", Math.cos(2 * Math.PI), undefined, {useDegrees: false}),
    new SuccessfulTestCase("sin90.0", Math.sin(Math.PI / 2)),
    new SuccessfulTestCase("50*sin45", 50 * Math.sin(Math.PI / 4)),
    new SuccessfulTestCase("sin(pi / 2)", Math.sin(Math.PI / 2), undefined, {useDegrees: false}),
    new SuccessfulTestCase("tan45", Math.tan(Math.PI / 4)),
    new SuccessfulTestCase("tan(e)", Math.tan(Math.E), undefined, {useDegrees: false}),
    new SuccessfulTestCase("tan(e)/10", Math.tan(Math.E) / 10, undefined, {useDegrees: false}),
    new SuccessfulTestCase("10mm", 1, undefined, {unit: Unit.CENTIMETERS}),
    new SuccessfulTestCase("10mm+2", 3, undefined, {unit: Unit.CENTIMETERS}),
    new SuccessfulTestCase("7m", 700, undefined, {unit: Unit.CENTIMETERS}),
    new SuccessfulTestCase("3cm", 3, undefined, {unit: Unit.CENTIMETERS}),
    new SuccessfulTestCase("3cm*3", 9, undefined, {unit: Unit.CENTIMETERS}),
    new SuccessfulTestCase("3cm+3cm", 6, undefined, {unit: Unit.CENTIMETERS}),
    new SuccessfulTestCase("1mm", 0.1, undefined, {unit: Unit.CENTIMETERS}),
    new SuccessfulTestCase("10mm", 0.01, undefined, {unit: Unit.METERS}),
    new SuccessfulTestCase("7m", 7, undefined, {unit: Unit.METERS}),
    new SuccessfulTestCase("3cm", 0.03, undefined, {unit: Unit.METERS}),
    new SuccessfulTestCase("1mm", 0.001, undefined, {unit: Unit.METERS}),
    new SuccessfulTestCase("1km", 1000, undefined, {unit: Unit.METERS}),
    new SuccessfulTestCase("1ft", 12, undefined, {unit: Unit.INCHES}),
    new SuccessfulTestCase("3.5ft", 3.5 * 12, undefined, {unit: Unit.INCHES}),
    new SuccessfulTestCase("2'", 24, undefined, {unit: Unit.INCHES}),
    new SuccessfulTestCase(`2'+6"`, 30, undefined, {unit: Unit.INCHES}),
    new SuccessfulTestCase("12in", 1, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase("1yd", 3, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase("1mi", 5280, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase("(1/2)in", 1 / 12 / 2, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase('6"', 0.5, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase(`6' + 6"`, 6.5, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase(`6' + 6"`, 6.5, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase(`6'6"`, 6.5, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase(`6' 6"`, 6.5, undefined, {unit: Unit.FEET}),
    new SuccessfulTestCase(`6'6`, 6 * 12 + 6, undefined, {unit: Unit.INCHES}),
    new SuccessfulTestCase(`6' 6`, 6 * 12 + 6, undefined, {unit: Unit.INCHES}),
    new SuccessfulTestCase(`45deg`, 45, undefined, {unit: Unit.DEGREES}),
    new SuccessfulTestCase(`1rad`, 1, undefined, {unit: Unit.RADIANS}),
    new SuccessfulTestCase(`0rad`, 0, undefined, {unit: Unit.DEGREES}),
    new SuccessfulTestCase(`1rad`, 57.29577951308232, undefined, {unit: Unit.DEGREES}),
    new SuccessfulTestCase(`PI rad`, 180, undefined, {unit: Unit.DEGREES}),
    new SuccessfulTestCase(`180deg`, Math.PI, undefined, {unit: Unit.RADIANS}),
    new SuccessfulTestCase(`180°`, Math.PI, undefined, {unit: Unit.RADIANS}),
    new SuccessfulTestCase(`180°`, 180, undefined, {unit: Unit.DEGREES}),
    new ErrorTestCase(`180mm`, ConversionErrorType.INCOMPATIBLE_MEASURES, 3, 2, undefined, {unit: Unit.NONE}),
    new ErrorTestCase(`180in`, ConversionErrorType.INCOMPATIBLE_MEASURES, 3, 2, undefined, {unit: Unit.DEGREES}),
    new ErrorTestCase(`180deg`, ConversionErrorType.INCOMPATIBLE_MEASURES, 3, 3, undefined, {unit: Unit.INCHES}),
    new ErrorTestCase(`180°`, ConversionErrorType.INCOMPATIBLE_MEASURES, 3, 3, undefined, {unit: Unit.INCHES}),
    new SuccessfulTestCase(`1,000`, 1000, undefined, {delimiters: { decimal: ".", group: ","}}),
    new SuccessfulTestCase(`1.000`, 1000, undefined, {delimiters: { decimal: ",", group: "."}}),
    new SuccessfulTestCase(`1 000`, 1000, undefined, {delimiters: { decimal: ",", group: " "}}),
    new SuccessfulTestCase(`1.000`, 1000, undefined, {delimiters: { decimal: ",", group: "."}}),
    new SuccessfulTestCase(`1.000`, 1, undefined, {delimiters: { decimal: ".", group: ","}}),
    new SuccessfulTestCase(`.1`, 0.1, undefined, {delimiters: { decimal: ".", group: ","}}),
    new SuccessfulTestCase(`1,000.0`, 1000, undefined, {delimiters: { decimal: ".", group: ","}}),
    new SuccessfulTestCase(`1.000,0`, 1000, undefined, {delimiters: { decimal: ",", group: "."}}),
    new SuccessfulTestCase(`1 000,0`, 1000, undefined, {delimiters: { decimal: ",", group: " "}}),
    new SuccessfulTestCase(`1 000,1 + 1 000,1`, 2000.2, undefined, {delimiters: { decimal: ",", group: " "}}),
    new SuccessfulTestCase(`1.000,1 + 1.000,1`, 2000.2, undefined, {delimiters: { decimal: ",", group: "."}}),
    new SuccessfulTestCase(`6'6"`, 6 * 12 + 6, undefined, {unit: Unit.INCHES, delimiters: { decimal: ",", group: "'"}}),
    new SuccessfulTestCase(`6'6`, 6 * 12 + 6, undefined, {unit: Unit.INCHES, delimiters: { decimal: ",", group: "'"}}),
    new ErrorTestCase("1 00", ParsingErrorType.SYNTAX_ERROR, 1, 1, undefined, {delimiters: { decimal: ",", group: " "}}),
    new ErrorTestCase("1.", ParsingErrorType.SYNTAX_ERROR, 1, 1, undefined, {delimiters: { decimal: ".", group: ","}}),
    new ErrorTestCase("1,0", ParsingErrorType.SYNTAX_ERROR, 1, 1, undefined, {delimiters: { decimal: ".", group: ","}}),
    new ErrorTestCase("1,000 000", ParsingErrorType.SYNTAX_ERROR, 5, 1, undefined, {delimiters: { decimal: ".", group: ","}}),
    new SuccessfulTestCase("5in", 5 * 100, undefined, {unit: Unit.PIXELS, resolution:100}),
    new SuccessfulTestCase("5cm", 5 * 100, undefined, {unit: Unit.PIXELS, resolution:100*2.54}),
    new SuccessfulTestCase("0.5in", 1, undefined, {unit: Unit.PIXELS, resolution:2}),
    new SuccessfulTestCase("1cm", 1, undefined, {unit: Unit.PIXELS, resolution:2.54}),
    new ErrorTestCase("2in", ConversionErrorType.RESOLUTION_LESS_THAN_ONE, 3, 2, undefined,  {unit: Unit.PIXELS, resolution:0.5}),
    new ErrorTestCase("100px", ConversionErrorType.RESOLUTION_LESS_THAN_ONE, 3, 2, undefined,  {unit: Unit.PIXELS, resolution:0}),
    new ErrorTestCase("100px", ConversionErrorType.RESOLUTION_LESS_THAN_ONE, 3, 2, undefined,  {unit: Unit.PIXELS, resolution:-5}),
    new ErrorTestCase("0.5in", ConversionErrorType.PIXELS_LESS_THAN_ONE, 3, 2, undefined,  {unit: Unit.PIXELS, resolution:1}),
    new ErrorTestCase("0.5px", ConversionErrorType.PIXELS_LESS_THAN_ONE, 3, 2, undefined,  {unit: Unit.INCHES, resolution:1}),
  ];

  /* eslint no-loop-func: 0 */
  for (const testCase of testCases) {
    it(testCase.description, () => testCase.test());
  }
});
