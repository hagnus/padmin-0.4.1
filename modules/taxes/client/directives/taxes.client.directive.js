'use strict';

angular.module('taxes')

.directive('ngCurrency', ['$filter', '$locale', function ($filter, $locale) {
        return {
            require: 'ngModel',
            scope: {
                min: '=min',
                max: '=max',
                currencySymbol: '@',
                ngRequired: '=ngRequired',
                fraction: '=fraction'
            },
            link: function (scope, element, attrs, ngModel) {

                if (attrs.ngCurrency === 'false') return;

                var fract = (typeof scope.fraction !== 'undefined')?scope.fraction:2;

                function decimalRex(dChar) {
                    return RegExp("\\d|\\-|\\" + dChar, 'g');
                }

                function clearRex(dChar) {
                    return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0," + fract + "}", 'g');
                }

                function clearValue(value) {
                    value = String(value);
                    var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                    var cleared = null;

                    // Replace negative pattern to minus sign (-)
                    var neg_dummy = $filter('currency')("-1", getCurrencySymbol(), scope.fraction);
                    var neg_idx = neg_dummy.indexOf("1");
                    var neg_str = neg_dummy.substring(0,neg_idx);
                    value = value.replace(neg_str, "-");

                    if(RegExp("^-[\\s]*$", 'g').test(value)) {
                        value = "-0";
                    }

                    if(decimalRex(dSeparator).test(value))
                    {
                        cleared = value.match(decimalRex(dSeparator))
                            .join("").match(clearRex(dSeparator));
                        cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
                    }

                    return cleared;
                }

                function getCurrencySymbol() {
                    if (angular.isDefined(scope.currencySymbol)) {
                        return scope.currencySymbol;
                    } else {
                        return $locale.NUMBER_FORMATS.CURRENCY_SYM;
                    }
                }

                function reformatViewValue(){
                    var formatters = ngModel.$formatters,
                        idx = formatters.length;

                    var viewValue = ngModel.$$rawModelValue;
                    while (idx--) {
                      viewValue = formatters[idx](viewValue);
                    }

                    ngModel.$setViewValue(viewValue);
                    ngModel.$render();
                }

                ngModel.$parsers.push(function (viewValue) {
                    var cVal = clearValue(viewValue);
                    //return parseFloat(cVal);
                    // Check for fast digitation (-. or .)
                    if(cVal == "." || cVal == "-.")
                    {
                        cVal = ".0";
                    }
                    return parseFloat(cVal);
                });

                element.on("blur", function () {
                    ngModel.$commitViewValue();
                    reformatViewValue();
                });

                ngModel.$formatters.unshift(function (value) {
                    return $filter('currency')(value, getCurrencySymbol(), scope.fraction);
                });

                ngModel.$validators.min = function(cVal) {
                    if (!scope.ngRequired && isNaN(cVal)) {
                        return true;
                    }
                    if(typeof scope.min  !== 'undefined') {
                        return cVal >= parseFloat(scope.min);
                    }
                    return true;
                };
                
                scope.$watch('min', function (val) {
                    ngModel.$validate();
                });

                ngModel.$validators.max = function(cVal) {
                    if (!scope.ngRequired && isNaN(cVal)) {
                        return true;
                    }
                    if(typeof scope.max  !== 'undefined') {
                        return cVal <= parseFloat(scope.max);
                    }
                    return true;
                };

                scope.$watch('max', function (val) {
                    ngModel.$validate();
                });


                ngModel.$validators.fraction = function(cVal) {
                    if (!!cVal && isNaN(cVal)) {
                        return false;
                    }

                    return true;
                };
            }
        }
    }]);

// .directive('money', function () {

//   var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

//   function link(scope, el, attrs, ngModelCtrl) {
//     var min, max, precision, lastValidValue, preRoundValue;

//     /**
//      * Returns a rounded number in the precision setup by the directive
//      * @param  {Number} num Number to be rounded
//      * @return {Number}     Rounded number
//      */
//     function round(num) {
//       var d = Math.pow(10, precision);
//       return Math.round(num * d) / d;
//     }

//     /**
//      * Returns a string that represents the rounded number
//      * @param  {Number} value Number to be rounded
//      * @return {String}       The string representation
//      */
//     function formatPrecision(value) {
//       return parseFloat(value).toFixed(precision);
//     }

//     function formatViewValue(value) {
//       return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
//     }

//     function minValidator(value) {
//       if (!ngModelCtrl.$isEmpty(value) && value < min) {
//         ngModelCtrl.$setValidity('min', false);
//         return undefined;
//       } else {
//         ngModelCtrl.$setValidity('min', true);
//         return value;
//       }
//     }

//     function maxValidator(value) {
//       if (!ngModelCtrl.$isEmpty(value) && value > max) {
//         ngModelCtrl.$setValidity('max', false);
//         return undefined;
//       } else {
//         ngModelCtrl.$setValidity('max', true);
//         return value;
//       }
//     }

//     ngModelCtrl.$parsers.push(function (value) {
//       if (angular.isUndefined(value)) {
//         value = '';
//       }

//       // Handle leading decimal point, like ".5"
//       if (value.indexOf('.') === 0) {
//         value = '0' + value;
//       }

//       // Allow "-" inputs only when min < 0
//       if (value.indexOf('-') === 0) {
//         if (min >= 0) {
//           value = null;
//           ngModelCtrl.$setViewValue('');
//           ngModelCtrl.$render();
//         } else if (value === '-') {
//           value = '';
//         }
//       }

//       var empty = ngModelCtrl.$isEmpty(value);
//       if (empty || NUMBER_REGEXP.test(value)) {
//         lastValidValue = (value === '') ? null : (empty ? value : parseFloat(value));
//       } else {
//         // Render the last valid input in the field
//         ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
//         ngModelCtrl.$render();
//       }

//       ngModelCtrl.$setValidity('number', true);

//       return lastValidValue;
//     });
//     ngModelCtrl.$formatters.push(formatViewValue);


//     // Min validation
//     attrs.$observe('min', function (value) {
//       min = parseFloat(value || 0);
//       minValidator(ngModelCtrl.$modelValue);
//     });

//     ngModelCtrl.$parsers.push(minValidator);
//     ngModelCtrl.$formatters.push(minValidator);


//     // Max validation (optional)
//     if (angular.isDefined(attrs.max)) {
//       attrs.$observe('max', function (val) {
//         max = parseFloat(val);
//         maxValidator(ngModelCtrl.$modelValue);
//       });

//       ngModelCtrl.$parsers.push(maxValidator);
//       ngModelCtrl.$formatters.push(maxValidator);
//     }


//     // Round off (disabled by "-1")
//     if (attrs.precision !== '-1') {
//       attrs.$observe('precision', function (value) {
//         var parsed = parseFloat(value);
//         precision = !isNaN(parsed) ? parsed : 2;

//         // Trigger $parsers and $formatters pipelines
//         ngModelCtrl.$setViewValue(formatPrecision(ngModelCtrl.$modelValue));
//       });

//       ngModelCtrl.$parsers.push(function (value) {
//         if (value) {
//           // Save with rounded value
//           lastValidValue = round(value);

//           return lastValidValue;
//         } else {
//           return undefined;
//         }
//       });
//       ngModelCtrl.$formatters.push(function (value) {
//         return value ? formatPrecision(value) : value;
//       });

//       // Auto-format precision on blur
//       el.bind('blur', function () {
//         var value = ngModelCtrl.$modelValue;
//         if (value) {
//           ngModelCtrl.$viewValue = formatPrecision(value);
//           ngModelCtrl.$render();
//         }
//       });
//     }
//   }

//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link: link
//   };
// }); 