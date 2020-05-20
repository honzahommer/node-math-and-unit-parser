```
import { MathParser, Unit } from "math-and-unit-parser";

try {
  result = MathParser(expression, currentValue, {useDegrees, unit: Unit.INCHES, delimiters:{decimal: ".", group: ","}});
} catch (err) {
  switch (err.errorType) {
    case ErrorTypes.ParsingErrorType.EMPTY:
      errorMessage = "Input is empty";
      break;
  }
}
```

#### Throws specific errors that you can catch and handle how you like
```
""                           throws ParsingErrorType.EMPTY
" \f\n\r\t\v"                throws ParsingErrorType.EMPTY
"()"                         throws ParsingErrorType.EMPTY
"1(1+"                       throws ParsingErrorType.MISMATCHED_PARENS
"((1)"                       throws ParsingErrorType.MISMATCHED_PARENS
"(1))"                       throws ParsingErrorType.MISMATCHED_PARENS
"1 + (2 - (3 * (4 / (5)))))" throws ParsingErrorType.MISMATCHED_PARENS
"(1)1"                       throws ParsingErrorType.SYNTAX_ERROR
"1a"                         throws ParsingErrorType.SYNTAX_ERROR
"abc"                        throws ParsingErrorType.SYNTAX_ERROR
"a + b * c"                  throws ParsingErrorType.SYNTAX_ERROR
"1 2 3"                      throws ParsingErrorType.SYNTAX_ERROR
"12."                        throws ParsingErrorType.SYNTAX_ERROR
"1 + 2 # 3"                  throws ParsingErrorType.SYNTAX_ERROR
"1 / (1 - 1)"                throws EvaluationErrorType.DIVIDE_BY_ZERO
"50%"                        throws EvaluationErrorType.EXPECTED_CURRENT_VALUE
"+"                          throws EvaluationErrorType.EXPECTED_MORE_ARGUMENTS
"1 *"                        throws EvaluationErrorType.EXPECTED_MORE_ARGUMENTS
"(1 + ) + 1"                 throws EvaluationErrorType.EXPECTED_MORE_ARGUMENTS
"-"                          throws EvaluationErrorType.EXPECTED_MORE_ARGUMENTS
"--"                         throws EvaluationErrorType.EXPECTED_MORE_ARGUMENTS
"-1 ^ 2 ^ 3.4"               throws EvaluationErrorType.IMAGINARY_NUMBER
```

#### Evaluates most math expressions, obeying order of operations and parenthesis, and ignoring no-ops
```
"1"                          returns 1
"123"                        returns 123
"1.23"                       returns 1.23
".12"                        returns 0.12
"1e2"                        returns 100
"1e+2 + 3"                   returns 103
"1e-2 - 3"                   returns -2.99
"+1"                         returns 1
"++1"                        returns 1
"+++1"                       returns 1
"-1"                         returns -1
"--1"                        returns 1
"---1"                       returns -1
"((1))"                      returns 1
"1 + 2"                      returns 3
"1 + (2)"                    returns 3
"(1) + 2"                    returns 3
"+(1 + 2)"                   returns 3
"-(1 - 2)"                   returns 1
"1 + 2 * 3"                  returns 7
"1 + (2 * 3)"                returns 7
"(1 + 2) * 3"                returns 9
"1 ^ 2"                      returns 1
"-1 ^ 2"                     returns 1
"(-1) ^ 2"                   returns 1
"-(1 ^ 2)"                   returns -1
"4 ^ -2"                     returns 0.0625
"(-4 ^ 2)"                   returns 16
"2 * 2 ^ 3"                  returns 16
"2 * (2 ^ 3)"                returns 16
"(2 * 2) ^ 3"                returns 64
"2 ^ 2 ^ 3"                  returns 256
"2 ^ (2 ^ 3)"                returns 256
"(2 ^ 2) ^ 3"                returns 64
"1 + .2 * -3 / +4 ^ 5"       returns 0.9994140625
```

#### Can operate on the current value
```
"+-+-1++--++--++--+2-3+4"    returns 4
"50%"                        returns 7                             with currentValue: 14
"%50"                        returns 7                             with currentValue: 14
"50%-1"                      returns 6                             with currentValue: 14
"25%*2"                      returns 8                             with currentValue: 16
"2x"                         returns 6                             with currentValue: 3
"x2"                         returns 6                             with currentValue: 3
"3X"                         returns 12                            with currentValue: 4
"2x-1"                       returns 7                             with currentValue: 4
"2x*3"                       returns 6                             with currentValue: 1
"/2"                         returns 3                             with currentValue: 6
"*2"                         returns 12                            with currentValue: 6
"+2"                         returns 8                             with currentValue: 6
"+ 2"                        returns 8                             with currentValue: 6
"-2"                         returns -2                            with currentValue: 6
"- 2"                        returns 4                             with currentValue: 6
"^2"                         returns 36                            with currentValue: 6
```

#### Uses common constants and calculates trig functions
```
"E"                          returns Math.E
"e"                          returns Math.E
"pi"                         returns Math.PI
"Pi"                         returns Math.PI
"PI"                         returns Math.PI
"tau"                        returns 2 * Math.PI
"Tau"                        returns 2 * Math.PI
"TAU"                        returns 2 * Math.PI
"cos 180"                    returns Math.cos(Math.PI)
"cos(TAU)"                   returns Math.cos(2 * Math.PI)         with config: {useDegrees: false}
"sin90.0"                    returns Math.sin(Math.PI / 2)
"50*sin45"                   returns 50 * Math.sin(Math.PI / 4)
"sin(pi / 2)"                returns Math.sin(Math.PI / 2)         with config: {useDegrees: false}
"tan45"                      returns Math.tan(Math.PI / 4)
"tan(e)"                     returns Math.tan(Math.E)              with config: {useDegrees: false}
"tan(e)/10"                  returns Math.tan(Math.E) / 10         with config: {useDegrees: false}
```

#### Converts units within math expressions and throws errors when trying to convert between different measure types
```
"10mm"                       returns 1                             with config: {unit: Unit.CENTIMETERS}
"10mm+2"                     returns 3                             with config: {unit: Unit.CENTIMETERS}
"7m"                         returns 700                           with config: {unit: Unit.CENTIMETERS}
"3cm"                        returns 3                             with config: {unit: Unit.CENTIMETERS}
"3cm*3"                      returns 9                             with config: {unit: Unit.CENTIMETERS}
"3cm+3cm"                    returns 6                             with config: {unit: Unit.CENTIMETERS}
"1mm"                        returns 0.1                           with config: {unit: Unit.CENTIMETERS}
"10mm"                       returns 0.01                          with config: {unit: Unit.METERS}
"7m"                         returns 7                             with config: {unit: Unit.METERS}
"3cm"                        returns 0.03                          with config: {unit: Unit.METERS}
"1mm"                        returns 0.001                         with config: {unit: Unit.METERS}
"1ft"                        returns 12                            with config: {unit: Unit.INCHES}
"3.5ft"                      returns 3.5 * 12                      with config: {unit: Unit.INCHES}
"2'"                         returns 24                            with config: {unit: Unit.INCHES}
`2'+6"`                      returns 30                            with config: {unit: Unit.INCHES}
"12in"                       returns 1                             with config: {unit: Unit.FEET}
"(1/2)in"                    returns 1 / 12 / 2                    with config: {unit: Unit.FEET}
'6"'                         returns 0.5                           with config: {unit: Unit.FEET}
`6' + 6"`                    returns 6.5                           with config: {unit: Unit.FEET}
`6' + 6"`                    returns 6.5                           with config: {unit: Unit.FEET}
`6'6"`                       returns 6.5                           with config: {unit: Unit.FEET}
`6' 6"`                      returns 6.5                           with config: {unit: Unit.FEET}
`6'6`                        returns 6 * 12 + 6                    with config: {unit: Unit.INCHES}
`6' 6`                       returns 6 * 12 + 6                    with config: {unit: Unit.INCHES}
`45deg`                      returns 45                            with config: {unit: Unit.DEGREES}
`1rad`                       returns 1                             with config: {unit: Unit.RADIANS}
`0rad`                       returns 0                             with config: {unit: Unit.DEGREES}
`1rad`                       returns 57.29577951308232             with config: {unit: Unit.DEGREES}
`PI rad`                     returns 180                           with config: {unit: Unit.DEGREES}
`180deg`                     returns Math.PI                       with config: {unit: Unit.RADIANS}
`180mm`                      throws ConversionErrorType.INCOMPATIBLE_MEASURES         with config: {unit: Unit.NONE})
`180in`                      throws ConversionErrorType.INCOMPATIBLE_MEASURES         with config: {unit: Unit.DEGREES})
`180deg`                     throws ConversionErrorType.INCOMPATIBLE_MEASURES         with config: {unit: Unit.INCHES})
```

#### Can handle different delimiters and separators based on locale and throws errors when the wrong delimiter is used
```
`1,000`                      returns 1000                          with config: {delimiters: {decimal: ".", group: ","}}
`1.000`                      returns 1000                          with config: {delimiters: {decimal: ",", group: "."}}
`1 000`                      returns 1000                          with config: {delimiters: {decimal: ",", group: " "}}
`1.000`                      returns 1000                          with config: {delimiters: {decimal: ",", group: "."}}
`1.000`                      returns 1                             with config: {delimiters: {decimal: ".", group: ","}}
`.1`                         returns 0.1                           with config: {delimiters: {decimal: ".", group: ","}}
`1,000.0`                    returns 1000                          with config: {delimiters: {decimal: ".", group: ","}}
`1.000,0`                    returns 1000                          with config: {delimiters: {decimal: ",", group: "."}}
`1 000,0`                    returns 1000                          with config: {delimiters: {decimal: ",", group: " "}}
`1 000,1 + 1 000,1`          returns 2000.2                        with config: {delimiters: {decimal: ",", group: " "}}
`1.000,1 + 1.000,1`          returns 2000.2                        with config: {delimiters: {decimal: ",", group: "."}}
`6'6"`                       returns 6 * 12 + 6 with config: {unit: Unit.INCHES, delimiters: {decimal: ",", group: "'"}}
`6'6`                        returns 6 * 12 + 6 with config: {unit: Unit.INCHES, delimiters: {decimal: ",", group: "'"}}
"1 00"                       throws ParsingErrorType.SYNTAX_ERROR  with config: {delimiters: {decimal: ",", group: " "}}
"1."                         throws ParsingErrorType.SYNTAX_ERROR  with config: {delimiters: {decimal: ".", group: ","}}
"1,0"                        throws ParsingErrorType.SYNTAX_ERROR  with config: {delimiters: {decimal: ".", group: ","}}
"1,000 000"                  throws ParsingErrorType.SYNTAX_ERROR  with config: {delimiters: {decimal: ".", group: ","}}
```
