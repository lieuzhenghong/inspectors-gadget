/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 39);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {
  /**
   * Create a Matrix. The function creates a new `math.type.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   * Supported storage formats are 'dense' and 'sparse'.
   *
   * Syntax:
   *
   *    math.matrix()                         // creates an empty matrix using default storage format (dense).
   *    math.matrix(data)                     // creates a matrix with initial data using default storage format (dense).
   *    math.matrix('dense')                  // creates an empty matrix using the given storage format.
   *    math.matrix(data, 'dense')            // creates a matrix with initial data using the given storage format.
   *    math.matrix(data, 'sparse')           // creates a sparse matrix with initial data.
   *    math.matrix(data, 'sparse', 'number') // creates a sparse matrix with initial data, number data type.
   *
   * Examples:
   *
   *    var m = math.matrix([[1, 2], [3, 4]]);
   *    m.size();                        // Array [2, 2]
   *    m.resize([3, 2], 5);
   *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit, sparse
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @param {string} [format]          The Matrix storage format
   *
   * @return {Matrix} The created matrix
   */
  var matrix = typed('matrix', {
    '': function () {
      return _create([]);
    },

    'string': function (format) {
      return _create([], format);
    },
    
    'string, string': function (format, datatype) {
      return _create([], format, datatype);
    },

    'Array': function (data) {
      return _create(data);
    },
      
    'Matrix': function (data) {
      return _create(data, data.storage());
    },
    
    'Array | Matrix, string': _create,
    
    'Array | Matrix, string, string': _create
  });

  matrix.toTex = {
    0: '\\begin{bmatrix}\\end{bmatrix}',
    1: '\\left(${args[0]}\\right)',
    2: '\\left(${args[0]}\\right)'
  };

  return matrix;

  /**
   * Create a new Matrix with given storage format
   * @param {Array} data
   * @param {string} [format]
   * @param {string} [datatype]
   * @returns {Matrix} Returns a new Matrix
   * @private
   */
  function _create(data, format, datatype) {
    // get storage format constructor
    var M = type.Matrix.storage(format || 'default');

    // create instance
    return new M(data, datatype);
  }
}

exports.name = 'matrix';
exports.factory = factory;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Clone an object
 *
 *     clone(x)
 *
 * Can clone any primitive type, array, and object.
 * If x has a function clone, this function will be invoked to clone the object.
 *
 * @param {*} x
 * @return {*} clone
 */
exports.clone = function clone(x) {
  var type = typeof x;

  // immutable primitive types
  if (type === 'number' || type === 'string' || type === 'boolean' ||
      x === null || x === undefined) {
    return x;
  }

  // use clone function of the object when available
  if (typeof x.clone === 'function') {
    return x.clone();
  }

  // array
  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value);
    });
  }

  if (x instanceof Number)    return new Number(x.valueOf());
  if (x instanceof String)    return new String(x.valueOf());
  if (x instanceof Boolean)   return new Boolean(x.valueOf());
  if (x instanceof Date)      return new Date(x.valueOf());
  if (x && x.isBigNumber === true) return x; // bignumbers are immutable
  if (x instanceof RegExp)  throw new TypeError('Cannot clone ' + x);  // TODO: clone a RegExp

  // object
  return exports.map(x, clone);
};

/**
 * Apply map to all properties of an object
 * @param {Object} object
 * @param {function} callback
 * @return {Object} Returns a copy of the object with mapped properties
 */
exports.map = function(object, callback) {
  var clone = {};

  for (var key in object) {
    if (exports.hasOwnProperty(object, key)) {
      clone[key] = callback(object[key]);
    }
  }

  return clone;
}

/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */
exports.extend = function(a, b) {
  for (var prop in b) {
    if (exports.hasOwnProperty(b, prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
};

/**
 * Deep extend an object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
exports.deepExtend = function deepExtend (a, b) {
  // TODO: add support for Arrays to deepExtend
  if (Array.isArray(b)) {
    throw new TypeError('Arrays are not supported by deepExtend');
  }

  for (var prop in b) {
    if (exports.hasOwnProperty(b, prop)) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop]);
        }
        else {
          a[prop] = b[prop];
        }
      } else if (Array.isArray(b[prop])) {
        throw new TypeError('Arrays are not supported by deepExtend');
      } else {
        a[prop] = b[prop];
      }
    }
  }
  return a;
};

/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */
exports.deepEqual = function deepEqual (a, b) {
  var prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    if (a.length != b.length) {
      return false;
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!exports.deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }

    for (prop in a) {
      //noinspection JSUnfilteredForInLoop
      if (!exports.deepEqual(a[prop], b[prop])) {
        return false;
      }
    }
    for (prop in b) {
      //noinspection JSUnfilteredForInLoop
      if (!exports.deepEqual(a[prop], b[prop])) {
        return false;
      }
    }
    return true;
  }
  else {
    return (typeof a === typeof b) && (a == b);
  }
};

/**
 * Test whether the current JavaScript engine supports Object.defineProperty
 * @returns {boolean} returns true if supported
 */
exports.canDefineProperty = function () {
  // test needed for broken IE8 implementation
  try {
    if (Object.defineProperty) {
      Object.defineProperty({}, 'x', { get: function () {} });
      return true;
    }
  } catch (e) {}

  return false;
};

/**
 * Attach a lazy loading property to a constant.
 * The given function `fn` is called once when the property is first requested.
 * On older browsers (<IE8), the function will fall back to direct evaluation
 * of the properties value.
 * @param {Object} object   Object where to add the property
 * @param {string} prop     Property name
 * @param {Function} fn     Function returning the property value. Called
 *                          without arguments.
 */
exports.lazy = function (object, prop, fn) {
  if (exports.canDefineProperty()) {
    var _uninitialized = true;
    var _value;
    Object.defineProperty(object, prop, {
      get: function () {
        if (_uninitialized) {
          _value = fn();
          _uninitialized = false;
        }
        return _value;
      },

      set: function (value) {
        _value = value;
        _uninitialized = false;
      },

      configurable: true,
      enumerable: true
    });
  }
  else {
    // fall back to immediate evaluation
    object[prop] = fn();
  }
};

/**
 * Traverse a path into an object.
 * When a namespace is missing, it will be created
 * @param {Object} object
 * @param {string} path   A dot separated string like 'name.space'
 * @return {Object} Returns the object at the end of the path
 */
exports.traverse = function(object, path) {
  var obj = object;

  if (path) {
    var names = path.split('.');
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!(name in obj)) {
        obj[name] = {};
      }
      obj = obj[name];
    }
  }

  return obj;
};

/**
 * A safe hasOwnProperty
 * @param {Object} object
 * @param {string} property
 */
exports.hasOwnProperty = function (object, property) {
  return object && Object.hasOwnProperty.call(object, property);
}

/**
 * Test whether an object is a factory. a factory has fields:
 *
 * - factory: function (type: Object, config: Object, load: function, typed: function [, math: Object])   (required)
 * - name: string (optional)
 * - path: string    A dot separated path (optional)
 * - math: boolean   If true (false by default), the math namespace is passed
 *                   as fifth argument of the factory function
 *
 * @param {*} object
 * @returns {boolean}
 */
exports.isFactory = function (object) {
  return object && typeof object.factory === 'function';
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @typedef {{sign: '+' | '-' | '', coefficients: number[], exponent: number}} SplitValue
 */

/**
 * Test whether value is a number
 * @param {*} value
 * @return {boolean} isNumber
 */
exports.isNumber = function(value) {
  return typeof value === 'number';
};

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */
exports.isInteger = function(value) {
  return isFinite(value)
      ? (value == Math.round(value))
      : false;
  // Note: we use ==, not ===, as we can have Booleans as well
};

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {*}
 */
exports.sign = Math.sign || function(x) {
  if (x > 0) {
    return 1;
  }
  else if (x < 0) {
    return -1;
  }
  else {
    return 0;
  }
};

/**
 * Convert a number to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'engineering'    Always use engineering notation.
 *                                          For example '123.4e+0' and '14.0e+6'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {number} lower and {number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *    format(12345678, {notation: 'engineering'});        // '12.345678e+6'
 *
 * @param {number} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
exports.format = function(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (value === Infinity) {
    return 'Infinity';
  }
  else if (value === -Infinity) {
    return '-Infinity';
  }
  else if (isNaN(value)) {
    return 'NaN';
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (exports.isNumber(options)) {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'engineering':
      return exports.toEngineering(value, precision);

    case 'auto':
      return exports
          .toPrecision(value, precision, options && options.exponential)

          // remove trailing zeros after the decimal point
          .replace(/((\.\d*?)(0+))($|e)/, function () {
            var digits = arguments[2];
            var e = arguments[4];
            return (digits !== '.') ? digits + e : e;
          });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Split a number into sign, coefficients, and exponent
 * @param {number | string} value
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 */
exports.splitNumber = function (value) {
  // parse the input value
  var match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
  if (!match) {
    throw new SyntaxError('Invalid number ' + value);
  }

  var sign         = match[1];
  var digits       = match[2];
  var exponent     = parseFloat(match[4] || '0');

  var dot = digits.indexOf('.');
  exponent += (dot !== -1) ? (dot - 1) : (digits.length - 1);

  var coefficients = digits
      .replace('.', '')  // remove the dot (must be removed before removing leading zeros)
      .replace(/^0*/, function (zeros) {
        // remove leading zeros, add their count to the exponent
        exponent -= zeros.length;
        return '';
      })
      .replace(/0*$/, '') // remove trailing zeros
      .split('')
      .map(function (d) {
        return parseInt(d);
      });

  if (coefficients.length === 0) {
    coefficients.push(0);
    exponent++;
  }

  return {
    sign: sign,
    coefficients: coefficients,
    exponent: exponent
  };
};


/**
 * Format a number in engineering notation. Like '1.23e+6', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toEngineering = function (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  
  var rounded = exports.roundDigits(exports.splitNumber(value), precision);

  var e = rounded.exponent;
  var c = rounded.coefficients;

  // find nearest lower multiple of 3 for exponent
  var newExp = e % 3 === 0 ? e : (e < 0 ? (e - 3) - (e % 3) : e - (e % 3));

  // concatenate coefficients with necessary zeros
  var significandsDiff = e >= 0 ? e : Math.abs(newExp);

  // add zeros if necessary (for ex: 1e+8)
  if (c.length - 1 < significandsDiff) c = c.concat(zeros(significandsDiff - (c.length - 1)));

  // find difference in exponents
  var expDiff = Math.abs(e - newExp);

  var decimalIdx = 1;

  // push decimal index over by expDiff times
  while (--expDiff >= 0) decimalIdx++;

  // if all coefficient values are zero after the decimal point, don't add a decimal value.
  // otherwise concat with the rest of the coefficients
  var decimals = c.slice(decimalIdx).join('');
  var decimalVal = decimals.match(/[1-9]/) ? ('.' + decimals) : '';

  var str = c.slice(0, decimalIdx).join('') +
      decimalVal +
      'e' + (e >= 0 ? '+' : '') + newExp.toString();
  return rounded.sign + str;
};

/**
 * Format a number with fixed notation.
 * @param {number | string} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  var splitValue = exports.splitNumber(value)
  var rounded = exports.roundDigits(splitValue, splitValue.exponent + 1 + (precision || 0));
  var c = rounded.coefficients;
  var p = rounded.exponent + 1; // exponent may have changed

  // append zeros if needed
  var pp = p + (precision || 0);
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length));
  }

  // prepend zeros if needed
  if (p < 0) {
    c = zeros(-p + 1).concat(c);
    p = 1;
  }

  // insert a dot if needed
  if (precision) {
    c.splice(p, 0, (p === 0) ? '0.' : '.');
  }

  return rounded.sign + c.join('');
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {number | string} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 */
exports.toExponential = function (value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  // round if needed, else create a clone
  var split = exports.splitNumber(value)
  var rounded = precision ? exports.roundDigits(split, precision) : split;
  var c = rounded.coefficients;
  var e = rounded.exponent;

  // append zeros if needed
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length));
  }

  // format as `C.CCCe+EEE` or `C.CCCe-EEE`
  var first = c.shift();
  return rounded.sign + first + (c.length > 0 ? ('.' + c.join('')) : '') +
      'e' + (e >= 0 ? '+' : '') + e;
}

/**
 * Format a number with a certain precision
 * @param {number | string} value
 * @param {number} [precision=undefined] Optional number of digits.
 * @param {{lower: number | undefined, upper: number | undefined}} [options]
 *                                       By default:
 *                                         lower = 1e-3 (excl)
 *                                         upper = 1e+5 (incl)
 * @return {string}
 */
exports.toPrecision = function (value, precision, options) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  // determine lower and upper bound for exponential notation.
  var lower = (options && options.lower !== undefined) ? options.lower : 1e-3;
  var upper = (options && options.upper !== undefined) ? options.upper : 1e+5;

  var split = exports.splitNumber(value)
  var abs = Math.abs(Math.pow(10, split.exponent));
  if (abs < lower || abs >= upper) {
    // exponential notation
    return exports.toExponential(value, precision);
  }
  else {
    var rounded = precision ? exports.roundDigits(split, precision) : split;
    var c = rounded.coefficients;
    var e = rounded.exponent;

    // append trailing zeros
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    }

    // append trailing zeros
    // TODO: simplify the next statement
    c = c.concat(zeros(e - c.length + 1 +
        (c.length < precision ? precision - c.length : 0)));

    // prepend zeros
    c = zeros(-e).concat(c);

    var dot = e > 0 ? e : 0;
    if (dot < c.length - 1) {
      c.splice(dot + 1, 0, '.');
    }

    return rounded.sign + c.join('');
  }
}

/**
 * Round the number of digits of a number *
 * @param {SplitValue} split       A value split with .splitNumber(value)
 * @param {number} precision  A positive integer
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 *              with rounded digits
 */
exports.roundDigits = function (split, precision) {
  // create a clone
  var rounded = {
    sign: split.sign,
    coefficients: split.coefficients,
    exponent: split.exponent
  }
  var c = rounded.coefficients;

  // prepend zeros if needed
  while (precision <= 0) {
    c.unshift(0);
    rounded.exponent++;
    precision++;
  }

  if (c.length > precision) {
    var removed = c.splice(precision, c.length - precision);

    if (removed[0] >= 5) {
      var i = precision - 1;
      c[i]++;
      while (c[i] === 10) {
        c.pop();
        if (i === 0) {
          c.unshift(0);
          rounded.exponent++;
          i++;
        }
        i--;
        c[i]++;
      }
    }
  }

  return rounded;
};

/**
 * Create an array filled with zeros.
 * @param {number} length
 * @return {Array}
 */
function zeros(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}

/**
 * Count the number of significant digits of a number.
 *
 * For example:
 *   2.34 returns 3
 *   0.0034 returns 2
 *   120.5e+30 returns 4
 *
 * @param {number} value
 * @return {number} digits   Number of significant digits
 */
exports.digits = function(value) {
  return value
      .toExponential()
      .replace(/e.*$/, '')          // remove exponential notation
      .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
      .length
};

/**
 * Minimum number added to one that makes the result different than one
 */
exports.DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
*/
exports.nearlyEqual = function(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) {
    return x == y;
  }

  // use "==" operator, handles infinities
  if (x == y) {
    return true;
  }

  // NaN
  if (isNaN(x) || isNaN(y)) {
    return false;
  }

  // at this point x and y should be finite
  if(isFinite(x) && isFinite(y)) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = Math.abs(x - y);
    if (diff < exports.DBL_EPSILON) {
      return true;
    }
    else {
      // use relative error
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var number = __webpack_require__(2);
var string = __webpack_require__(9);
var object = __webpack_require__(1);
var types = __webpack_require__(21);

var DimensionError = __webpack_require__(4);
var IndexError = __webpack_require__(28);

/**
 * Calculate the size of a multi dimensional array.
 * This function checks the size of the first entry, it does not validate
 * whether all dimensions match. (use function `validate` for that)
 * @param {Array} x
 * @Return {Number[]} size
 */
exports.size = function (x) {
  var s = [];

  while (Array.isArray(x)) {
    s.push(x.length);
    x = x[0];
  }

  return s;
};

/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @param {number} dim   Current dimension
 * @throws DimensionError
 * @private
 */
function _validate(array, size, dim) {
  var i;
  var len = array.length;

  if (len != size[dim]) {
    throw new DimensionError(len, size[dim]);
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!Array.isArray(child)) {
        throw new DimensionError(size.length - 1, size.length, '<');
      }
      _validate(array[i], size, dimNext);
    }
  }
  else {
    // last dimension. none of the childs may be an array
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new DimensionError(size.length + 1, size.length, '>');
      }
    }
  }
}

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {number[]} size  Array with the size of each dimension
 * @throws DimensionError
 */
exports.validate = function(array, size) {
  var isScalar = (size.length == 0);
  if (isScalar) {
    // scalar
    if (Array.isArray(array)) {
      throw new DimensionError(array.length, 0);
    }
  }
  else {
    // array
    _validate(array, size, 0);
  }
};

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * when length is provided
 * @param {number} index    Zero-based index
 * @param {number} [length] Length of the array
 */
exports.validateIndex = function(index, length) {
  if (!number.isNumber(index) || !number.isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')');
  }
  if (index < 0 || (typeof length === 'number' && index >= length)) {
    throw new IndexError(index, length);
  }
};

// a constant used to specify an undefined defaultValue
exports.UNINITIALIZED = {};

/**
 * Resize a multi dimensional array. The resized array is returned.
 * @param {Array} array         Array to be resized
 * @param {Array.<number>} size Array with the size of each dimension
 * @param {*} [defaultValue=0]  Value to be filled in in new entries,
 *                              zero by default. To leave new entries undefined,
 *                              specify array.UNINITIALIZED as defaultValue
 * @return {Array} array         The resized array
 */
exports.resize = function(array, size, defaultValue) {
  // TODO: add support for scalars, having size=[] ?

  // check the type of the arguments
  if (!Array.isArray(array) || !Array.isArray(size)) {
    throw new TypeError('Array expected');
  }
  if (size.length === 0) {
    throw new Error('Resizing to scalar is not supported');
  }

  // check whether size contains positive integers
  size.forEach(function (value) {
    if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + string.format(size) + ')');
    }
  });

  // recursively resize the array
  var _defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
  _resize(array, size, 0, _defaultValue);

  return array;
};

/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {number[]} size       Array with the size of each dimension
 * @param {number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default.
 * @private
 */
function _resize (array, size, dim, defaultValue) {
  var i;
  var elem;
  var oldLen = array.length;
  var newLen = size[dim];
  var minLen = Math.min(oldLen, newLen);

  // apply new length
  array.length = newLen;

  if (dim < size.length - 1) {
    // non-last dimension
    var dimNext = dim + 1;

    // resize existing child arrays
    for (i = 0; i < minLen; i++) {
      // resize child array
      elem = array[i];
      if (!Array.isArray(elem)) {
        elem = [elem]; // add a dimension
        array[i] = elem;
      }
      _resize(elem, size, dimNext, defaultValue);
    }

    // create new child arrays
    for (i = minLen; i < newLen; i++) {
      // get child array
      elem = [];
      array[i] = elem;

      // resize new child array
      _resize(elem, size, dimNext, defaultValue);
    }
  }
  else {
    // last dimension

    // remove dimensions of existing values
    for (i = 0; i < minLen; i++) {
      while (Array.isArray(array[i])) {
        array[i] = array[i][0];
      }
    }

    if(defaultValue !== exports.UNINITIALIZED) {
      // fill new elements with the default value
      for (i = minLen; i < newLen; i++) {
        array[i] = defaultValue;
      }
    }
  }
}

/**
 * Re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */
exports.reshape = function(array, sizes) {
  var flatArray = exports.flatten(array);
  var newArray;

  var product = function (arr) {
    return arr.reduce(function (prev, curr) {
      return prev * curr;
    });
  };

  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError('Array expected');
  }

  if (sizes.length === 0) {
    throw new DimensionError(0, product(exports.size(array)), '!=');
  }

  try {
    newArray  = _reshape(flatArray, sizes);
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(
        product(sizes),
        product(exports.size(array)),
        '!='
      );
    }
    throw e;
  }

  if (flatArray.length > 0) {
    throw new DimensionError(
      product(sizes),
      product(exports.size(array)),
      '!='
    );
  }

  return newArray;
};

/**
 * Recursively re-shape a multi dimensional array to fit the specified dimensions
 * @param {Array} array           Array to be reshaped
 * @param {Array.<number>} sizes  List of sizes for each dimension
 * @returns {Array}               Array whose data has been formatted to fit the
 *                                specified dimensions
 *
 * @throws {DimensionError}       If the product of the new dimension sizes does
 *                                not equal that of the old ones
 */
function _reshape(array, sizes) {
  var accumulator = [];
  var i;

  if (sizes.length === 0) {
    if (array.length === 0) {
      throw new DimensionError(null, null, '!=');
    }
    return array.shift();
  }
  for (i = 0; i < sizes[0]; i += 1) {
    accumulator.push(_reshape(array, sizes.slice(1)));
  }
  return accumulator;
}


/**
 * Squeeze a multi dimensional array
 * @param {Array} array
 * @param {Array} [size]
 * @returns {Array} returns the array itself
 */
exports.squeeze = function(array, size) {
  var s = size || exports.size(array);

  // squeeze outer dimensions
  while (Array.isArray(array) && array.length === 1) {
    array = array[0];
    s.shift();
  }

  // find the first dimension to be squeezed
  var dims = s.length;
  while (s[dims - 1] === 1) {
    dims--;
  }

  // squeeze inner dimensions
  if (dims < s.length) {
    array = _squeeze(array, dims, 0);
    s.length = dims;
  }

  return array;
};

/**
 * Recursively squeeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _squeeze (array, dims, dim) {
  var i, ii;

  if (dim < dims) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _squeeze(array[i], dims, next);
    }
  }
  else {
    while (Array.isArray(array)) {
      array = array[0];
    }
  }

  return array;
}

/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 * 
 * Paramter `size` will be mutated to match the new, unqueezed matrix size.
 * 
 * @param {Array} array
 * @param {number} dims     Desired number of dimensions of the array
 * @param {number} [outer]  Number of outer dimensions to be added
 * @param {Array} [size]    Current size of array.
 * @returns {Array} returns the array itself
 * @private
 */
exports.unsqueeze = function(array, dims, outer, size) {
  var s = size || exports.size(array);

  // unsqueeze outer dimensions
  if (outer) {
    for (var i = 0; i < outer; i++) {
      array = [array];
      s.unshift(1);
    }
  }

  // unsqueeze inner dimensions
  array = _unsqueeze(array, dims, 0);
  while (s.length < dims) {
    s.push(1);
  }

  return array;
};

/**
 * Recursively unsqueeze a multi dimensional array
 * @param {Array} array
 * @param {number} dims Required number of dimensions
 * @param {number} dim  Current dimension
 * @returns {Array | *} Returns the squeezed array
 * @private
 */
function _unsqueeze (array, dims, dim) {
  var i, ii;

  if (Array.isArray(array)) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next);
    }
  }
  else {
    for (var d = dim; d < dims; d++) {
      array = [array];
    }
  }

  return array;
}
/**
 * Flatten a multi dimensional array, put all elements in a one dimensional
 * array
 * @param {Array} array   A multi dimensional array
 * @return {Array}        The flattened array (1 dimensional)
 */
exports.flatten = function(array) {
  if (!Array.isArray(array)) {
    //if not an array, return as is
    return array;
  }
  var flat = [];

  array.forEach(function callback(value) {
    if (Array.isArray(value)) {
      value.forEach(callback);  //traverse through sub-arrays recursively
    }
    else {
      flat.push(value);
    }
  });

  return flat;
};

/**
 * A safe map
 * @param {Array} array
 * @param {function} callback
 */
exports.map = function (array, callback) {
  return Array.prototype.map.call(array, callback);
}

/**
 * A safe forEach
 * @param {Array} array
 * @param {function} callback
 */
exports.forEach = function (array, callback) {
  Array.prototype.forEach.call(array, callback);
}

/**
 * A safe join
 * @param {Array} array
 * @param {string} separator
 */
exports.join = function (array, separator) {
  return Array.prototype.join.call(array, separator);
}

/**
 * Assign a numeric identifier to every element of a sorted array
 * @param {Array}	a  An array
 * @return {Array}	An array of objects containing the original value and its identifier
 */
exports.identify = function(a) {
  if (!Array.isArray(a)) {
	throw new TypeError('Array input expected');
  }
	
  if (a.length === 0) {
	return a;
  }
	
  var b = [];
  var count = 0;
  b[0] = {value: a[0], identifier: 0};
  for (var i=1; i<a.length; i++) {
    if (a[i] === a[i-1]) {
  	count++;
    }
    else {
      count = 0;
    }
    b.push({value: a[i], identifier: count});
  }
  return b;
}

/**
 * Remove the numeric identifier from the elements
 * @param	a  An array
 * @return	An array of values without identifiers
 */
exports.generalize = function(a) {
  if (!Array.isArray(a)) {
	throw new TypeError('Array input expected');
  }
	
  if (a.length === 0) {
	return a;
  }
	
  var b = [];
  for (var i=0; i<a.length; i++) {
    b.push(a[i].value);
  }
  return b;
}

/**
 * Test whether an object is an array
 * @param {*} value
 * @return {boolean} isArray
 */
exports.isArray = Array.isArray;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Create a range error with the message:
 *     'Dimension mismatch (<actual size> != <expected size>)'
 * @param {number | number[]} actual        The actual size
 * @param {number | number[]} expected      The expected size
 * @param {string} [relation='!=']          Optional relation between actual
 *                                          and expected size: '!=', '<', etc.
 * @extends RangeError
 */
function DimensionError(actual, expected, relation) {
  if (!(this instanceof DimensionError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.actual   = actual;
  this.expected = expected;
  this.relation = relation;

  this.message = 'Dimension mismatch (' +
      (Array.isArray(actual) ? ('[' + actual.join(', ') + ']') : actual) +
      ' ' + (this.relation || '!=') + ' ' +
      (Array.isArray(expected) ? ('[' + expected.join(', ') + ']') : expected) +
      ')';

  this.stack = (new Error()).stack;
}

DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = 'DimensionError';
DimensionError.prototype.isDimensionError = true;

module.exports = DimensionError;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.array = __webpack_require__(3);
exports['boolean'] = __webpack_require__(49);
exports['function'] = __webpack_require__(13);
exports.number = __webpack_require__(2);
exports.object = __webpack_require__(1);
exports.string = __webpack_require__(9);
exports.types = __webpack_require__(21);
exports.emitter = __webpack_require__(26);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.symbols = {
  // GREEK LETTERS
  Alpha: 'A',     alpha: '\\alpha',
  Beta: 'B',      beta: '\\beta',
  Gamma: '\\Gamma',    gamma: '\\gamma',
  Delta: '\\Delta',    delta: '\\delta',
  Epsilon: 'E',   epsilon: '\\epsilon',  varepsilon: '\\varepsilon',
  Zeta: 'Z',      zeta: '\\zeta',
  Eta: 'H',       eta: '\\eta',
  Theta: '\\Theta',    theta: '\\theta',    vartheta: '\\vartheta',
  Iota: 'I',      iota: '\\iota',
  Kappa: 'K',     kappa: '\\kappa',    varkappa: '\\varkappa',
  Lambda: '\\Lambda',   lambda: '\\lambda',
  Mu: 'M',        mu: '\\mu',
  Nu: 'N',        nu: '\\nu',
  Xi: '\\Xi',       xi: '\\xi',
  Omicron: 'O',   omicron: 'o',
  Pi: '\\Pi',       pi: '\\pi',       varpi: '\\varpi',
  Rho: 'P',       rho: '\\rho',      varrho: '\\varrho',
  Sigma: '\\Sigma',    sigma: '\\sigma',    varsigma: '\\varsigma',
  Tau: 'T',       tau: '\\tau',
  Upsilon: '\\Upsilon',  upsilon: '\\upsilon',
  Phi: '\\Phi',      phi: '\\phi',      varphi: '\\varphi',
  Chi: 'X',       chi: '\\chi',
  Psi: '\\Psi',      psi: '\\psi',
  Omega: '\\Omega',    omega: '\\omega',
  //logic
  'true': '\\mathrm{True}',
  'false': '\\mathrm{False}',
  //other
  i: 'i', //TODO use \i ??
  inf: '\\infty',
  Inf: '\\infty',
  infinity: '\\infty',
  Infinity: '\\infty',
  oo: '\\infty',
  lim: '\\lim',
  'undefined': '\\mathbf{?}'
};

exports.operators = {
  'transpose': '^\\top',
  'factorial': '!',
  'pow': '^',
  'dotPow': '.^\\wedge', //TODO find ideal solution
  'unaryPlus': '+',
  'unaryMinus': '-',
  'bitNot': '~', //TODO find ideal solution
  'not': '\\neg',
  'multiply': '\\cdot',
  'divide': '\\frac', //TODO how to handle that properly?
  'dotMultiply': '.\\cdot', //TODO find ideal solution
  'dotDivide': '.:', //TODO find ideal solution
  'mod': '\\mod',
  'add': '+',
  'subtract': '-',
  'to': '\\rightarrow',
  'leftShift': '<<',
  'rightArithShift': '>>',
  'rightLogShift': '>>>',
  'equal': '=',
  'unequal': '\\neq',
  'smaller': '<',
  'larger': '>',
  'smallerEq': '\\leq',
  'largerEq': '\\geq',
  'bitAnd': '\\&',
  'bitXor': '\\underline{|}',
  'bitOr': '|',
  'and': '\\wedge',
  'xor': '\\veebar',
  'or': '\\vee'
};

exports.defaultTemplate = '\\mathrm{${name}}\\left(${args}\\right)';

var units = {
  deg: '^\\circ'
};

//@param {string} name
//@param {boolean} isUnit
exports.toSymbol = function (name, isUnit) {
  isUnit = typeof isUnit === 'undefined' ? false : isUnit;
  if (isUnit) {
    if (units.hasOwnProperty(name)) {
      return units[name];
    }
    return '\\mathrm{' + name + '}';
  }

  if (exports.symbols.hasOwnProperty(name)) {
    return exports.symbols[name];
  }
  else if (name.indexOf('_') !== -1) {
    //symbol with index (eg. alpha_1)
    var index = name.indexOf('_');
    return exports.toSymbol(name.substring(0, index)) + '_{'
      + exports.toSymbol(name.substring(index + 1)) + '}';
  }
  return name;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nearlyEqual = __webpack_require__(2).nearlyEqual;
var bigNearlyEqual = __webpack_require__(15);

function factory (type, config, load, typed) {
  
  /**
   * Test whether two values are equal.
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit} x   First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex} y          Second value to compare
   * @return {boolean}                                                  Returns true when the compared values are equal, else returns false
   * @private
   */
  var equalScalar = typed('equalScalar', {

    'boolean, boolean': function (x, y) {
      return x === y;
    },

    'number, number': function (x, y) {
      return x === y || nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.eq(y) || bigNearlyEqual(x, y, config.epsilon);
    },

    'Fraction, Fraction': function (x, y) {
      return x.equals(y);
    },

    'Complex, Complex': function (x, y) {
      return x.equals(y);
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return equalScalar(x.value, y.value);
    },

    'string, string': function (x, y) {
      return x === y;
    }
  });
  
  return equalScalar;
}

exports.factory = factory;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clone = __webpack_require__(1).clone;

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, b). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, b)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij..z,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
   */
  var algorithm14 = function (a, b, callback, inverse) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    
    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }
    
    // populate cdata, iterate through dimensions
    var cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : [];

    // c matrix
    return new DenseMatrix({
      data: cdata,
      size: clone(asize),
      datatype: dt
    });
  };
  
  // recursive function
  var _iterate = function (f, level, s, n, av, bv, inverse) {
    // initialize array for this level
    var cv = [];
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (var i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = inverse ? f(bv, av[i]) : f(av[i], bv);
      }
    }
    else {
      // iterate current level
      for (var j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse);
      }
    }
    return cv;
  };

  return algorithm14;
}

exports.name = 'algorithm14';
exports.factory = factory;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var formatNumber = __webpack_require__(2).format;
var formatBigNumber = __webpack_require__(48).format;

/**
 * Test whether value is a string
 * @param {*} value
 * @return {boolean} isString
 */
exports.isString = function(value) {
  return typeof value === 'string';
};

/**
 * Check if a text ends with a certain string.
 * @param {string} text
 * @param {string} search
 */
exports.endsWith = function(text, search) {
  var start = text.length - search.length;
  var end = text.length;
  return (text.substring(start, end) === search);
};

/**
 * Format a value of any type into a string.
 *
 * Usage:
 *     math.format(value)
 *     math.format(value, precision)
 *
 * When value is a function:
 *
 * - When the function has a property `syntax`, it returns this
 *   syntax description.
 * - In other cases, a string `'function'` is returned.
 *
 * When `value` is an Object:
 *
 * - When the object contains a property `format` being a function, this
 *   function is invoked as `value.format(options)` and the result is returned.
 * - When the object has its own `toString` method, this method is invoked
 *   and the result is returned.
 * - In other cases the function will loop over all object properties and
 *   return JSON object notation like '{"a": 2, "b": 3}'.
 *
 * Example usage:
 *     math.format(2/7);                // '0.2857142857142857'
 *     math.format(math.pi, 3);         // '3.14'
 *     math.format(new Complex(2, 3));  // '2 + 3i'
 *     math.format('hello');            // '"hello"'
 *
 * @param {*} value             Value to be stringified
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {string} str
 */
exports.format = function(value, options) {
  if (typeof value === 'number') {
    return formatNumber(value, options);
  }

  if (value && value.isBigNumber === true) {
    return formatBigNumber(value, options);
  }

  if (value && value.isFraction === true) {
    if (!options || options.fraction !== 'decimal') {
      // output as ratio, like '1/3'
      return (value.s * value.n) + '/' + value.d;
    }
    else {
      // output as decimal, like '0.(3)'
      return value.toString();
    }
  }

  if (Array.isArray(value)) {
    return formatArray(value, options);
  }

  if (exports.isString(value)) {
    return '"' + value + '"';
  }

  if (typeof value === 'function') {
    return value.syntax ? String(value.syntax) : 'function';
  }

  if (value && typeof value === 'object') {
    if (typeof value.format === 'function') {
      return value.format(options);
    }
    else if (value && value.toString() !== {}.toString()) {
      // this object has a non-native toString method, use that one
      return value.toString();
    }
    else {
      var entries = [];

      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          entries.push('"' + key + '": ' + exports.format(value[key], options));
        }
      }

      return '{' + entries.join(', ') + '}';
    }
  }

  return String(value);
};

/**
 * Stringify a value into a string enclosed in double quotes.
 * Unescaped double quotes and backslashes inside the value are escaped.
 * @param {*} value
 * @return {string}
 */
exports.stringify = function (value) {
  var text = String(value);
  var escaped = '';
  var i = 0;
  while (i < text.length) {
    var c = text.charAt(i);

    if (c === '\\') {
      escaped += c;
      i++;

      c = text.charAt(i);
      if (c === '' || '"\\/bfnrtu'.indexOf(c) === -1) {
        escaped += '\\';  // no valid escape character -> escape it
      }
      escaped += c;
    }
    else if (c === '"') {
      escaped += '\\"';
    }
    else {
      escaped += c;
    }
    i++;
  }

  return '"' + escaped + '"';
}

/**
 * Escape special HTML characters
 * @param {*} value
 * @return {string}
 */
exports.escape = function (value) {
  var text = String(value);
  text = text.replace(/&/g, '&amp;')
			 .replace(/"/g, '&quot;')
			 .replace(/'/g, '&#39;')
			 .replace(/</g, '&lt;')
			 .replace(/>/g, '&gt;');
  
  return text;
}

/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @param {Object | number | Function} [options]  Formatting options. See
 *                                                lib/utils/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {string} str
 */
function formatArray (array, options) {
  if (Array.isArray(array)) {
    var str = '[';
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i != 0) {
        str += ', ';
      }
      str += formatArray(array[i], options);
    }
    str += ']';
    return str;
  }
  else {
    return exports.format(array, options);
  }
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(5);
var DimensionError = __webpack_require__(4);

var string = util.string,
    isString = string.isString;

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z). 
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Matrix}   b                 The DenseMatrix instance (B)
   * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  var algorithm13 = function (a, b, callback) {
    // a arrays
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b arrays
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // c arrays
    var csize = [];

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // validate each one of the dimension sizes
    for (var s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s])
        throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');
      // update dimension in c
      csize[s] = asize[s];
    }

    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // populate cdata, iterate through dimensions
    var cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : [];
    
    // c matrix
    return new DenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    });
  };
  
  // recursive function
  var _iterate = function (f, level, s, n, av, bv) {
    // initialize array for this level
    var cv = [];
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (var i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = f(av[i], bv[i]);
      }
    }
    else {
      // iterate current level
      for (var j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
      }
    }
    return cv;
  };
  
  return algorithm13;
}

exports.name = 'algorithm13';
exports.factory = factory;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(91);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

// function utils

/*
 * Memoize a given function by caching the computed result.
 * The cache of a memoized function can be cleared by deleting the `cache`
 * property of the function.
 *
 * @param {function} fn                     The function to be memoized.
 *                                          Must be a pure function.
 * @param {function(args: Array)} [hasher]  A custom hash builder.
 *                                          Is JSON.stringify by default.
 * @return {function}                       Returns the memoized function
 */
exports.memoize = function(fn, hasher) {
  return function memoize() {
    if (typeof memoize.cache !== 'object') {
      memoize.cache = {};
    }

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    var hash = hasher ? hasher(args) : JSON.stringify(args);
    if (!(hash in memoize.cache)) {
      return memoize.cache[hash] = fn.apply(fn, args);
    }
    return memoize.cache[hash];
  };
};

/**
 * Find the maximum number of arguments expected by a typed function.
 * @param {function} fn   A typed function
 * @return {number} Returns the maximum number of expected arguments.
 *                  Returns -1 when no signatures where found on the function.
 */
exports.maxArgumentCount = function (fn) {
  return Object.keys(fn.signatures || {})
      .reduce(function (args, signature) {
        var count = (signature.match(/,/g) || []).length + 1;
        return Math.max(args, count);
      }, -1);
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwnProperty = __webpack_require__(1).hasOwnProperty;

/**
 * Get a property of a plain object
 * Throws an error in case the object is not a plain object or the
 * property is not defined on the object itself
 * @param {Object} object
 * @param {string} prop
 * @return {*} Returns the property value when safe
 */
function getSafeProperty (object, prop) {
  // only allow getting properties of a plain object
  if (isPlainObject(object)) {
    // only allow getting properties defined on the object itself,
    // not inherited from it's prototype.
    if (hasOwnProperty(object, prop)) {
      return object[prop];
    }

    if (!(prop in object)) {
      // this is a not existing property on a plain object
      return undefined;
    }
  }

  if (typeof object[prop] === 'function' && isSafeMethod(object, prop)) {
    throw new Error('Cannot access method "' + prop + '" as a property');
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Set a property on a plain object.
 * Throws an error in case the object is not a plain object or the
 * property would override an inherited property like .constructor or .toString
 * @param {Object} object
 * @param {string} prop
 * @param {*} value
 * @return {*} Returns the value
 */
// TODO: merge this function into access.js?
function setSafeProperty (object, prop, value) {
  // only allow setting properties of a plain object
  if (isPlainObject(object)) {
    // only allow setting properties defined on the object itself,
    // not inherited from it's prototype.
    if (prop in object) {
      // property already exists
      // override when the property is defined on the object itself.
      // don't allow overriding inherited properties like .constructor or .toString
      if (hasOwnProperty(object, prop)) {
        return object[prop] = value;
      }
    }
    else {
      // this is a new property, that's just ok
      return object[prop] = value;
    }
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Test whether a property is safe to use for an object.
 * For example .toString and .constructor are not safe
 * @param {string} prop
 * @return {boolean} Returns true when safe
 */
function isSafeProperty (prop) {
  return !(prop in {});
}

/**
 * Validate whether a method is safe.
 * Throws an error when that's not the case.
 * @param {Object} object
 * @param {string} method
 */
// TODO: merge this function into assign.js?
function validateSafeMethod (object, method) {
  if (!isSafeMethod(object, method)) {
    throw new Error('No access to method "' + method + '"');
  }
}

/**
 * Check whether a method is safe.
 * Throws an error when that's not the case (for example for `constructor`).
 * @param {Object} object
 * @param {string} method
 * @return {boolean} Returns true when safe, false otherwise
 */
function isSafeMethod (object, method) {
  // test for plain functions defined on the object (instead of a method)
  if (hasOwnProperty(object, method)) {
    return isPlainObject(object);
  }
  else {
    // only allow methods:
    // - defined on the prototype of this object
    // - not defined on the prototype of native Object
    //   i.e. constructor, __defineGetter__, hasOwnProperty, etc. are not allowed
    // - calling methods on a function (like bind) is not allowed
    // - A few safe native methods are allowed: toString, valueOf, toLocaleString
    return (object && typeof object !== 'function' &&
        (hasOwnProperty(object.constructor.prototype, method) ||
            hasOwnProperty(object.__proto__, method)) &&
        (!hasOwnProperty(Object.prototype, method) || hasOwnProperty(safeNativeMethods, method)));
  }
}

function isPlainObject (object) {
  return typeof object === 'object' && object && object.constructor === Object;
}

var safeNativeMethods = {
  toString: true,
  valueOf: true,
  toLocaleString: true
};

exports.getSafeProperty = getSafeProperty;
exports.setSafeProperty = setSafeProperty;
exports.isSafeProperty = isSafeProperty;
exports.validateSafeMethod = validateSafeMethod;
exports.isSafeMethod = isSafeMethod;
exports.isPlainObject = isPlainObject;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Compares two BigNumbers.
 * @param {BigNumber} x       First value to compare
 * @param {BigNumber} y       Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
 */
module.exports = function nearlyEqual(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) {
    return x.eq(y);
  }


  // use "==" operator, handles infinities
  if (x.eq(y)) {
    return true;
  }

  // NaN
  if (x.isNaN() || y.isNaN()) {
    return false;
  }

  // at this point x and y should be finite
  if(x.isFinite() && y.isFinite()) {
    // check numbers are very close, needed when comparing numbers near zero
    var diff = x.minus(y).abs();
    if (diff.isZero()) {
      return true;
    }
    else {
      // use relative error
      var max = x.constructor.max(x.abs(), y.abs());
      return diff.lte(max.times(epsilon));
    }
  }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(1).extend;

function factory (type, config, load, typed) {

  var matrix = load(__webpack_require__(0));
  var addScalar = load(__webpack_require__(17));
  var latex = __webpack_require__(6);
  
  var algorithm01 = load(__webpack_require__(30));
  var algorithm04 = load(__webpack_require__(52));
  var algorithm10 = load(__webpack_require__(31));
  var algorithm13 = load(__webpack_require__(10));
  var algorithm14 = load(__webpack_require__(8));

  /**
   * Add two or more values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *    math.add(x, y, z, ...)
   *
   * Examples:
   *
   *    math.add(2, 3);               // returns number 5
   *    math.add(2, 3, 4);            // returns number 9
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(-4, 1);
   *    math.add(a, b);               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
   *
   *    var c = math.unit('5 cm');
   *    var d = math.unit('2.1 mm');
   *    math.add(c, d);               // returns Unit 52.1 mm
   *
   *    math.add("2.3", "4");         // returns number 6.3
   *
   * See also:
   *
   *    subtract, sum
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to add
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Sum of `x` and `y`
   */
  var add = typed('add', extend({
    // we extend the signatures of addScalar with signatures dealing with matrices

    'Matrix, Matrix': function (x, y) {
      // result
      var c;
      
      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm04(x, y, addScalar);
              break;
            default:
              // sparse + dense
              c = algorithm01(y, x, addScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm01(x, y, addScalar, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, addScalar);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return add(matrix(x), matrix(y)).valueOf();
    },
    
    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return add(matrix(x), y);
    },
    
    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return add(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm10(x, y, addScalar, false);
          break;
        default:
          c = algorithm14(x, y, addScalar, false);
          break;
      }
      return c;
    },
    
    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm10(y, x, addScalar, true);
          break;
        default:
          c = algorithm14(y, x, addScalar, true);
          break;
      }
      return c;
    },
    
    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, addScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, addScalar, true).valueOf();
    },

    'any, any': addScalar,

    'any, any, ...any': function (x, y, rest) {
      var result = add(x, y);

      for (var i = 0; i < rest.length; i++) {
        result = add(result, rest[i]);
      }

      return result;
    }
  }, addScalar.signatures));

  add.toTex = {
    2: '\\left(${args[0]}' + latex.operators['add'] + '${args[1]}\\right)'
  };
  
  return add;
}

exports.name = 'add';
exports.factory = factory;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory(type, config, load, typed) {

  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Sum of `x` and `y`
   * @private
   */
  var add = typed('add', {

    'number, number': function (x, y) {
      return x + y;
    },

    'Complex, Complex': function (x, y) {
      return x.add(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.plus(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.add(y);
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) throw new Error('Parameter x contains a unit with undefined value');
      if (y.value == null) throw new Error('Parameter y contains a unit with undefined value');
      if (!x.equalBase(y)) throw new Error('Units do not match');

      var res = x.clone();
      res.value = add(res.value, y.value);
      res.fixPrefix = false;
      return res;
    }
  });

  return add;
}

exports.factory = factory;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix items and invokes the callback function f(Dij, Sij).
   * Callback function invoked M*N times.
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  f(Dij, 0)    ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (C)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm03 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result (DenseMatrix)
    var cdata = [];

    // initialize dense matrix
    for (var z = 0; z < rows; z++) {
      // initialize row
      cdata[z] = [];
    }

    // workspace
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns in b
    for (var j = 0; j < columns; j++) {
      // column mark
      var mark = j + 1;
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = bindex[k];
        // update workspace
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      }
      // process workspace
      for (var y = 0; y < rows; y++) {
        // check we have a calculated value for current row
        if (w[y] === mark) {
          // use calculated value
          cdata[y][j] = x[y];
        }
        else {
          // calculate value
          cdata[y][j] = inverse ? cf(zero, adata[y][j]) : cf(adata[y][j], zero);
        }
      }
    }

    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  return algorithm03;
}

exports.name = 'algorithm03';
exports.factory = factory;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var extend = __webpack_require__(1).extend;
var array = __webpack_require__(3);

function factory (type, config, load, typed) {
  var latex = __webpack_require__(6);

  var matrix = load(__webpack_require__(0));
  var addScalar = load(__webpack_require__(17));
  var multiplyScalar = load(__webpack_require__(24));
  var equalScalar = load(__webpack_require__(7));

  var algorithm11 = load(__webpack_require__(64));
  var algorithm14 = load(__webpack_require__(8));
  
  var DenseMatrix = type.DenseMatrix;
  var SparseMatrix = type.SparseMatrix;

  /**
   * Multiply two or more values, `x * y`.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *    math.multiply(x, y, z, ...)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2);        // returns number 20.8
   *    math.multiply(2, 3, 4);       // returns number 24
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.multiply(a, b);          // returns Complex 5 + 14i
   *
   *    var c = [[1, 2], [4, 3]];
   *    var d = [[1, 2, 3], [3, -4, 7]];
   *    math.multiply(c, d);          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    var e = math.unit('2.1 km');
   *    math.multiply(3, e);          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide, prod, cross, dot
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x First value to multiply
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */
  var multiply = typed('multiply', extend({
    // we extend the signatures of multiplyScalar with signatures dealing with matrices

    'Array, Array': function (x, y) {
      // check dimensions
      _validateMatrixDimensions(array.size(x), array.size(y));

      // use dense matrix implementation
      var m = multiply(matrix(x), matrix(y));
      // return array or scalar
      return (m && m.isMatrix === true) ? m.valueOf() : m;
    },

    'Matrix, Matrix': function (x, y) {
      // dimensions
      var xsize = x.size();
      var ysize = y.size();

      // check dimensions
      _validateMatrixDimensions(xsize, ysize);

      // process dimensions
      if (xsize.length === 1) {
        // process y dimensions
        if (ysize.length === 1) {
          // Vector * Vector
          return _multiplyVectorVector(x, y, xsize[0]);
        }
        // Vector * Matrix
        return _multiplyVectorMatrix(x, y);
      }
      // process y dimensions
      if (ysize.length === 1) {
        // Matrix * Vector
        return _multiplyMatrixVector(x, y);
      }
      // Matrix * Matrix
      return _multiplyMatrixMatrix(x, y);
    },

    'Matrix, Array': function (x, y) {
      // use Matrix * Matrix implementation
      return multiply(x, matrix(y));
    },

    'Array, Matrix': function (x, y) {
      // use Matrix * Matrix implementation
      return multiply(matrix(x, y.storage()), y);
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      
      // process storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, multiplyScalar, false);
          break;
        case 'dense':
          c = algorithm14(x, y, multiplyScalar, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm11(y, x, multiplyScalar, true);
          break;
        case 'dense':
          c = algorithm14(y, x, multiplyScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, multiplyScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, multiplyScalar, true).valueOf();
    },

    'any, any': multiplyScalar,

    'any, any, ...any': function (x, y, rest) {
      var result = multiply(x, y);

      for (var i = 0; i < rest.length; i++) {
        result = multiply(result, rest[i]);
      }

      return result;
    }
  }, multiplyScalar.signatures));

  var _validateMatrixDimensions = function (size1, size2) {
    // check left operand dimensions
    switch (size1.length) {
      case 1:
        // check size2
        switch (size2.length) {
          case 1:
            // Vector x Vector
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vectors must have the same length');
            }
            break;
          case 2:
            // Vector x Matrix
            if (size1[0] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Vector length (' + size1[0] + ') must match Matrix rows (' + size2[0] + ')');
            }
            break;
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }
        break;
      case 2:
        // check size2
        switch (size2.length) {
          case 1:
            // Matrix x Vector
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix columns (' + size1[1] + ') must match Vector length (' + size2[0] + ')');
            }
            break;
          case 2:
            // Matrix x Matrix
            if (size1[1] !== size2[0]) {
              // throw error
              throw new RangeError('Dimension mismatch in multiplication. Matrix A columns (' + size1[1] + ') must match Matrix B rows (' + size2[0] + ')');
            }
            break;
          default:
            throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix B has ' + size2.length + ' dimensions)');
        }
        break;
      default:
        throw new Error('Can only multiply a 1 or 2 dimensional matrix (Matrix A has ' + size1.length + ' dimensions)');
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (N)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {number}             Scalar value
   */
  var _multiplyVectorVector = function (a, b, n) {
    // check empty vector
    if (n === 0)
      throw new Error('Cannot multiply two empty vectors');

    // a dense
    var adata = a._data;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }
    
    // result (do not initialize it with zero)
    var c = mf(adata[0], bdata[0]);
    // loop data
    for (var i = 1; i < n; i++) {
      // multiply and accumulate
      c = af(c, mf(adata[i], bdata[i]));
    }
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Matrix         (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  var _multiplyVectorMatrix = function (a, b) {
    // process storage
    switch (b.storage()) {
      case 'dense':
        return _multiplyVectorDenseMatrix(a, b);
    }
    throw new Error('Not implemented');
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Dense Vector   (M)
   * @param {Matrix} b            Dense Matrix   (MxN)
   *
   * @return {Matrix}             Dense Vector   (N)
   */
  var _multiplyVectorDenseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // rows & columns
    var alength = asize[0];
    var bcolumns = bsize[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }

    // result
    var c = [];

    // loop matrix columns
    for (var j = 0; j < bcolumns; j++) {
      // sum (do not initialize it with zero)
      var sum = mf(adata[0], bdata[0][j]);      
      // loop vector
      for (var i = 1; i < alength; i++) {
        // multiply & accumulate
        sum = af(sum, mf(adata[i], bdata[i][j]));
      }
      c[j] = sum;
    }

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [bcolumns],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Dense Vector   (N)
   *
   * @return {Matrix}             Dense Vector   (M)
   */
  var _multiplyMatrixVector = function (a, b) {
    // process storage
    switch (a.storage()) {
      case 'dense':
        return _multiplyDenseMatrixVector(a, b);
      case 'sparse':
        return _multiplySparseMatrixVector(a, b);
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            Matrix         (MxN)
   * @param {Matrix} b            Matrix         (NxC)
   *
   * @return {Matrix}             Matrix         (MxC)
   */
  var _multiplyMatrixMatrix = function (a, b) {
    // process storage
    switch (a.storage()) {
      case 'dense':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplyDenseMatrixDenseMatrix(a, b);
          case 'sparse':
            return _multiplyDenseMatrixSparseMatrix(a, b);
        }
        break;
      case 'sparse':
        // process storage
        switch (b.storage()) {
          case 'dense':
            return _multiplySparseMatrixDenseMatrix(a, b);
          case 'sparse':
            return _multiplySparseMatrixSparseMatrix(a, b);
        }
        break;
    }
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix  (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             Dense Vector (M) 
   */ 
  var _multiplyDenseMatrixVector = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }

    // result
    var c = [];

    // loop matrix a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // sum (do not initialize it with zero)
      var sum = mf(row[0], bdata[0]);
      // loop matrix a columns
      for (var j = 1; j < acolumns; j++) {
        // multiply & accumulate
        sum = af(sum, mf(row[j], bdata[j]));
      }
      c[i] = sum;
    }

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [arows],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            DenseMatrix    (NxC)
   *
   * @return {Matrix}             DenseMatrix    (MxC)
   */
  var _multiplyDenseMatrixDenseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b dense
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    // rows & columns
    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }
    
    // result
    var c = [];

    // loop matrix a rows
    for (var i = 0; i < arows; i++) {
      // current row
      var row = adata[i];
      // initialize row array
      c[i] = [];
      // loop matrix b columns
      for (var j = 0; j < bcolumns; j++) {
        // sum (avoid initializing sum to zero)
        var sum = mf(row[0], bdata[0][j]);
        // loop matrix a columns
        for (var x = 1; x < acolumns; x++) {
          // multiply & accumulate
          sum = af(sum, mf(row[x], bdata[x][j]));
        }
        c[i][j] = sum;
      }
    }

    // return matrix
    return new DenseMatrix({
      data: c,
      size: [arows, bcolumns],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            DenseMatrix    (MxN)
   * @param {Matrix} b            SparseMatrix   (NxC)
   *
   * @return {Matrix}             SparseMatrix   (MxC)
   */
  var _multiplyDenseMatrixSparseMatrix = function (a, b) {
    // a dense
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;
    // validate b matrix
    if (!bvalues)
      throw new Error('Cannot multiply Dense Matrix times Pattern only Matrix');
    // rows & columns
    var arows = asize[0];
    var bcolumns = bsize[1];
    
    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;
    // equalScalar signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
    }

    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // indeces in column jb
      var kb0 = bptr[jb];
      var kb1 = bptr[jb + 1];
      // do not process column jb if no data exists
      if (kb1 > kb0) {
        // last row mark processed
        var last = 0;
        // loop a rows
        for (var i = 0; i < arows; i++) {
          // column mark
          var mark = i + 1;
          // C[i, jb]
          var cij;
          // values in b column j
          for (var kb = kb0; kb < kb1; kb++) {
            // row
            var ib = bindex[kb];
            // check value has been initialized
            if (last !== mark) {
              // first value in column jb
              cij = mf(adata[i][ib], bvalues[kb]);
              // update mark
              last = mark;
            }
            else {
              // accumulate value
              cij = af(cij, mf(adata[i][ib], bvalues[kb]));
            }
          }
          // check column has been processed and value != 0
          if (last === mark && !eq(cij, zero)) {
            // push row & value
            cindex.push(i);
            cvalues.push(cij);
          }
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // return sparse matrix
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix    (MxN)
   * @param {Matrix} b            Dense Vector (N)
   *
   * @return {Matrix}             SparseMatrix    (M, 1) 
   */
  var _multiplySparseMatrixVector = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // validate a matrix
    if (!avalues)
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    
    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;
    // equalScalar signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
    }

    // workspace
    var x = [];
    // vector with marks indicating a value x[i] exists in a given column
    var w = [];

    // update ptr
    cptr[0] = 0;
    // rows in b
    for (var ib = 0; ib < brows; ib++) {
      // b[ib]
      var vbi = bdata[ib];
      // check b[ib] != 0, avoid loops
      if (!eq(vbi, zero)) {
        // A values & index in ib column
        for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          // a row
          var ia = aindex[ka];
          // check value exists in current j
          if (!w[ia]) {
            // ia is new entry in j
            w[ia] = true;
            // add i to pattern of C
            cindex.push(ia);
            // x(ia) = A
            x[ia] = mf(vbi, avalues[ka]);
          }
          else {
            // i exists in C already
            x[ia] = af(x[ia], mf(vbi, avalues[ka]));
          }
        }
      }
    }
    // copy values from x to column jb of c
    for (var p1 = cindex.length, p = 0; p < p1; p++) {
      // row
      var ic = cindex[p];
      // copy value
      cvalues[p] = x[ic];
    }
    // update ptr
    cptr[1] = cindex.length;

    // return sparse matrix
    return new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1],
      datatype: dt
    });
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            DenseMatrix       (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  var _multiplySparseMatrixDenseMatrix = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // validate a matrix
    if (!avalues)
      throw new Error('Cannot multiply Pattern only Matrix times Dense Matrix');
    // b dense
    var bdata = b._data;
    var bdt = b._datatype;
    // rows & columns
    var arows = a._size[0];
    var brows = b._size[0];
    var bcolumns = b._size[1];

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;
    // equalScalar signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
    }

    // result
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });

    // workspace
    var x = [];
    // vector with marks indicating a value x[i] exists in a given column
    var w = [];

    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // mark in workspace for current column
      var mark = jb + 1;
      // rows in jb
      for (var ib = 0; ib < brows; ib++) {
        // b[ib, jb]
        var vbij = bdata[ib][jb];
        // check b[ib, jb] != 0, avoid loops
        if (!eq(vbij, zero)) {
          // A values & index in ib column
          for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // a row
            var ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
              // x(ia) = A
              x[ia] = mf(vbij, avalues[ka]);
            }
            else {
              // i exists in C already
              x[ia] = af(x[ia], mf(vbij, avalues[ka]));
            }
          }
        }
      }
      // copy values from x to column jb of c
      for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
        // row
        var ic = cindex[p];
        // copy value
        cvalues[p] = x[ic];
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // return sparse matrix
    return c;
  };

  /**
   * C = A * B
   *
   * @param {Matrix} a            SparseMatrix      (MxN)
   * @param {Matrix} b            SparseMatrix      (NxC)
   *
   * @return {Matrix}             SparseMatrix      (MxC)
   */
  var _multiplySparseMatrixSparseMatrix = function (a, b) {
    // a sparse
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    // b sparse
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bdt = b._datatype;
    
    // rows & columns
    var arows = a._size[0];
    var bcolumns = b._size[1];
    // flag indicating both matrices (a & b) contain data
    var values = avalues && bvalues;

    // datatype
    var dt;
    // addScalar signature to use
    var af = addScalar;
    // multiplyScalar signature to use
    var mf = multiplyScalar;

    // process data types
    if (adt && bdt && adt === bdt && typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signatures that matches (dt, dt)
      af = typed.find(addScalar, [dt, dt]);
      mf = typed.find(multiplyScalar, [dt, dt]);
    }
    
    // result
    var cvalues = values ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // c matrix
    var c = new SparseMatrix({
      values : cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });

    // workspace
    var x = values ? [] : undefined;
    // vector with marks indicating a value x[i] exists in a given column
    var w = [];
    // variables
    var ka, ka0, ka1, kb, kb0, kb1, ia, ib;
    // loop b columns
    for (var jb = 0; jb < bcolumns; jb++) {
      // update ptr
      cptr[jb] = cindex.length;
      // mark in workspace for current column
      var mark = jb + 1;
      // B values & index in j
      for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        // b row
        ib = bindex[kb];
        // check we need to process values
        if (values) {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
              // x(ia) = A
              x[ia] = mf(bvalues[kb], avalues[ka]);
            }
            else {
              // i exists in C already
              x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]));
            }
          }
        }
        else {
          // loop values in a[:,ib]
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            // row
            ia = aindex[ka];
            // check value exists in current j
            if (w[ia] !== mark) {
              // ia is new entry in j
              w[ia] = mark;
              // add i to pattern of C
              cindex.push(ia);
            }
          }
        }
      }
      // check we need to process matrix values (pattern matrix)
      if (values) {
        // copy values from x to column jb of c
        for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          // row
          var ic = cindex[p];
          // copy value
          cvalues[p] = x[ic];
        }
      }
    }
    // update ptr
    cptr[bcolumns] = cindex.length;

    // return sparse matrix
    return c;
  };

  multiply.toTex = {
    2: '\\left(${args[0]}' + latex.operators['multiply'] + '${args[1]}\\right)'
  };

  return multiply;
}

exports.name = 'multiply';
exports.factory = factory;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(5);

var string = util.string;

var isString = string.isString;

function factory (type, config, load, typed) {
  /**
   * @constructor Matrix
   *
   * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
   * array. A matrix can be constructed as:
   *     var matrix = math.matrix(data)
   *
   * Matrix contains the functions to resize, get and set values, get the size,
   * clone the matrix and to convert the matrix to a vector, array, or scalar.
   * Furthermore, one can iterate over the matrix using map and forEach.
   * The internal Array of the Matrix can be accessed using the function valueOf.
   *
   * Example usage:
   *     var matrix = math.matrix([[1, 2], [3, 4]]);
   *     matix.size();              // [2, 2]
   *     matrix.resize([3, 2], 5);
   *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
   *     matrix.subset([1,2])       // 3 (indexes are zero-based)
   *
   */
  function Matrix() {
    if (!(this instanceof Matrix)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
  }

  /**
   * Attach type information
   */
  Matrix.prototype.type = 'Matrix';
  Matrix.prototype.isMatrix = true;

  /**
   * Get the Matrix storage constructor for the given format.
   *
   * @param {string} format       The Matrix storage format.
   *
   * @return {Function}           The Matrix storage constructor.
   */
  Matrix.storage = function (format) {
    // check storage format is a string
    if (!isString(format)) {
      throw new TypeError('format must be a string value');
    }

    // get storage format constructor
    var constructor = Matrix._storage[format];
    if (!constructor) {
      throw new SyntaxError('Unsupported matrix storage format: ' + format);
    }

    // return storage constructor
    return constructor;
  };

  // a map with all constructors for all storage types
  Matrix._storage = {};

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     var format = matrix.storage()                   // retrieve storage format
   *
   * @return {string}           The storage format.
   */
  Matrix.prototype.storage = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke storage on a Matrix interface');
  };
  
  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     var format = matrix.datatype()                   // retrieve matrix datatype
   *
   * @return {string}           The datatype.
   */
  Matrix.prototype.datatype = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke datatype on a Matrix interface');
  };

  /**
   * Create a new Matrix With the type of the current matrix instance
   * @param {Array | Object} data
   * @param {string} [datatype]
   */
  Matrix.prototype.create = function (data, datatype) {
    throw new Error('Cannot invoke create on a Matrix interface');
  };

  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     var subset = matrix.subset(index)               // retrieve subset
   *     var value = matrix.subset(index, replacement)   // replace subset
   *
   * @param {Index} index
   * @param {Array | Matrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  Matrix.prototype.subset = function (index, replacement, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke subset on a Matrix interface');
  };

  /**
   * Get a single element from the matrix.
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */
  Matrix.prototype.get = function (index) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke get on a Matrix interface');
  };

  /**
   * Replace a single element in the matrix.
   * @param {number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be left undefined.
   * @return {Matrix} self
   */
  Matrix.prototype.set = function (index, value, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke set on a Matrix interface');
  };

  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when 
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @param {number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  Matrix.prototype.resize = function (size, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke resize on a Matrix interface');
  };

  /**
   * Reshape the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (reshape in place).
   *
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */
  Matrix.prototype.reshape = function (size, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke reshape on a Matrix interface');
  };

  /**
   * Create a clone of the matrix
   * @return {Matrix} clone
   */
  Matrix.prototype.clone = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke clone on a Matrix interface');
  };

  /**
   * Retrieve the size of the matrix.
   * @returns {number[]} size
   */
  Matrix.prototype.size = function() {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke size on a Matrix interface');
  };

  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {Matrix} matrix
   */
  Matrix.prototype.map = function (callback, skipZeros) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke map on a Matrix interface');
  };

  /**
   * Execute a callback function on each entry of the matrix.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */
  Matrix.prototype.forEach = function (callback) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke forEach on a Matrix interface');
  };

  /**
   * Create an Array with a copy of the data of the Matrix
   * @returns {Array} array
   */
  Matrix.prototype.toArray = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke toArray on a Matrix interface');
  };

  /**
   * Get the primitive value of the Matrix: a multidimensional array
   * @returns {Array} array
   */
  Matrix.prototype.valueOf = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke valueOf on a Matrix interface');
  };

  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  Matrix.prototype.format = function (options) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke format on a Matrix interface');
  };

  /**
   * Get a string representation of the matrix
   * @returns {string} str
   */
  Matrix.prototype.toString = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke toString on a Matrix interface');
  };
   
  // exports
  return Matrix;
}

exports.name = 'Matrix';
exports.path = 'type';
exports.factory = factory;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determine the type of a variable
 *
 *     type(x)
 *
 * The following types are recognized:
 *
 *     'undefined'
 *     'null'
 *     'boolean'
 *     'number'
 *     'string'
 *     'Array'
 *     'Function'
 *     'Date'
 *     'RegExp'
 *     'Object'
 *
 * @param {*} x
 * @return {string} Returns the name of the type. Primitive types are lower case,
 *                  non-primitive types are upper-camel-case.
 *                  For example 'number', 'string', 'Array', 'Date'.
 */
exports.type = function(x) {
  var type = typeof x;

  if (type === 'object') {
    if (x === null)           return 'null';
    if (Array.isArray(x))     return 'Array';
    if (x instanceof Date)    return 'Date';
    if (x instanceof RegExp)  return 'RegExp';
    if (x instanceof Boolean) return 'boolean';
    if (x instanceof Number)  return 'number';
    if (x instanceof String)  return 'string';

    return 'Object';
  }

  if (type === 'function')    return 'Function';

  return type;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked MxN times.
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  f(0, b)    ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm12 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }
    
    // result arrays
    var cdata = [];
    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k];
        // update workspace
        x[r] = avalues[k];
        w[r] = mark;
      }
      // loop rows
      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = [];
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        }
        else {
          // dense matrix value @ i, j
          cdata[i][j] = inverse ? cf(b, 0) : cf(0, b);
        }
      }
    }

    // return sparse matrix
    return c;
  };
  
  return algorithm12;
}

exports.name = 'algorithm12';
exports.factory = factory;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var deepMap = __webpack_require__(63);

function factory (type, config, load, typed) {
  var latex = __webpack_require__(6);

  /**
   * Inverse the sign of a value, apply a unary minus operation.
   *
   * For matrices, the function is evaluated element wise. Boolean values and
   * strings will be converted to a number. For complex numbers, both real and
   * complex value are inverted.
   *
   * Syntax:
   *
   *    math.unaryMinus(x)
   *
   * Examples:
   *
   *    math.unaryMinus(3.5);      // returns -3.5
   *    math.unaryMinus(-4.2);     // returns 4.2
   *
   * See also:
   *
   *    add, subtract, unaryPlus
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Number to be inverted.
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
   */
  var unaryMinus = typed('unaryMinus', {
    'number': function (x) {
      return -x;
    },

    'Complex': function (x) {
      return x.neg();
    },

    'BigNumber': function (x) {
      return x.neg();
    },

    'Fraction': function (x) {
      return x.neg();
    },

    'Unit': function (x) {
      var res = x.clone();
      res.value = unaryMinus(x.value);
      return res;
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since unaryMinus(0) = 0
      return deepMap(x, unaryMinus, true);
    }

    // TODO: add support for string
  });

  unaryMinus.toTex = {
    1: latex.operators['unaryMinus'] + '\\left(${args[0]}\\right)'
  };

  return unaryMinus;
}

exports.name = 'unaryMinus';
exports.factory = factory;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory(type, config, load, typed) {
  
  /**
   * Multiply two scalar values, `x * y`.
   * This function is meant for internal use: it is used by the public function
   * `multiply`
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to multiply
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Multiplication of `x` and `y`
   * @private
   */
  var multiplyScalar = typed('multiplyScalar', {

    'number, number': function (x, y) {
      return x * y;
    },

    'Complex, Complex': function (x, y) {
      return x.mul(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.times(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.mul(y);
    },

    'number | Fraction | BigNumber | Complex, Unit': function (x, y) {
      var res = y.clone();
      res.value = (res.value === null) ? res._normalize(x) : multiplyScalar(res.value, x);
      return res;
    },

    'Unit, number | Fraction | BigNumber | Complex': function (x, y) {
      var res = x.clone();
      res.value = (res.value === null) ? res._normalize(y) : multiplyScalar(res.value, y);
      return res;
    },

    'Unit, Unit': function (x, y) {
      return x.multiply(y);
    }

  });

  return multiplyScalar;
}

exports.factory = factory;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nearlyEqual = __webpack_require__(2).nearlyEqual;
var bigNearlyEqual = __webpack_require__(15);

function factory (type, config, load, typed) {

  var matrix = load(__webpack_require__(0));

  var algorithm03 = load(__webpack_require__(18));
  var algorithm05 = load(__webpack_require__(35));
  var algorithm12 = load(__webpack_require__(22));
  var algorithm13 = load(__webpack_require__(10));
  var algorithm14 = load(__webpack_require__(8));
  
  /**
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * x and y are considered equal when the relative difference between x and y
   * is smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.compare(x, y)
   *
   * Examples:
   *
   *    math.compare(6, 1);           // returns 1
   *    math.compare(2, 3);           // returns -1
   *    math.compare(7, 7);           // returns 0
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('40 mm');
   *    math.compare(a, b);           // returns 1
   *
   *    math.compare(2, [1, 2, 3]);   // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compareNatural
   *
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} y Second value to compare
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the result of the comparison: 1, 0 or -1.
   */
  var compare = typed('compare', {

    'boolean, boolean': function (x, y) {
      return x === y ? 0 : (x > y ? 1 : -1);
    },

    'number, number': function (x, y) {
      return (x === y || nearlyEqual(x, y, config.epsilon))
          ? 0
          : (x > y ? 1 : -1);
    },

    'BigNumber, BigNumber': function (x, y) {
      return (x.eq(y) || bigNearlyEqual(x, y, config.epsilon))
          ? new type.BigNumber(0)
          : new type.BigNumber(x.cmp(y));
    },

    'Fraction, Fraction': function (x, y) {
      return new type.Fraction(x.compare(y));
    },

    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return compare(x.value, y.value);
    },

    'string, string': function (x, y) {
      return x === y ? 0 : (x > y ? 1 : -1);
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm05(x, y, compare);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, compare, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, compare, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, compare);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return compare(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return compare(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return compare(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm12(x, y, compare, false);
          break;
        default:
          c = algorithm14(x, y, compare, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, compare, true);
          break;
        default:
          c = algorithm14(y, x, compare, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, compare, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, compare, true).valueOf();
    }
  });

  compare.toTex = undefined; // use default template

  return compare;
}

exports.name = 'compare';
exports.factory = factory;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var Emitter = __webpack_require__(44);

/**
 * Extend given object with emitter functions `on`, `off`, `once`, `emit`
 * @param {Object} obj
 * @return {Object} obj
 */
exports.mixin = function (obj) {
  // create event emitter
  var emitter = new Emitter();

  // bind methods to obj (we don't want to expose the emitter.e Array...)
  obj.on   = emitter.on.bind(emitter);
  obj.off  = emitter.off.bind(emitter);
  obj.once = emitter.once.bind(emitter);
  obj.emit = emitter.emit.bind(emitter);

  return obj;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {string} fn     Function name
 * @param {number} count  Actual argument count
 * @param {number} min    Minimum required argument count
 * @param {number} [max]  Maximum required argument count
 * @extends Error
 */
function ArgumentsError(fn, count, min, max) {
  if (!(this instanceof ArgumentsError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.fn = fn;
  this.count = count;
  this.min = min;
  this.max = max;

  this.message = 'Wrong number of arguments in function ' + fn +
      ' (' + count + ' provided, ' +
      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

  this.stack = (new Error()).stack;
}

ArgumentsError.prototype = new Error();
ArgumentsError.prototype.constructor = Error;
ArgumentsError.prototype.name = 'ArgumentsError';
ArgumentsError.prototype.isArgumentsError = true;

module.exports = ArgumentsError;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Create a range error with the message:
 *     'Index out of range (index < min)'
 *     'Index out of range (index < max)'
 *
 * @param {number} index     The actual index
 * @param {number} [min=0]   Minimum index (included)
 * @param {number} [max]     Maximum index (excluded)
 * @extends RangeError
 */
function IndexError(index, min, max) {
  if (!(this instanceof IndexError)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.index = index;
  if (arguments.length < 3) {
    this.min = 0;
    this.max = min;
  }
  else {
    this.min = min;
    this.max = max;
  }

  if (this.min !== undefined && this.index < this.min) {
    this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
  }
  else if (this.max !== undefined && this.index >= this.max) {
    this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
  }
  else {
    this.message = 'Index out of range (' + this.index + ')';
  }

  this.stack = (new Error()).stack;
}

IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = 'IndexError';
IndexError.prototype.isIndexError = true;

module.exports = IndexError;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(5);
var DimensionError = __webpack_require__(4);
var getSafeProperty = __webpack_require__(14).getSafeProperty;
var setSafeProperty = __webpack_require__(14).setSafeProperty;

var string = util.string;
var array = util.array;
var object = util.object;
var number = util.number;

var isArray = Array.isArray;
var isNumber = number.isNumber;
var isInteger = number.isInteger;
var isString = string.isString;

var validateIndex = array.validateIndex;

function factory (type, config, load, typed) {
  var Matrix = load(__webpack_require__(20)); // force loading Matrix (do not use via type.Matrix)

  /**
   * Dense Matrix implementation. A regular, dense matrix, supporting multi-dimensional matrices. This is the default matrix type.
   * @class DenseMatrix
   */
  function DenseMatrix(data, datatype) {
    if (!(this instanceof DenseMatrix))
      throw new SyntaxError('Constructor must be called with the new operator');
    if (datatype && !isString(datatype))
      throw new Error('Invalid datatype: ' + datatype);

    if (data && data.isMatrix === true) {
      // check data is a DenseMatrix
      if (data.type === 'DenseMatrix') {
        // clone data & size
        this._data = object.clone(data._data);
        this._size = object.clone(data._size);
        this._datatype = datatype || data._datatype;
      }
      else {
        // build data from existing matrix
        this._data = data.toArray();
        this._size = data.size();
        this._datatype = datatype || data._datatype;
      }
    }
    else if (data && isArray(data.data) && isArray(data.size)) {
      // initialize fields from JSON representation
      this._data = data.data;
      this._size = data.size;
      this._datatype = datatype || data.datatype;
    }
    else if (isArray(data)) {
      // replace nested Matrices with Arrays
      this._data = preprocess(data);
      // get the dimensions of the array
      this._size = array.size(this._data);
      // verify the dimensions of the array, TODO: compute size while processing array
      array.validate(this._data, this._size);
      // data type unknown
      this._datatype = datatype;
    }
    else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._data = [];
      this._size = [0];
      this._datatype = datatype;
    }
  }
  
  DenseMatrix.prototype = new Matrix();

  /**
   * Attach type information
   */
  DenseMatrix.prototype.type = 'DenseMatrix';
  DenseMatrix.prototype.isDenseMatrix = true;

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     var format = matrix.storage()                   // retrieve storage format
   *
   * @memberof DenseMatrix
   * @return {string}           The storage format.
   */
  DenseMatrix.prototype.storage = function () {
    return 'dense';
  };

  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     var format = matrix.datatype()                   // retrieve matrix datatype
   *
   * @memberof DenseMatrix
   * @return {string}           The datatype.
   */
  DenseMatrix.prototype.datatype = function () {
    return this._datatype;
  };

  /**
   * Create a new DenseMatrix
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {string} [datatype]
   */
  DenseMatrix.prototype.create = function (data, datatype) {
    return new DenseMatrix(data, datatype);
  };

  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     var subset = matrix.subset(index)               // retrieve subset
   *     var value = matrix.subset(index, replacement)   // replace subset
   *
   * @memberof DenseMatrix
   * @param {Index} index
   * @param {Array | DenseMatrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  DenseMatrix.prototype.subset = function (index, replacement, defaultValue) {
    switch (arguments.length) {
      case 1:
        return _get(this, index);

        // intentional fall through
      case 2:
      case 3:
        return _set(this, index, replacement, defaultValue);

      default:
        throw new SyntaxError('Wrong number of arguments');
    }
  };
  
  /**
   * Get a single element from the matrix.
   * @memberof DenseMatrix
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */
  DenseMatrix.prototype.get = function (index) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

    // check index
    for (var x = 0; x < index.length; x++)
      validateIndex(index[x], this._size[x]);

    var data = this._data;
    for (var i = 0, ii = index.length; i < ii; i++) {
      var index_i = index[i];
      validateIndex(index_i, data.length);
      data = data[index_i];
    }

    return data;
  };
  
  /**
   * Replace a single element in the matrix.
   * @memberof DenseMatrix
   * @param {number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be left undefined.
   * @return {DenseMatrix} self
   */
  DenseMatrix.prototype.set = function (index, value, defaultValue) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length < this._size.length)
      throw new DimensionError(index.length, this._size.length, '<');

    var i, ii, index_i;

    // enlarge matrix when needed
    var size = index.map(function (i) {
      return i + 1;
    });
    _fit(this, size, defaultValue);

    // traverse over the dimensions
    var data = this._data;
    for (i = 0, ii = index.length - 1; i < ii; i++) {
      index_i = index[i];
      validateIndex(index_i, data.length);
      data = data[index_i];
    }

    // set new value
    index_i = index[index.length - 1];
    validateIndex(index_i, data.length);
    data[index_i] = value;

    return this;
  };
  
  /**
   * Get a submatrix of this matrix
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix
   * @param {Index} index   Zero-based index
   * @private
   */
  function _get (matrix, index) {
    if (!index || index.isIndex !== true) {
      throw new TypeError('Invalid index');
    }

    var isScalar = index.isScalar();
    if (isScalar) {
      // return a scalar
      return matrix.get(index.min());
    }
    else {
      // validate dimensions
      var size = index.size();
      if (size.length != matrix._size.length) {
        throw new DimensionError(size.length, matrix._size.length);
      }

      // validate if any of the ranges in the index is out of range
      var min = index.min();
      var max = index.max();
      for (var i = 0, ii = matrix._size.length; i < ii; i++) {
        validateIndex(min[i], matrix._size[i]);
        validateIndex(max[i], matrix._size[i]);
      }

      // retrieve submatrix
      // TODO: more efficient when creating an empty matrix and setting _data and _size manually
      return new DenseMatrix(_getSubmatrix(matrix._data, index, size.length, 0), matrix._datatype);
    }
  }
  
  /**
   * Recursively get a submatrix of a multi dimensional matrix.
   * Index is not checked for correct number or length of dimensions.
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {Index} index
   * @param {number} dims   Total number of dimensions
   * @param {number} dim    Current dimension
   * @return {Array} submatrix
   * @private
   */
  function _getSubmatrix (data, index, dims, dim) {
    var last = (dim === dims - 1);
    var range = index.dimension(dim);

    if (last) {
      return range.map(function (i) {
        validateIndex(i, data.length);
        return data[i];
      }).valueOf();
    }
    else {
      return range.map(function (i) {
        validateIndex(i, data.length);
        var child = data[i];
        return _getSubmatrix(child, index, dims, dim + 1);
      }).valueOf();
    }
  }
  
  /**
   * Replace a submatrix in this matrix
   * Indexes are zero-based.
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix
   * @param {Index} index
   * @param {DenseMatrix | Array | *} submatrix
   * @param {*} defaultValue          Default value, filled in on new entries when
   *                                  the matrix is resized.
   * @return {DenseMatrix} matrix
   * @private
   */
  function _set (matrix, index, submatrix, defaultValue) {
    if (!index || index.isIndex !== true) {
      throw new TypeError('Invalid index');
    }

    // get index size and check whether the index contains a single value
    var iSize = index.size(),
        isScalar = index.isScalar();

    // calculate the size of the submatrix, and convert it into an Array if needed
    var sSize;
    if (submatrix && submatrix.isMatrix === true) {
      sSize = submatrix.size();
      submatrix = submatrix.valueOf();
    }
    else {
      sSize = array.size(submatrix);
    }

    if (isScalar) {
      // set a scalar

      // check whether submatrix is a scalar
      if (sSize.length !== 0) {
        throw new TypeError('Scalar expected');
      }

      matrix.set(index.min(), submatrix, defaultValue);
    }
    else {
      // set a submatrix

      // validate dimensions
      if (iSize.length < matrix._size.length) {
        throw new DimensionError(iSize.length, matrix._size.length, '<');
      }

      if (sSize.length < iSize.length) {
        // calculate number of missing outer dimensions
        var i = 0;
        var outer = 0;
        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }
        while (iSize[i] === 1) {
          outer++;
          i++;
        }

        // unsqueeze both outer and inner dimensions
        submatrix = array.unsqueeze(submatrix, iSize.length, outer, sSize);
      }

      // check whether the size of the submatrix matches the index size
      if (!object.deepEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, '>');
      }

      // enlarge matrix when needed
      var size = index.max().map(function (i) {
        return i + 1;
      });
      _fit(matrix, size, defaultValue);

      // insert the sub matrix
      var dims = iSize.length,
          dim = 0;
      _setSubmatrix (matrix._data, index, submatrix, dims, dim);
    }

    return matrix;
  }
  
  /**
   * Replace a submatrix of a multi dimensional matrix.
   * @memberof DenseMatrix
   * @param {Array} data
   * @param {Index} index
   * @param {Array} submatrix
   * @param {number} dims   Total number of dimensions
   * @param {number} dim
   * @private
   */
  function _setSubmatrix (data, index, submatrix, dims, dim) {
    var last = (dim === dims - 1),
        range = index.dimension(dim);

    if (last) {
      range.forEach(function (dataIndex, subIndex) {
        validateIndex(dataIndex);
        data[dataIndex] = submatrix[subIndex[0]];
      });
    }
    else {
      range.forEach(function (dataIndex, subIndex) {
        validateIndex(dataIndex);
        _setSubmatrix(data[dataIndex], index, submatrix[subIndex[0]], dims, dim + 1);
      });
    }
  }
  
  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @memberof DenseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  DenseMatrix.prototype.resize = function (size, defaultValue, copy) {
    // validate arguments
    if (!isArray(size))
      throw new TypeError('Array expected');

    // matrix to resize
    var m = copy ? this.clone() : this;
    // resize matrix
    return _resize(m, size, defaultValue);
  };
  
  var _resize = function (matrix, size, defaultValue) {
    // check size
    if (size.length === 0) {
      // first value in matrix
      var v = matrix._data;
      // go deep
      while (isArray(v)) {
        v = v[0];
      }
      return v;
    }
    // resize matrix
    matrix._size = size.slice(0); // copy the array
    matrix._data = array.resize(matrix._data, matrix._size, defaultValue);
    // return matrix
    return matrix;
  };

  /**
   * Reshape the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (reshape in place).
   *
   * NOTE: This might be better suited to copy by default, instead of modifying
   *       in place. For now, it operates in place to remain consistent with
   *       resize().
   *
   * @memberof DenseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */
  DenseMatrix.prototype.reshape = function (size, copy) {
    var m = copy ? this.clone() : this;

    m._data = array.reshape(m._data, size);
    m._size = size.slice(0);
    return m;
  };
  
  /**
   * Enlarge the matrix when it is smaller than given size.
   * If the matrix is larger or equal sized, nothing is done.
   * @memberof DenseMatrix
   * @param {DenseMatrix} matrix           The matrix to be resized
   * @param {number[]} size
   * @param {*} defaultValue          Default value, filled in on new entries.
   * @private
   */
  function _fit(matrix, size, defaultValue) {
    var newSize = matrix._size.slice(0), // copy the array
        changed = false;

    // add dimensions when needed
    while (newSize.length < size.length) {
      newSize.push(0);
      changed = true;
    }

    // enlarge size when needed
    for (var i = 0, ii = size.length; i < ii; i++) {
      if (size[i] > newSize[i]) {
        newSize[i] = size[i];
        changed = true;
      }
    }

    if (changed) {
      // resize only when size is changed
      _resize(matrix, newSize, defaultValue);
    }
  }
  
  /**
   * Create a clone of the matrix
   * @memberof DenseMatrix
   * @return {DenseMatrix} clone
   */
  DenseMatrix.prototype.clone = function () {
    var m = new DenseMatrix({
      data: object.clone(this._data),
      size: object.clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  
  /**
   * Retrieve the size of the matrix.
   * @memberof DenseMatrix
   * @returns {number[]} size
   */
  DenseMatrix.prototype.size = function() {
    return this._size.slice(0); // return a clone of _size
  };
  
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @memberof DenseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   *
   * @return {DenseMatrix} matrix
   */
  DenseMatrix.prototype.map = function (callback) {
    // matrix instance
    var me = this;
    var recurse = function (value, index) {
      if (isArray(value)) {
        return value.map(function (child, i) {
          return recurse(child, index.concat(i));
        });
      }
      else {
        return callback(value, index, me);
      }
    };
    // return dense format
    return new DenseMatrix({
      data: recurse(this._data, []),
      size: object.clone(this._size),
      datatype: this._datatype
    });
  };
  
  /**
   * Execute a callback function on each entry of the matrix.
   * @memberof DenseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */
  DenseMatrix.prototype.forEach = function (callback) {
    // matrix instance
    var me = this;
    var recurse = function (value, index) {
      if (isArray(value)) {
        value.forEach(function (child, i) {
          recurse(child, index.concat(i));
        });
      }
      else {
        callback(value, index, me);
      }
    };
    recurse(this._data, []);
  };
  
  /**
   * Create an Array with a copy of the data of the DenseMatrix
   * @memberof DenseMatrix
   * @returns {Array} array
   */
  DenseMatrix.prototype.toArray = function () {
    return object.clone(this._data);
  };
  
  /**
   * Get the primitive value of the DenseMatrix: a multidimensional array
   * @memberof DenseMatrix
   * @returns {Array} array
   */
  DenseMatrix.prototype.valueOf = function () {
    return this._data;
  };
  
  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @memberof DenseMatrix
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  DenseMatrix.prototype.format = function (options) {
    return string.format(this._data, options);
  };
  
  /**
   * Get a string representation of the matrix
   * @memberof DenseMatrix
   * @returns {string} str
   */
  DenseMatrix.prototype.toString = function () {
    return string.format(this._data);
  };
  
  /**
   * Get a JSON representation of the matrix
   * @memberof DenseMatrix
   * @returns {Object}
   */
  DenseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'DenseMatrix',
      data: this._data,
      size: this._size,
      datatype: this._datatype
    };
  };
  
  /**
   * Get the kth Matrix diagonal.
   *
   * @memberof DenseMatrix
   * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Array}                      The array vector with the diagonal values.
   */
  DenseMatrix.prototype.diagonal = function(k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (k.isBigNumber === true)
        k = k.toNumber();
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('The parameter k must be an integer number');
      }
    }
    else {
      // default value
      k = 0;
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];

    // number diagonal values
    var n = Math.min(rows - kSub, columns -  kSuper);
    
    // x is a matrix get diagonal from matrix
    var data = [];
    
    // loop rows
    for (var i = 0; i < n; i++) {
      data[i] = this._data[i + kSub][i + kSuper];
    }

    // create DenseMatrix
    return new DenseMatrix({
      data: data,
      size: [n],
      datatype: this._datatype
    });
  };
  
  /**
   * Create a diagonal matrix.
   *
   * @memberof DenseMatrix
   * @param {Array} size                   The matrix size.
   * @param {number | Array} value          The values for the diagonal.
   * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will be filled in.
   * @param {number} [defaultValue]        The default value for non-diagonal
   *
   * @returns {DenseMatrix}
   */
  DenseMatrix.diagonal = function (size, value, k, defaultValue, datatype) {
    if (!isArray(size))
      throw new TypeError('Array expected, size parameter');
    if (size.length !== 2)
      throw new Error('Only two dimensions matrix are supported');

    // map size & validate
    size = size.map(function (s) {
      // check it is a big number
      if (s && s.isBigNumber === true) {
        // convert it
        s = s.toNumber();
      }
      // validate arguments
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error('Size values must be positive integers');
      } 
      return s;
    });

    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (k && k.isBigNumber === true)
        k = k.toNumber();
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('The parameter k must be an integer number');
      }
    }
    else {
      // default value
      k = 0;
    }
    
    if (defaultValue && isString(datatype)) {
      // convert defaultValue to the same datatype
      defaultValue = typed.convert(defaultValue, datatype);
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    
    // rows and columns
    var rows = size[0];
    var columns = size[1];

    // number of non-zero items
    var n = Math.min(rows - kSub, columns -  kSuper);

    // value extraction function
    var _value;

    // check value
    if (isArray(value)) {
      // validate array
      if (value.length !== n) {
        // number of values in array must be n
        throw new Error('Invalid value array length');
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value[i];
      };      
    }
    else if (value && value.isMatrix === true) {
      // matrix size
      var ms = value.size();
      // validate matrix
      if (ms.length !== 1 || ms[0] !== n) {
        // number of values in array must be n
        throw new Error('Invalid matrix length');
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value.get([i]);
      };
    }
    else {
      // define function
      _value = function () {
        // return value
        return value;
      };
    }
    
    // discover default value if needed
    if (!defaultValue) {
      // check first value in array
      defaultValue = (_value(0) && _value(0).isBigNumber === true) ? new type.BigNumber(0) : 0;
    }

    // empty array
    var data = [];

    // check we need to resize array
    if (size.length > 0) {
      // resize array
      data = array.resize(data, size, defaultValue);
      // fill diagonal
      for (var d = 0; d < n; d++) {
        data[d + kSub][d + kSuper] = _value(d);
      }
    }
    
    // create DenseMatrix
    return new DenseMatrix({
      data: data,
      size: [rows, columns]
    });
  };

  /**
   * Generate a matrix from a JSON object
   * @memberof DenseMatrix
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "DenseMatrix", data: [], size: []}`,
   *                       where mathjs is optional
   * @returns {DenseMatrix}
   */
  DenseMatrix.fromJSON = function (json) {
    return new DenseMatrix(json);
  };
  
  /**
   * Swap rows i and j in Matrix.
   *
   * @memberof DenseMatrix
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */
  DenseMatrix.prototype.swapRows = function (i, j) {
    // check index
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error('Row index must be positive integers');
    }
    // check dimensions
    if (this._size.length !== 2) {
      throw new Error('Only two dimensional matrix is supported');
    }
    // validate index
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]);

    // swap rows
    DenseMatrix._swapRows(i, j, this._data);
    // return current instance
    return this;
  };

  /**
   * Swap rows i and j in Dense Matrix data structure.
   *
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   */
  DenseMatrix._swapRows = function (i, j, data) {
    // swap values i <-> j
    var vi = data[i];
    data[i] = data[j];
    data[j] = vi;
  };

  /**
   * Preprocess data, which can be an Array or DenseMatrix with nested Arrays and
   * Matrices. Replaces all nested Matrices with Arrays
   * @memberof DenseMatrix
   * @param {Array} data
   * @return {Array} data
   */
  function preprocess(data) {
    for (var i = 0, ii = data.length; i < ii; i++) {
      var elem = data[i];
      if (isArray(elem)) {
        data[i] = preprocess(elem);
      }
      else if (elem && elem.isMatrix === true) {
        data[i] = preprocess(elem.valueOf());
      }
    }

    return data;
  }

  // register this type in the base class Matrix
  type.Matrix._storage.dense = DenseMatrix;
  type.Matrix._storage['default'] = DenseMatrix;

  // exports
  return DenseMatrix;
}

exports.name = 'DenseMatrix';
exports.path = 'type';
exports.factory = factory;
exports.lazy = false;  // no lazy loading, as we alter type.Matrix._storage


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij). 
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  Dij          ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  var algorithm01 = function (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    // sparse matrix arrays
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues)
      throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // process data types
    var dt = typeof adt === 'string' && adt === bdt ? adt : undefined;
    // callback function
    var cf = dt ? typed.find(callback, [dt, dt]) : callback;

    // vars
    var i, j;
    
    // result (DenseMatrix)
    var cdata = [];
    // initialize c
    for (i = 0; i < rows; i++)
      cdata[i] = [];      
    
    // workspace
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns in b
    for (j = 0; j < columns; j++) {
      // column mark
      var mark = j + 1;
      // values in column j
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k];
        // update workspace
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        // mark i as updated
        w[i] = mark;
      }
      // loop rows
      for (i = 0; i < rows; i++) {
        // check row is in workspace
        if (w[i] === mark) {
          // c[i][j] was already calculated
          cdata[i][j] = x[i];
        }
        else {
          // item does not exist in S
          cdata[i][j] = adata[i][j];
        }
      }
    }

    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  
  return algorithm01;
}

exports.name = 'algorithm01';
exports.factory = factory;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  b          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm10 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cdata = [];
    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var x = [];
    // marks indicating we have a value in x for a given column
    var w = [];

    // loop columns
    for (var j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var r = aindex[k];
        // update workspace
        x[r] = avalues[k];
        w[r] = mark;
      }
      // loop rows
      for (var i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = [];
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        }
        else {
          // dense matrix value @ i, j
          cdata[i][j] = b;
        }
      }
    }

    // return sparse matrix
    return c;
  };

  return algorithm10;
}

exports.name = 'algorithm10';
exports.factory = factory;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nearlyEqual = __webpack_require__(2).nearlyEqual;
var bigNearlyEqual = __webpack_require__(15);

function factory (type, config, load, typed) {

  var matrix = load(__webpack_require__(0));

  var algorithm03 = load(__webpack_require__(18));
  var algorithm07 = load(__webpack_require__(33));
  var algorithm12 = load(__webpack_require__(22));
  var algorithm13 = load(__webpack_require__(10));
  var algorithm14 = load(__webpack_require__(8));

  var latex = __webpack_require__(6);

  /**
   * Test whether value x is smaller than y.
   *
   * The function returns true when x is smaller than y and the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.smaller(x, y)
   *
   * Examples:
   *
   *    math.smaller(2, 3);            // returns true
   *    math.smaller(5, 2 * 2);        // returns false
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('2 inch');
   *    math.smaller(a, b);            // returns true
   *
   * See also:
   *
   *    equal, unequal, smallerEq, smaller, smallerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */
  var smaller = typed('smaller', {

    'boolean, boolean': function (x, y) {
      return x < y;
    },

    'number, number': function (x, y) {
      return x < y && !nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.lt(y) && !bigNearlyEqual(x, y, config.epsilon);
    },

    'Fraction, Fraction': function (x, y) {
      return x.compare(y) === -1;
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return smaller(x.value, y.value);
    },

    'string, string': function (x, y) {
      return x < y;
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm07(x, y, smaller);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, smaller, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, smaller, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, smaller);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return smaller(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return smaller(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return smaller(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm12(x, y, smaller, false);
          break;
        default:
          c = algorithm14(x, y, smaller, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, smaller, true);
          break;
        default:
          c = algorithm14(y, x, smaller, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, smaller, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, smaller, true).valueOf();
    }
  });

  smaller.toTex = {
    2: '\\left(${args[0]}' + latex.operators['smaller'] + '${args[1]}\\right)'
  };

  return smaller;
}

exports.name = 'smaller';
exports.factory = factory;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {

  var DenseMatrix = type.DenseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B items (zero and nonzero) and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MxN times.
   *
   * C(i,j) = f(Aij, Bij)
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm07 = function (a, b, callback) {
    // sparse matrix arrays
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // vars
    var i, j;
    
    // result arrays
    var cdata = [];
    // initialize c
    for (i = 0; i < rows; i++)
      cdata[i] = [];

    // matrix
    var c = new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var xa = [];
    var xb = [];
    // marks indicating we have a value in x for a given column
    var wa = [];
    var wb = [];

    // loop columns
    for (j = 0; j < columns; j++) {
      // columns mark
      var mark = j + 1;
      // scatter the values of A(:,j) into workspace
      _scatter(a, j, wa, xa, mark);
      // scatter the values of B(:,j) into workspace
      _scatter(b, j, wb, xb, mark);
      // loop rows
      for (i = 0; i < rows; i++) {
        // matrix values @ i,j
        var va = wa[i] === mark ? xa[i] : zero;
        var vb = wb[i] === mark ? xb[i] : zero;
        // invoke callback
        cdata[i][j] = cf(va, vb);
      }          
    }

    // return sparse matrix
    return c;
  };
  
  var _scatter = function (m, j, w, x, mark) {
    // a arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // loop values in column j
    for (var k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
      // row
      var i = index[k];
      // update workspace
      w[i] = mark;
      x[i] = values[k];
    }
  };
  
  return algorithm07;
}

exports.name = 'algorithm07';
exports.factory = factory;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {
  var latex = __webpack_require__(6);

  var matrix = load(__webpack_require__(0));
  var addScalar = load(__webpack_require__(17));
  var unaryMinus = load(__webpack_require__(23));

  var algorithm01 = load(__webpack_require__(30));
  var algorithm03 = load(__webpack_require__(18));
  var algorithm05 = load(__webpack_require__(35));
  var algorithm10 = load(__webpack_require__(31));
  var algorithm13 = load(__webpack_require__(10));
  var algorithm14 = load(__webpack_require__(8));

  // TODO: split function subtract in two: subtract and subtractScalar

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2);        // returns number 3.3
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.subtract(a, b);          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4);  // returns Array [1, 3, 0]
   *
   *    var c = math.unit('2.1 km');
   *    var d = math.unit('500m');
   *    math.subtract(c, d);          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  var subtract = typed('subtract', {

    'number, number': function (x, y) {
      return x - y;
    },

    'Complex, Complex': function (x, y) {
      return x.sub(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.minus(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.sub(y);
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value == null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value = subtract(res.value, y.value);
      res.fixPrefix = false;

      return res;
    },
    
    'Matrix, Matrix': function (x, y) {
      // matrix sizes
      var xsize = x.size();
      var ysize = y.size();

      // check dimensions
      if (xsize.length !== ysize.length)
        throw new DimensionError(xsize.length, ysize.length);

      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse - sparse
              c = algorithm05(x, y, subtract);
              break;
            default:
              // sparse - dense
              c = algorithm03(y, x, subtract, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense - sparse
              c = algorithm01(x, y, subtract, false);
              break;
            default:
              // dense - dense
              c = algorithm13(x, y, subtract);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return subtract(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return subtract(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          // algorithm 7 is faster than 9 since it calls f() for nonzero items only!
          c = algorithm10(x, unaryMinus(y), addScalar);
          break;
        default:
          c = algorithm14(x, y, subtract);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm10(y, x, subtract, true);
          break;
        default:
          c = algorithm14(y, x, subtract, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, subtract, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, subtract, true).valueOf();
    }
  });

  subtract.toTex = {
    2: '\\left(${args[0]}' + latex.operators['subtract'] + '${args[1]}\\right)'
  };

  return subtract;
}

exports.name = 'subtract';
exports.factory = factory;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {

  var equalScalar = load(__webpack_require__(7));
  
  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 || B(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm05 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // workspaces
    var xa = cvalues ? [] : undefined;
    var xb = cvalues ? [] : undefined;
    // marks indicating we have a value in x for a given column
    var wa = [];
    var wb = [];

    // vars
    var i, j, k, k1;
    
    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // columns mark
      var mark = j + 1;
      // loop values A(:,j)
      for (k = aptr[j], k1 = aptr[j + 1]; k < k1; k++) {
        // row
        i = aindex[k];
        // push index
        cindex.push(i);
        // update workspace
        wa[i] = mark;
        // check we need to process values
        if (xa)
          xa[i] = avalues[k];
      }
      // loop values B(:,j)
      for (k = bptr[j], k1 = bptr[j + 1]; k < k1; k++) {
        // row
        i = bindex[k];
        // check row existed in A
        if (wa[i] !== mark) {
          // push index
          cindex.push(i);
        }
        // update workspace
        wb[i] = mark;
        // check we need to process values
        if (xb)
          xb[i] = bvalues[k];
      }
      // check we need to process values (non pattern matrix)
      if (cvalues) {
        // initialize first index in j
        k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          i = cindex[k];
          // marks
          var wai = wa[i];
          var wbi = wb[i];
          // check Aij or Bij are nonzero
          if (wai === mark || wbi === mark) {
            // matrix values @ i,j
            var va = wai === mark ? xa[i] : zero;
            var vb = wbi === mark ? xb[i] : zero;
            // Cij
            var vc = cf(va, vb);
            // check for zero
            if (!eq(vc, zero)) {
              // push value
              cvalues.push(vc);
              // increment pointer
              k++;
            }
            else {
              // remove value @ i, do not increment pointer
              cindex.splice(k, 1);
            }
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };

  return algorithm05;
}

exports.name = 'algorithm05';
exports.factory = factory;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(5);
var object = util.object;
var string = util.string;

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));
  var add = load(__webpack_require__(16));
  var subtract = load(__webpack_require__(34));
  var multiply = load(__webpack_require__(19));
  var unaryMinus = load(__webpack_require__(23));

  /**
   * Calculate the determinant of a matrix.
   *
   * Syntax:
   *
   *    math.det(x)
   *
   * Examples:
   *
   *    math.det([[1, 2], [3, 4]]); // returns -2
   *
   *    var A = [
   *      [-2, 2, 3],
   *      [-1, 1, 3],
   *      [2, 0, -1]
   *    ]
   *    math.det(A); // returns 6
   *
   * See also:
   *
   *    inv
   *
   * @param {Array | Matrix} x  A matrix
   * @return {number} The determinant of `x`
   */
  var det = typed('det', {
    'any': function (x) {
      return object.clone(x);
    },

    'Array | Matrix': function det (x) {
      var size;
      if (x && x.isMatrix === true) {
        size = x.size();
      }
      else if (Array.isArray(x)) {
        x = matrix(x);
        size = x.size();
      }
      else {
        // a scalar
        size = [];
      }

      switch (size.length) {
        case 0:
          // scalar
          return object.clone(x);

        case 1:
          // vector
          if (size[0] == 1) {
            return object.clone(x.valueOf()[0]);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }

        case 2:
          // two dimensional array
          var rows = size[0];
          var cols = size[1];
          if (rows == cols) {
            return _det(x.clone().valueOf(), rows, cols);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + string.format(size) + ')');
      }
    }
  });

  det.toTex = {1: '\\det\\left(${args[0]}\\right)'};

  return det;

  /**
   * Calculate the determinant of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @param {number} rows     Number of rows of the matrix (zero-based)
   * @param {number} cols     Number of columns of the matrix (zero-based)
   * @returns {number} det
   * @private
   */
  function _det (matrix, rows, cols) {
    if (rows == 1) {
      // this is a 1 x 1 matrix
      return object.clone(matrix[0][0]);
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
      return subtract(
          multiply(matrix[0][0], matrix[1][1]),
          multiply(matrix[1][0], matrix[0][1])
      );
    }
    else {
      // this is an n x n matrix
      var compute_mu = function (matrix) {
        var i, j;

        // Compute the matrix with zero lower triangle, same upper triangle,
        // and diagonals given by the negated sum of the below diagonal
        // elements.
        var mu = new Array(matrix.length);
        var sum = 0;
        for (i = 1; i < matrix.length; i++) {
          sum = add(sum, matrix[i][i]);
        }

        for (i = 0; i < matrix.length; i++) {
          mu[i] = new Array(matrix.length);
          mu[i][i] = unaryMinus(sum);

          for (j = 0; j < i; j++) {
            mu[i][j] = 0; // TODO: make bignumber 0 in case of bignumber computation
          }

          for (j = i + 1; j < matrix.length; j++) {
            mu[i][j] = matrix[i][j];
          }

          if (i+1 < matrix.length) {
            sum = subtract(sum, matrix[i + 1][i + 1]);
          }
        }

        return mu;
      };

      var fa = matrix;
      for (var i = 0; i < rows - 1; i++) {
        fa = multiply(compute_mu(fa), matrix);
      }

      if (rows % 2 == 0) {
        return unaryMinus(fa[0][0]);
      } else {
        return fa[0][0];
      }
    }
  }
}

exports.name = 'det';
exports.factory = factory;



/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array = __webpack_require__(3);
var isInteger = __webpack_require__(2).isInteger;

function factory (type, config, load, typed) {
  
  var matrix = load(__webpack_require__(0));
  
  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n.
   * The matrix has ones on the diagonal and zeros elsewhere.
   *
   * Syntax:
   *
   *    math.eye(n)
   *    math.eye(n, format)
   *    math.eye(m, n)
   *    math.eye(m, n, format)
   *    math.eye([m, n])
   *    math.eye([m, n], format)
   *
   * Examples:
   *
   *    math.eye(3);                    // returns [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
   *    math.eye(3, 2);                 // returns [[1, 0], [0, 1], [0, 0]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.eye(math.size(A));         // returns [[1, 0, 0], [0, 1, 0]]
   *
   * See also:
   *
   *    diag, ones, zeros, size, range
   *
   * @param {...number | Matrix | Array} size   The size for the matrix
   * @param {string} [format]                   The Matrix storage format
   *
   * @return {Matrix | Array | number} A matrix with ones on the diagonal.
   */
  var eye = typed('eye', {
    '': function () {
      return (config.matrix === 'Matrix') ? matrix([]) : [];
    },

    'string': function (format) {
      return matrix(format);
    },

    'number | BigNumber': function (rows) {
      return _eye(rows, rows, config.matrix === 'Matrix' ? 'default' : undefined);
    },
    
    'number | BigNumber, string': function (rows, format) {
      return _eye(rows, rows, format);
    },

    'number | BigNumber, number | BigNumber': function (rows, cols) {
      return _eye(rows, cols, config.matrix === 'Matrix' ? 'default' : undefined);
    },
    
    'number | BigNumber, number | BigNumber, string': function (rows, cols, format) {
      return _eye(rows, cols, format);
    },

    'Array':  function (size) {
      return _eyeVector(size);
    },
    
    'Array, string':  function (size, format) {
      return _eyeVector(size, format);
    },

    'Matrix': function (size) {
      return _eyeVector(size.valueOf(), size.storage());
    },
    
    'Matrix, string': function (size, format) {
      return _eyeVector(size.valueOf(), format);
    }
  });

  eye.toTex = undefined; // use default template

  return eye;

  function _eyeVector (size, format) {
    switch (size.length) {
      case 0: return format ? matrix(format) : [];
      case 1: return _eye(size[0], size[0], format);
      case 2: return _eye(size[0], size[1], format);
      default: throw new Error('Vector containing two values expected');
    }
  }

  /**
   * Create an identity matrix
   * @param {number | BigNumber} rows
   * @param {number | BigNumber} cols
   * @param {string} [format]
   * @returns {Matrix}
   * @private
   */
  function _eye (rows, cols, format) {
    // BigNumber constructor with the right precision
    var Big = (rows && rows.isBigNumber === true)
        ? type.BigNumber
        : (cols && cols.isBigNumber === true)
            ? type.BigNumber
            : null;

    if (rows && rows.isBigNumber === true) rows = rows.toNumber();
    if (cols && cols.isBigNumber === true) cols = cols.toNumber();

    if (!isInteger(rows) || rows < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
    if (!isInteger(cols) || cols < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
    
    var one = Big ? new type.BigNumber(1) : 1;
    var defaultValue = Big ? new Big(0) : 0;
    var size = [rows, cols];
    
    // check we need to return a matrix
    if (format) {
      // get matrix storage constructor
      var F = type.Matrix.storage(format);
      // create diagonal matrix (use optimized implementation for storage format)
      return F.diagonal(size, one, 0, defaultValue);
    }
    
    // create and resize array
    var res = array.resize([], size, defaultValue);
    // fill in ones on the diagonal
    var minimum = rows < cols ? rows : cols;
    // fill diagonal
    for (var d = 0; d < minimum; d++) {
      res[d][d] = one;
    }
    return res;
  }
}

exports.name = 'eye';
exports.factory = factory;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mathjs_core__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mathjs_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mathjs_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_css__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tag_tables_css__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tag_tables_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__tag_tables_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__export_table_css__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__export_table_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__export_table_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vex_css__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vex_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__vex_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vex_theme_flat_attack_css__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vex_theme_flat_attack_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__vex_theme_flat_attack_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vex_js__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vex_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_vex_js__);

/*jshint esversion: 6 */
/* jshint node: true */


let math = __WEBPACK_IMPORTED_MODULE_0_mathjs_core___default.a.create();
math.import(__webpack_require__(47));
math.import(__webpack_require__(60));








 __WEBPACK_IMPORTED_MODULE_6_vex_js___default.a.registerPlugin(__webpack_require__(101));
__WEBPACK_IMPORTED_MODULE_6_vex_js___default.a.defaultOptions.className = 'vex-theme-flat-attack';

const _ = {
  find_id: function(id) {
    return globals.LABELS.find((ele) => {return ele.id === parseInt(id);});
  },
  remove_id: function(id) {
    return globals.LABELS.splice(globals.LABELS.findIndex(
      (ele) => {return ele.id === parseInt(id);}
      ), 1);
  }
};

const canvasBuffer = __webpack_require__(102);
const electron = __webpack_require__(38);

// My own imports
const Canvas_Helper = __webpack_require__(103);

class Label {
  constructor(id, x=null, y=null, title, caption='', defect=0,
  src, image) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.title = title;
    this.caption = caption;
    this.defect = defect;
    this.image_src = src;
    this.image = image;
  }

  toggle_defect() {
    this.defect = (this.defect + 1) % 3;
    globals.CVS.draw_canvas();
  }
}

let globals = {
  BUILDING : '',  
  FLOOR : '',                   
  KEYS : [],
  LABELS : [],
  ID : 1,
  CVS : null
};

let vue = new Vue({
  el: '.wrapper',
  data: {
    seen: true,
    labels: globals.LABELS,
    preview_src: './assets/placeholder.png'
  },
  methods: {
    defect_src: function (label) {
      return (label.defect == 0 ? './assets/green_heart.png' : label.defect ===
      1 ? './assets/yellow_diam.png' : './assets/red_exclam.png')
    },
    show: function() {
      this.seen = true;
    },
    hide: function() {
      this.seen = false;
    },
    upload_plan: function(files) {
      console.log(files);
      upload_plan(files);
    },
    upload_images: function(files) {
      upload_images(files);
    },
    export_image: function(file) {
      export_image(file);
    },

    // The following functions are for the tables
    toggle_defect: function(label) {
      label.toggle_defect();
    },
    edit_label_name: function(e_target) {
      edit_name(e_target)
    },
    handle_mousedown: function(e) {
      handle_mousedown(e);
    },
    handle_mouseover: function(label, index) {
       this.preview_src = label.image_src; 
    },
    delete_row: function(label) {
      delete_row(label.id) 
    }
  }
})

function init() {
  // Set canvas dimensions
  let canvas = document.getElementById('c');
  console.log(window.innerWidth);
  window.addEventListener('resize', () => {
    console.log('called');
    if (window.innerWidth === 1920) {
      canvas.width = 1400;
      canvas.height = 900;
    }
    else if (window.innerWidth > 1400) {
      canvas.width = 1000;
      canvas.height = 707;
    }
    else {
      canvas.width = 800;
      canvas.height = 566;
    }
  })
  let img = new Image();
  img.src = './assets/canvas_placeholder.png';
  let ctx = document.getElementById('c').getContext('2d');
  // Set the Canvas helper context to the global canvas context
  globals.CVS = new Canvas_Helper(canvas, [1,0,0,1,0,0], globals, img);
  // This line is necessary: set cvs.labels to point to the global object LABELS
  globals.CVS.globals_ = globals;
  canvas.addEventListener('wheel', globals.CVS.handle_scroll.bind(globals.CVS));
  globals.CVS.draw_canvas();
  window.onkeyup = (e) => {
    globals.KEYS[e.keyCode] = false;
  };
  window.onkeydown = (e) => {
    globals.KEYS[e.keyCode] = true;
    if (e.keyCode === 37) { globals.CVS.pan_left(50); }
    else if (e.keyCode === 38) { globals.CVS.pan_up(50); }
    else if (e.keyCode === 39) { globals.CVS.pan_right(50); }
    else if (e.keyCode === 40) { globals.CVS.pan_down(50); }
  };
  // Handling the reply when we send the exported floor plan
  electron.ipcRenderer.on('export_image', (e, args) => {
    __WEBPACK_IMPORTED_MODULE_6_vex_js___default.a.dialog.alert(args);
  })
}


function edit_name(e) {
  __WEBPACK_IMPORTED_MODULE_6_vex_js___default.a.dialog.open({
    message: 'Enter new name for label:',
    input: '<input type="text" name="label_name" placeholder="Label name"/>',
    callback: (val) => {
      val = val.label_name;
      if (val !== '' && val !== undefined) {
        e.target.value = val;
        const id = e.target.closest('tr').id;
        const label = _.find_id(id);
        label.title = val.toString();
        globals.CVS.draw_canvas();
        //draw_table(globals.LABELS);
      }
    }
  });
}

function delete_row(id) {
  _.remove_id(parseInt(id));
  globals.CVS.draw_canvas();
  //draw_table(globals.LABELS);
}


function handle_mousedown(evt) {
  /*
  let math = {
    reshape: (m, dim) => {
      let n = [];
      for (let y = 0; y < (dim[0]); y++) {
        let row = [];
        for (let x = 0; x < (dim[1]); x++) {
           row.push(m[y*x]); 
        }
        n.push(row)
      }
      return n
    },
    inv: (m) => {
      return m
    }
  }
  */
  // Matrix multiplication of affine transformation vector and mouse 
  // vector. Augmentation is required: see
  // https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
  /*
  [x' y' 1] = [1 0 Tx
                0 1 Ty
                0 0 1 ] [x y 1]
  */

  // These 6 lines take up 500Kb.... ridiculous
  let t = globals.CVS.transform;
  t = math.reshape([t[0], t[2], t[4], t[1], t[3], t[5]], [2,3]);
  t = math.reshape(t.concat(0,0,1), [3,3]);
  const inv = math.inv(t);

  let clicked_x = evt.offsetX * inv[0][0] + evt.offsetY * inv[0][1] + inv[0][2];
  let clicked_y = evt.offsetX * inv[1][0] + evt.offsetY * inv[1][1] + inv[1][2];

  // If right click, go to tag editing mode
  if (evt.button === 2 || evt.shiftKey) {
    __WEBPACK_IMPORTED_MODULE_6_vex_js___default.a.dialog.prompt({
      message: 'Enter ID of label: ',
      callback: (value) => {
        let label = _.find_id(parseInt(value));
        if (label !== undefined) {
          label.x = clicked_x;
          label.y = clicked_y;
          globals.CVS.draw_canvas();
        }
      }
    })
  }

  // If the left mouse button was clicked, find the first label that has yet to
  // be tagged on the floor plan
  else if (evt.button === 0) {
    let label = globals.LABELS.find( (label) => {return label.x === null});
    let new_label = true;

    const draw_ratio = globals.CVS.draw_ratio;
    // WARNING //
    const font_size = 60 / draw_ratio; 
    // We must do that so that ctx.measureText can work
    globals.CVS.context.font = `${font_size}px sans-serif`;
    // Watch out: every time I tweak font size in Canvas.js, I need to change
    // this

    for (let label of globals.LABELS) {
      const wid = globals.CVS.context.measureText(label.title).width;
      const ht = font_size;
      const l_w = (wid + 10/draw_ratio)
      const l_h = (ht + 10/draw_ratio)
      const lx = label.x - l_w/2;
      const uy = label.y - l_h/2;
      const rx = label.x + l_w + l_w/2;
      const ly = label.y + l_h/2;
      //console.log(lx, clicked_x, rx);
      //console.log(uy, clicked_y, ly);
      
      if (clicked_x > lx && clicked_x < rx && 
          clicked_y > uy && clicked_y < ly)
      {
        //console.log('Label found', label);
        vue._data.preview_src = label.image_src;
        new_label = false;
        break;
      }
      console.log('No label found');
    }
  
    if (label !== undefined && new_label === true) {
      label.x = clicked_x;
      label.y = clicked_y;
      globals.CVS.draw_canvas();

      // Show the next image in preview
      let next_label = _.find_id(parseInt(label.id + 1));
      if (next_label !== undefined) {
        console.log(vue._data);
        console.log(next_label.id);
        vue._data.preview_src = next_label.image_src;
      }
    }
  }

  else {
    //There should be nothing here
  }
}

function upload_plan(file_list) {
  const plan_img = file_list[0];
  let img = new Image();
  img.onload = () => {
    __WEBPACK_IMPORTED_MODULE_6_vex_js___default.a.dialog.open({
      message: 'Enter building letter and floor',
      input: [
        "<input name='letter' type='text' placeholder='Letter'/>",
        "<input name='floor' type='number' placeholder='Floor'/>",
      ].join(''),
      callback: (data) => {
        globals.CVS.image = img
        globals.BUILDING = data.letter;
        globals.FLOOR = data.floor;
        update_labels(globals.LABELS);
        globals.CVS.draw_canvas();
        //draw_table(globals.LABELS);
        }
    })
  };
  img.src = URL.createObjectURL(plan_img);
}

function upload_images(file_list) {
  // FileList has no method map nor forEach
  for (let i = 0; i < file_list.length; i++) {
    const file = file_list[i];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      globals.LABELS.push(new Label(
        globals.ID,
        null,
        null, 
        globals.BUILDING + globals.FLOOR + '-' + (globals.ID).toString(),
        '',
        0,
        reader.result,
        file_list[i]
      ));
      globals.ID++;
      globals.CVS.draw_canvas();
      //draw_table(globals.LABELS);
    });
    reader.readAsDataURL(file);
  }
}

function update_labels(labels) {
  labels.map( (label) => {
    label.title = `${globals.BUILDING}${globals.FLOOR}-${label.id}`;
  })
}
function export_image(e) {
  const export_canvas = document.createElement('canvas');
  export_canvas.height = 3000;
  export_canvas.width = Math.round(export_canvas.height * Math.sqrt(2));
  const ctx = export_canvas.getContext('2d');
  ctx.clearRect(0, 0, export_canvas.height, export_canvas.width); 

  // Rescale image such that the largest dimension of the image fits nicely
  const working_height = export_canvas.height - 200;
  const working_width = export_canvas.width - 200;
  const max_x = globals.CVS.image.width;
  const max_y = globals.CVS.image.height;
  let ratio = 1;

  let xratio = working_width / max_x;
  let yratio = working_height / max_y; 
  ratio = Math.min(xratio, yratio);

  const x_offset = (export_canvas.width - max_x * ratio) / 2;
  const y_offset = (export_canvas.height - max_y * ratio) / 2;

  // make a deep copy of LABELS so as not to mutate it
  let temp_labels = JSON.parse(JSON.stringify(globals.LABELS));
  temp_labels.map( (label) => { 
    label.x = label.x * ratio + x_offset;
    label.y = label.y * ratio + y_offset;
  });
  ctx.drawImage(globals.CVS.image, 0, 0, globals.CVS.image.width, globals.CVS.image.height,
                       x_offset, y_offset, globals.CVS.image.width * ratio,
                       globals.CVS.image.height * ratio);

  // These ratios are how much to scale the labels and overlay to the enlarged
  // canvas
  let x_ratio = working_height / globals.CVS.image.height;
  let y_ratio = working_width / globals.CVS.image.width;
  let draw_ratio = Math.min(x_ratio, y_ratio);
  draw_ratio = 1;

  temp_labels.map( (label) => { globals.CVS.draw_label(label, ctx, draw_ratio); });
  __WEBPACK_IMPORTED_MODULE_6_vex_js___default.a.dialog.open({
    message: 'Enter building overlay text',
    input: "<input name='letter' type='text' placeholder='Building A Level 1'/>",
    callback: (text) => {
      if (text === undefined) {
        globals.CVS.draw_overlay(export_canvas, ctx);
      }
      else {
        globals.CVS.draw_overlay(export_canvas, ctx, text.letter);
      }
      let buffer = canvasBuffer(export_canvas, 'image/png');
      electron.remote.getGlobal('data').exportedImage = buffer;
      electron.ipcRenderer.send('export_image', buffer);
      export_canvas.remove(); // Garbage collection
    }
  });
}

init();


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(41);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var isFactory = __webpack_require__(1).isFactory;
var typedFactory = __webpack_require__(42);
var emitter = __webpack_require__(26);

var importFactory = __webpack_require__(45);
var configFactory = __webpack_require__(46);

/**
 * Math.js core. Creates a new, empty math.js instance
 * @param {Object} [options] Available options:
 *                            {number} epsilon
 *                              Minimum relative difference between two
 *                              compared values, used by all comparison functions.
 *                            {string} matrix
 *                              A string 'Matrix' (default) or 'Array'.
 *                            {string} number
 *                              A string 'number' (default), 'BigNumber', or 'Fraction'
 *                            {number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 *                            {boolean} predictable
 *                              Predictable output type of functions. When true,
 *                              output type depends only on the input types. When
 *                              false (default), output type can vary depending
 *                              on input values. For example `math.sqrt(-4)`
 *                              returns `complex('2i')` when predictable is false, and
 *                              returns `NaN` when true.
 *                            {string} randomSeed
 *                              Random seed for seeded pseudo random number generator.
 *                              Set to null to randomly seed.
 * @returns {Object} Returns a bare-bone math.js instance containing
 *                   functions:
 *                   - `import` to add new functions
 *                   - `config` to change configuration
 *                   - `on`, `off`, `once`, `emit` for events
 */
exports.create = function create (options) {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
    'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // cached factories and instances
  var factories = [];
  var instances = [];

  // create a namespace for the mathjs instance, and attach emitter functions
  var math = emitter.mixin({});
  math.type = {};
  math.expression = {
    transform: {},
    mathWithTransform: {}
  };

  // create a new typed instance
  math.typed = typedFactory.create(math.type);

  // create configuration options. These are private
  var _config = {
    // minimum relative difference between two compared values,
    // used by all comparison functions
    epsilon: 1e-12,

    // type of default matrix output. Choose 'matrix' (default) or 'array'
    matrix: 'Matrix',

    // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
    number: 'number',

    // number of significant digits in BigNumbers
    precision: 64,

    // predictable output type of functions. When true, output type depends only
    // on the input types. When false (default), output type can vary depending
    // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
    // predictable is false, and returns `NaN` when true.
    predictable: false,

    // random seed for seeded pseudo random number generation
    // null = randomly seed
    randomSeed: null
  };

  /**
   * Load a function or data type from a factory.
   * If the function or data type already exists, the existing instance is
   * returned.
   * @param {{type: string, name: string, factory: Function}} factory
   * @returns {*}
   */
  function load (factory) {
    if (!isFactory(factory)) {
      throw new Error('Factory object with properties `type`, `name`, and `factory` expected');
    }

    var index = factories.indexOf(factory);
    var instance;
    if (index === -1) {
      // doesn't yet exist
      if (factory.math === true) {
        // pass with math namespace
        instance = factory.factory(math.type, _config, load, math.typed, math);
      }
      else {
        instance = factory.factory(math.type, _config, load, math.typed);
      }

      // append to the cache
      factories.push(factory);
      instances.push(instance);
    }
    else {
      // already existing function, return the cached instance
      instance = instances[index];
    }

    return instance;
  }

  // load the import and config functions
  math['import'] = load(importFactory);
  math['config'] = load(configFactory);
  math.expression.mathWithTransform['config'] = math['config']

  // apply options
  if (options) {
    math.config(options);
  }

  return math;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var typedFunction = __webpack_require__(43);
var digits = __webpack_require__(2).digits;

// returns a new instance of typed-function
var createTyped = function () {
  // initially, return the original instance of typed-function
  // consecutively, return a new instance from typed.create.
  createTyped = typedFunction.create;
  return typedFunction;
};

/**
 * Factory function for creating a new typed instance
 * @param {Object} type   Object with data types like Complex and BigNumber
 * @returns {Function}
 */
exports.create = function create(type) {
  // TODO: typed-function must be able to silently ignore signatures with unknown data types

  // get a new instance of typed-function
  var typed = createTyped();

  // define all types. The order of the types determines in which order function
  // arguments are type-checked (so for performance it's important to put the
  // most used types first).
  typed.types = [
    { name: 'number',          test: function (x) { return typeof x === 'number' } },
    { name: 'Complex',         test: function (x) { return x && x.isComplex } },
    { name: 'BigNumber',       test: function (x) { return x && x.isBigNumber } },
    { name: 'Fraction',        test: function (x) { return x && x.isFraction } },
    { name: 'Unit',            test: function (x) { return x && x.isUnit } },
    { name: 'string',          test: function (x) { return typeof x === 'string' } },
    { name: 'Array',           test: Array.isArray },
    { name: 'Matrix',          test: function (x) { return x && x.isMatrix } },
    { name: 'DenseMatrix',     test: function (x) { return x && x.isDenseMatrix } },
    { name: 'SparseMatrix',    test: function (x) { return x && x.isSparseMatrix } },
    { name: 'Range',           test: function (x) { return x && x.isRange } },
    { name: 'Index',           test: function (x) { return x && x.isIndex } },
    { name: 'boolean',         test: function (x) { return typeof x === 'boolean' } },
    { name: 'ResultSet',       test: function (x) { return x && x.isResultSet } },
    { name: 'Help',            test: function (x) { return x && x.isHelp } },
    { name: 'function',        test: function (x) { return typeof x === 'function'} },
    { name: 'Date',            test: function (x) { return x instanceof Date } },
    { name: 'RegExp',          test: function (x) { return x instanceof RegExp } },
    { name: 'Object',          test: function (x) { return typeof x === 'object' } },
    { name: 'null',            test: function (x) { return x === null } },
    { name: 'undefined',       test: function (x) { return x === undefined } },

    { name: 'OperatorNode',    test: function (x) { return x && x.isOperatorNode } },
    { name: 'ConstantNode',    test: function (x) { return x && x.isConstantNode } },
    { name: 'SymbolNode',      test: function (x) { return x && x.isSymbolNode } },
    { name: 'ParenthesisNode', test: function (x) { return x && x.isParenthesisNode } },
    { name: 'FunctionNode',    test: function (x) { return x && x.isFunctionNode } },
    { name: 'FunctionAssignmentNode',    test: function (x) { return x && x.isFunctionAssignmentNode } },
    { name: 'ArrayNode',                 test: function (x) { return x && x.isArrayNode } },
    { name: 'AssignmentNode',            test: function (x) { return x && x.isAssignmentNode } },
    { name: 'BlockNode',                 test: function (x) { return x && x.isBlockNode } },
    { name: 'ConditionalNode',           test: function (x) { return x && x.isConditionalNode } },
    { name: 'IndexNode',                 test: function (x) { return x && x.isIndexNode } },
    { name: 'RangeNode',                 test: function (x) { return x && x.isRangeNode } },
    { name: 'UpdateNode',                test: function (x) { return x && x.isUpdateNode } },
    { name: 'Node',                      test: function (x) { return x && x.isNode } }
  ];

  // TODO: add conversion from BigNumber to number?
  typed.conversions = [
    {
      from: 'number',
      to: 'BigNumber',
      convert: function (x) {
        // note: conversion from number to BigNumber can fail if x has >15 digits
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
          '(value: ' + x + '). ' +
          'Use function bignumber(x) to convert to BigNumber.');
        }
        return new type.BigNumber(x);
      }
    }, {
      from: 'number',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x, 0);
      }
    }, {
      from: 'number',
      to: 'string',
      convert: function (x) {
        return x + '';
      }
    }, {
      from: 'BigNumber',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x.toNumber(), 0);
      }
    }, {
      from: 'Fraction',
      to: 'BigNumber',
      convert: function (x) {
        throw new TypeError('Cannot implicitly convert a Fraction to BigNumber or vice versa. ' +
            'Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.');
      }
    }, {
      from: 'Fraction',
      to: 'Complex',
      convert: function (x) {
        return new type.Complex(x.valueOf(), 0);
      }
    }, {
      from: 'number',
      to: 'Fraction',
      convert: function (x) {
        var f = new type.Fraction(x);
        if (f.valueOf() !== x) {
          throw new TypeError('Cannot implicitly convert a number to a Fraction when there will be a loss of precision ' +
              '(value: ' + x + '). ' +
              'Use function fraction(x) to convert to Fraction.');
        }
        return new type.Fraction(x);
      }
    }, {
    // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
    //  from: 'Fraction',
    //  to: 'number',
    //  convert: function (x) {
    //    return x.valueOf();
    //  }
    //}, {
      from: 'string',
      to: 'number',
      convert: function (x) {
        var n = Number(x);
        if (isNaN(n)) {
          throw new Error('Cannot convert "' + x + '" to a number');
        }
        return n;
      }
    }, {
      from: 'string',
      to: 'BigNumber',
      convert: function (x) {
        try {
          return new type.BigNumber(x);
        }
        catch (err) {
          throw new Error('Cannot convert "' + x + '" to BigNumber');
        }
      }
    }, {
      from: 'string',
      to: 'Fraction',
      convert: function (x) {
        try {
          return new type.Fraction(x);
        }
        catch (err) {
          throw new Error('Cannot convert "' + x + '" to Fraction');
        }
      }
    }, {
      from: 'string',
      to: 'Complex',
      convert: function (x) {
        try {
          return new type.Complex(x);
        }
        catch (err) {
          throw new Error('Cannot convert "' + x + '" to Complex');
        }
      }
    }, {
      from: 'boolean',
      to: 'number',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'boolean',
      to: 'BigNumber',
      convert: function (x) {
        return new type.BigNumber(+x);
      }
    }, {
      from: 'boolean',
      to: 'Fraction',
      convert: function (x) {
        return new type.Fraction(+x);
      }
    }, {
      from: 'boolean',
      to: 'string',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'null',
      to: 'number',
      convert: function () {
        return 0;
      }
    }, {
      from: 'null',
      to: 'string',
      convert: function () {
        return 'null';
      }
    }, {
      from: 'null',
      to: 'BigNumber',
      convert: function () {
        return new type.BigNumber(0);
      }
    }, {
      from: 'null',
      to: 'Fraction',
      convert: function () {
        return new type.Fraction(0);
      }
    }, {
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        // TODO: how to decide on the right type of matrix to create?
        return new type.DenseMatrix(array);
      }
    }, {
      from: 'Matrix',
      to: 'Array',
      convert: function (matrix) {
        return matrix.valueOf();
      }
    }
  ];

  return typed;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * typed-function
 *
 * Type checking for JavaScript functions
 *
 * https://github.com/josdejong/typed-function
 */


(function (root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // OldNode. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like OldNode.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.typed = factory();
  }
}(this, function () {
  // factory function to create a new instance of typed-function
  // TODO: allow passing configuration, types, tests via the factory function
  function create() {
    /**
     * Get a type test function for a specific data type
     * @param {string} name                   Name of a data type like 'number' or 'string'
     * @returns {Function(obj: *) : boolean}  Returns a type testing function.
     *                                        Throws an error for an unknown type.
     */
    function getTypeTest(name) {
      var test;
      for (var i = 0; i < typed.types.length; i++) {
        var entry = typed.types[i];
        if (entry.name === name) {
          test = entry.test;
          break;
        }
      }

      if (!test) {
        var hint;
        for (i = 0; i < typed.types.length; i++) {
          entry = typed.types[i];
          if (entry.name.toLowerCase() == name.toLowerCase()) {
            hint = entry.name;
            break;
          }
        }

        throw new Error('Unknown type "' + name + '"' +
            (hint ? ('. Did you mean "' + hint + '"?') : ''));
      }
      return test;
    }

    /**
     * Retrieve the function name from a set of functions, and check
     * whether the name of all functions match (if given)
     * @param {Array.<function>} fns
     */
    function getName (fns) {
      var name = '';

      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i];

        // merge function name when this is a typed function
        if (fn.signatures && fn.name != '') {
          if (name == '') {
            name = fn.name;
          }
          else if (name != fn.name) {
            var err = new Error('Function names do not match (expected: ' + name + ', actual: ' + fn.name + ')');
            err.data = {
              actual: fn.name,
              expected: name
            };
            throw err;
          }
        }
      }

      return name;
    }

    /**
     * Create an ArgumentsError. Creates messages like:
     *
     *   Unexpected type of argument (expected: ..., actual: ..., index: ...)
     *   Too few arguments (expected: ..., index: ...)
     *   Too many arguments (expected: ..., actual: ...)
     *
     * @param {String} fn         Function name
     * @param {number} argCount   Number of arguments
     * @param {Number} index      Current argument index
     * @param {*} actual          Current argument
     * @param {string} [expected] An optional, comma separated string with
     *                            expected types on given index
     * @extends Error
     */
    function createError(fn, argCount, index, actual, expected) {
      var actualType = getTypeOf(actual);
      var _expected = expected ? expected.split(',') : null;
      var _fn = (fn || 'unnamed');
      var anyType = _expected && contains(_expected, 'any');
      var message;
      var data = {
        fn: fn,
        index: index,
        actual: actual,
        expected: _expected
      };

      if (_expected) {
        if (argCount > index && !anyType) {
          // unexpected type
          message = 'Unexpected type of argument in function ' + _fn +
              ' (expected: ' + _expected.join(' or ') + ', actual: ' + actualType + ', index: ' + index + ')';
        }
        else {
          // too few arguments
          message = 'Too few arguments in function ' + _fn +
              ' (expected: ' + _expected.join(' or ') + ', index: ' + index + ')';
        }
      }
      else {
        // too many arguments
        message = 'Too many arguments in function ' + _fn +
            ' (expected: ' + index + ', actual: ' + argCount + ')'
      }

      var err = new TypeError(message);
      err.data = data;
      return err;
    }

    /**
     * Collection with function references (local shortcuts to functions)
     * @constructor
     * @param {string} [name='refs']  Optional name for the refs, used to generate
     *                                JavaScript code
     */
    function Refs(name) {
      this.name = name || 'refs';
      this.categories = {};
    }

    /**
     * Add a function reference.
     * @param {Function} fn
     * @param {string} [category='fn']    A function category, like 'fn' or 'signature'
     * @returns {string} Returns the function name, for example 'fn0' or 'signature2'
     */
    Refs.prototype.add = function (fn, category) {
      var cat = category || 'fn';
      if (!this.categories[cat]) this.categories[cat] = [];

      var index = this.categories[cat].indexOf(fn);
      if (index == -1) {
        index = this.categories[cat].length;
        this.categories[cat].push(fn);
      }

      return cat + index;
    };

    /**
     * Create code lines for all function references
     * @returns {string} Returns the code containing all function references
     */
    Refs.prototype.toCode = function () {
      var code = [];
      var path = this.name + '.categories';
      var categories = this.categories;

      for (var cat in categories) {
        if (categories.hasOwnProperty(cat)) {
          var category = categories[cat];

          for (var i = 0; i < category.length; i++) {
            code.push('var ' + cat + i + ' = ' + path + '[\'' + cat + '\'][' + i + '];');
          }
        }
      }

      return code.join('\n');
    };

    /**
     * A function parameter
     * @param {string | string[] | Param} types    A parameter type like 'string',
     *                                             'number | boolean'
     * @param {boolean} [varArgs=false]            Variable arguments if true
     * @constructor
     */
    function Param(types, varArgs) {
      // parse the types, can be a string with types separated by pipe characters |
      if (typeof types === 'string') {
        // parse variable arguments operator (ellipses '...number')
        var _types = types.trim();
        var _varArgs = _types.substr(0, 3) === '...';
        if (_varArgs) {
          _types = _types.substr(3);
        }
        if (_types === '') {
          this.types = ['any'];
        }
        else {
          this.types = _types.split('|');
          for (var i = 0; i < this.types.length; i++) {
            this.types[i] = this.types[i].trim();
          }
        }
      }
      else if (Array.isArray(types)) {
        this.types = types;
      }
      else if (types instanceof Param) {
        return types.clone();
      }
      else {
        throw new Error('String or Array expected');
      }

      // can hold a type to which to convert when handling this parameter
      this.conversions = [];
      // TODO: implement better API for conversions, be able to add conversions via constructor (support a new type Object?)

      // variable arguments
      this.varArgs = _varArgs || varArgs || false;

      // check for any type arguments
      this.anyType = this.types.indexOf('any') !== -1;
    }

    /**
     * Order Params
     * any type ('any') will be ordered last, and object as second last (as other
     * types may be an object as well, like Array).
     *
     * @param {Param} a
     * @param {Param} b
     * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
     */
    Param.compare = function (a, b) {
      // TODO: simplify parameter comparison, it's a mess
      if (a.anyType) return 1;
      if (b.anyType) return -1;

      if (contains(a.types, 'Object')) return 1;
      if (contains(b.types, 'Object')) return -1;

      if (a.hasConversions()) {
        if (b.hasConversions()) {
          var i, ac, bc;

          for (i = 0; i < a.conversions.length; i++) {
            if (a.conversions[i] !== undefined) {
              ac = a.conversions[i];
              break;
            }
          }

          for (i = 0; i < b.conversions.length; i++) {
            if (b.conversions[i] !== undefined) {
              bc = b.conversions[i];
              break;
            }
          }

          return typed.conversions.indexOf(ac) - typed.conversions.indexOf(bc);
        }
        else {
          return 1;
        }
      }
      else {
        if (b.hasConversions()) {
          return -1;
        }
        else {
          // both params have no conversions
          var ai, bi;

          for (i = 0; i < typed.types.length; i++) {
            if (typed.types[i].name === a.types[0]) {
              ai = i;
              break;
            }
          }

          for (i = 0; i < typed.types.length; i++) {
            if (typed.types[i].name === b.types[0]) {
              bi = i;
              break;
            }
          }

          return ai - bi;
        }
      }
    };

    /**
     * Test whether this parameters types overlap an other parameters types.
     * Will not match ['any'] with ['number']
     * @param {Param} other
     * @return {boolean} Returns true when there are overlapping types
     */
    Param.prototype.overlapping = function (other) {
      for (var i = 0; i < this.types.length; i++) {
        if (contains(other.types, this.types[i])) {
          return true;
        }
      }
      return false;
    };

    /**
     * Test whether this parameters types matches an other parameters types.
     * When any of the two parameters contains `any`, true is returned
     * @param {Param} other
     * @return {boolean} Returns true when there are matching types
     */
    Param.prototype.matches = function (other) {
      return this.anyType || other.anyType || this.overlapping(other);
    };

    /**
     * Create a clone of this param
     * @returns {Param} Returns a cloned version of this param
     */
    Param.prototype.clone = function () {
      var param = new Param(this.types.slice(), this.varArgs);
      param.conversions = this.conversions.slice();
      return param;
    };

    /**
     * Test whether this parameter contains conversions
     * @returns {boolean} Returns true if the parameter contains one or
     *                    multiple conversions.
     */
    Param.prototype.hasConversions = function () {
      return this.conversions.length > 0;
    };

    /**
     * Tests whether this parameters contains any of the provided types
     * @param {Object} types  A Map with types, like {'number': true}
     * @returns {boolean}     Returns true when the parameter contains any
     *                        of the provided types
     */
    Param.prototype.contains = function (types) {
      for (var i = 0; i < this.types.length; i++) {
        if (types[this.types[i]]) {
          return true;
        }
      }
      return false;
    };

    /**
     * Return a string representation of this params types, like 'string' or
     * 'number | boolean' or '...number'
     * @param {boolean} [toConversion]   If true, the returned types string
     *                                   contains the types where the parameter
     *                                   will convert to. If false (default)
     *                                   the "from" types are returned
     * @returns {string}
     */
    Param.prototype.toString = function (toConversion) {
      var types = [];
      var keys = {};

      for (var i = 0; i < this.types.length; i++) {
        var conversion = this.conversions[i];
        var type = toConversion && conversion ? conversion.to : this.types[i];
        if (!(type in keys)) {
          keys[type] = true;
          types.push(type);
        }
      }

      return (this.varArgs ? '...' : '') + types.join('|');
    };

    /**
     * A function signature
     * @param {string | string[] | Param[]} params
     *                         Array with the type(s) of each parameter,
     *                         or a comma separated string with types
     * @param {Function} fn    The actual function
     * @constructor
     */
    function Signature(params, fn) {
      var _params;
      if (typeof params === 'string') {
        _params = (params !== '') ? params.split(',') : [];
      }
      else if (Array.isArray(params)) {
        _params = params;
      }
      else {
        throw new Error('string or Array expected');
      }

      this.params = new Array(_params.length);
      this.anyType = false;
      this.varArgs = false;
      for (var i = 0; i < _params.length; i++) {
        var param = new Param(_params[i]);
        this.params[i] = param;
        if (param.anyType) {
          this.anyType = true;
        }
        if (i === _params.length - 1) {
          // the last argument
          this.varArgs = param.varArgs;
        }
        else {
          // non-last argument
          if (param.varArgs) {
            throw new SyntaxError('Unexpected variable arguments operator "..."');
          }
        }
      }

      this.fn = fn;
    }

    /**
     * Create a clone of this signature
     * @returns {Signature} Returns a cloned version of this signature
     */
    Signature.prototype.clone = function () {
      return new Signature(this.params.slice(), this.fn);
    };

    /**
     * Expand a signature: split params with union types in separate signatures
     * For example split a Signature "string | number" into two signatures.
     * @return {Signature[]} Returns an array with signatures (at least one)
     */
    Signature.prototype.expand = function () {
      var signatures = [];

      function recurse(signature, path) {
        if (path.length < signature.params.length) {
          var i, newParam, conversion;

          var param = signature.params[path.length];
          if (param.varArgs) {
            // a variable argument. do not split the types in the parameter
            newParam = param.clone();

            // add conversions to the parameter
            // recurse for all conversions
            for (i = 0; i < typed.conversions.length; i++) {
              conversion = typed.conversions[i];
              if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
                var j = newParam.types.length;
                newParam.types[j] = conversion.from;
                newParam.conversions[j] = conversion;
              }
            }

            recurse(signature, path.concat(newParam));
          }
          else {
            // split each type in the parameter
            for (i = 0; i < param.types.length; i++) {
              recurse(signature, path.concat(new Param(param.types[i])));
            }

            // recurse for all conversions
            for (i = 0; i < typed.conversions.length; i++) {
              conversion = typed.conversions[i];
              if (!contains(param.types, conversion.from) && contains(param.types, conversion.to)) {
                newParam = new Param(conversion.from);
                newParam.conversions[0] = conversion;
                recurse(signature, path.concat(newParam));
              }
            }
          }
        }
        else {
          signatures.push(new Signature(path, signature.fn));
        }
      }

      recurse(this, []);

      return signatures;
    };

    /**
     * Compare two signatures.
     *
     * When two params are equal and contain conversions, they will be sorted
     * by lowest index of the first conversions.
     *
     * @param {Signature} a
     * @param {Signature} b
     * @returns {number} Returns 1 if a > b, -1 if a < b, and else 0.
     */
    Signature.compare = function (a, b) {
      if (a.params.length > b.params.length) return 1;
      if (a.params.length < b.params.length) return -1;

      // count the number of conversions
      var i;
      var len = a.params.length; // a and b have equal amount of params
      var ac = 0;
      var bc = 0;
      for (i = 0; i < len; i++) {
        if (a.params[i].hasConversions()) ac++;
        if (b.params[i].hasConversions()) bc++;
      }

      if (ac > bc) return 1;
      if (ac < bc) return -1;

      // compare the order per parameter
      for (i = 0; i < a.params.length; i++) {
        var cmp = Param.compare(a.params[i], b.params[i]);
        if (cmp !== 0) {
          return cmp;
        }
      }

      return 0;
    };

    /**
     * Test whether any of the signatures parameters has conversions
     * @return {boolean} Returns true when any of the parameters contains
     *                   conversions.
     */
    Signature.prototype.hasConversions = function () {
      for (var i = 0; i < this.params.length; i++) {
        if (this.params[i].hasConversions()) {
          return true;
        }
      }
      return false;
    };

    /**
     * Test whether this signature should be ignored.
     * Checks whether any of the parameters contains a type listed in
     * typed.ignore
     * @return {boolean} Returns true when the signature should be ignored
     */
    Signature.prototype.ignore = function () {
      // create a map with ignored types
      var types = {};
      for (var i = 0; i < typed.ignore.length; i++) {
        types[typed.ignore[i]] = true;
      }

      // test whether any of the parameters contains this type
      for (i = 0; i < this.params.length; i++) {
        if (this.params[i].contains(types)) {
          return true;
        }
      }

      return false;
    };

    /**
     * Test whether the path of this signature matches a given path.
     * @param {Param[]} params
     */
    Signature.prototype.paramsStartWith = function (params) {
      if (params.length === 0) {
        return true;
      }

      var aLast = last(this.params);
      var bLast = last(params);

      for (var i = 0; i < params.length; i++) {
        var a = this.params[i] || (aLast.varArgs ? aLast: null);
        var b = params[i]      || (bLast.varArgs ? bLast: null);

        if (!a ||  !b || !a.matches(b)) {
          return false;
        }
      }

      return true;
    };

    /**
     * Generate the code to invoke this signature
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns code
     */
    Signature.prototype.toCode = function (refs, prefix) {
      var code = [];

      var args = new Array(this.params.length);
      for (var i = 0; i < this.params.length; i++) {
        var param = this.params[i];
        var conversion = param.conversions[0];
        if (param.varArgs) {
          args[i] = 'varArgs';
        }
        else if (conversion) {
          args[i] = refs.add(conversion.convert, 'convert') + '(arg' + i + ')';
        }
        else {
          args[i] = 'arg' + i;
        }
      }

      var ref = this.fn ? refs.add(this.fn, 'signature') : undefined;
      if (ref) {
        return prefix + 'return ' + ref + '(' + args.join(', ') + '); // signature: ' + this.params.join(', ');
      }

      return code.join('\n');
    };

    /**
     * Return a string representation of the signature
     * @returns {string}
     */
    Signature.prototype.toString = function () {
      return this.params.join(', ');
    };

    /**
     * A group of signatures with the same parameter on given index
     * @param {Param[]} path
     * @param {Signature} [signature]
     * @param {Node[]} childs
     * @param {boolean} [fallThrough=false]
     * @constructor
     */
    function Node(path, signature, childs, fallThrough) {
      this.path = path || [];
      this.param = path[path.length - 1] || null;
      this.signature = signature || null;
      this.childs = childs || [];
      this.fallThrough = fallThrough || false;
    }

    /**
     * Generate code for this group of signatures
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns the code as string
     */
    Node.prototype.toCode = function (refs, prefix) {
      // TODO: split this function in multiple functions, it's too large
      var code = [];

      if (this.param) {
        var index = this.path.length - 1;
        var conversion = this.param.conversions[0];
        var comment = '// type: ' + (conversion ?
                (conversion.from + ' (convert to ' + conversion.to + ')') :
                this.param);

        // non-root node (path is non-empty)
        if (this.param.varArgs) {
          if (this.param.anyType) {
            // variable arguments with any type
            code.push(prefix + 'if (arguments.length > ' + index + ') {');
            code.push(prefix + '  var varArgs = [];');
            code.push(prefix + '  for (var i = ' + index + '; i < arguments.length; i++) {');
            code.push(prefix + '    varArgs.push(arguments[i]);');
            code.push(prefix + '  }');
            code.push(this.signature.toCode(refs, prefix + '  '));
            code.push(prefix + '}');
          }
          else {
            // variable arguments with a fixed type
            var getTests = function (types, arg) {
              var tests = [];
              for (var i = 0; i < types.length; i++) {
                tests[i] = refs.add(getTypeTest(types[i]), 'test') + '(' + arg + ')';
              }
              return tests.join(' || ');
            }.bind(this);

            var allTypes = this.param.types;
            var exactTypes = [];
            for (var i = 0; i < allTypes.length; i++) {
              if (this.param.conversions[i] === undefined) {
                exactTypes.push(allTypes[i]);
              }
            }

            code.push(prefix + 'if (' + getTests(allTypes, 'arg' + index) + ') { ' + comment);
            code.push(prefix + '  var varArgs = [arg' + index + '];');
            code.push(prefix + '  for (var i = ' + (index + 1) + '; i < arguments.length; i++) {');
            code.push(prefix + '    if (' + getTests(exactTypes, 'arguments[i]') + ') {');
            code.push(prefix + '      varArgs.push(arguments[i]);');

            for (var i = 0; i < allTypes.length; i++) {
              var conversion_i = this.param.conversions[i];
              if (conversion_i) {
                var test = refs.add(getTypeTest(allTypes[i]), 'test');
                var convert = refs.add(conversion_i.convert, 'convert');
                code.push(prefix + '    }');
                code.push(prefix + '    else if (' + test + '(arguments[i])) {');
                code.push(prefix + '      varArgs.push(' + convert + '(arguments[i]));');
              }
            }
            code.push(prefix + '    } else {');
            code.push(prefix + '      throw createError(name, arguments.length, i, arguments[i], \'' + exactTypes.join(',') + '\');');
            code.push(prefix + '    }');
            code.push(prefix + '  }');
            code.push(this.signature.toCode(refs, prefix + '  '));
            code.push(prefix + '}');
          }
        }
        else {
          if (this.param.anyType) {
            // any type
            code.push(prefix + '// type: any');
            code.push(this._innerCode(refs, prefix));
          }
          else {
            // regular type
            var type = this.param.types[0];
            var test = type !== 'any' ? refs.add(getTypeTest(type), 'test') : null;

            code.push(prefix + 'if (' + test + '(arg' + index + ')) { ' + comment);
            code.push(this._innerCode(refs, prefix + '  '));
            code.push(prefix + '}');
          }
        }
      }
      else {
        // root node (path is empty)
        code.push(this._innerCode(refs, prefix));
      }

      return code.join('\n');
    };

    /**
     * Generate inner code for this group of signatures.
     * This is a helper function of Node.prototype.toCode
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns the inner code as string
     * @private
     */
    Node.prototype._innerCode = function (refs, prefix) {
      var code = [];
      var i;

      if (this.signature) {
        code.push(prefix + 'if (arguments.length === ' + this.path.length + ') {');
        code.push(this.signature.toCode(refs, prefix + '  '));
        code.push(prefix + '}');
      }

      for (i = 0; i < this.childs.length; i++) {
        code.push(this.childs[i].toCode(refs, prefix));
      }

      // TODO: shouldn't the this.param.anyType check be redundant
      if (!this.fallThrough || (this.param && this.param.anyType)) {
        var exceptions = this._exceptions(refs, prefix);
        if (exceptions) {
          code.push(exceptions);
        }
      }

      return code.join('\n');
    };


    /**
     * Generate code to throw exceptions
     * @param {Refs} refs
     * @param {string} prefix
     * @returns {string} Returns the inner code as string
     * @private
     */
    Node.prototype._exceptions = function (refs, prefix) {
      var index = this.path.length;

      if (this.childs.length === 0) {
        // TODO: can this condition be simplified? (we have a fall-through here)
        return [
          prefix + 'if (arguments.length > ' + index + ') {',
          prefix + '  throw createError(name, arguments.length, ' + index + ', arguments[' + index + ']);',
          prefix + '}'
        ].join('\n');
      }
      else {
        var keys = {};
        var types = [];

        for (var i = 0; i < this.childs.length; i++) {
          var node = this.childs[i];
          if (node.param) {
            for (var j = 0; j < node.param.types.length; j++) {
              var type = node.param.types[j];
              if (!(type in keys) && !node.param.conversions[j]) {
                keys[type] = true;
                types.push(type);
              }
            }
          }
        }

        return prefix + 'throw createError(name, arguments.length, ' + index + ', arguments[' + index + '], \'' + types.join(',') + '\');';
      }
    };

    /**
     * Split all raw signatures into an array with expanded Signatures
     * @param {Object.<string, Function>} rawSignatures
     * @return {Signature[]} Returns an array with expanded signatures
     */
    function parseSignatures(rawSignatures) {
      // FIXME: need to have deterministic ordering of signatures, do not create via object
      var signature;
      var keys = {};
      var signatures = [];
      var i;

      for (var types in rawSignatures) {
        if (rawSignatures.hasOwnProperty(types)) {
          var fn = rawSignatures[types];
          signature = new Signature(types, fn);

          if (signature.ignore()) {
            continue;
          }

          var expanded = signature.expand();

          for (i = 0; i < expanded.length; i++) {
            var signature_i = expanded[i];
            var key = signature_i.toString();
            var existing = keys[key];
            if (!existing) {
              keys[key] = signature_i;
            }
            else {
              var cmp = Signature.compare(signature_i, existing);
              if (cmp < 0) {
                // override if sorted first
                keys[key] = signature_i;
              }
              else if (cmp === 0) {
                throw new Error('Signature "' + key + '" is defined twice');
              }
              // else: just ignore
            }
          }
        }
      }

      // convert from map to array
      for (key in keys) {
        if (keys.hasOwnProperty(key)) {
          signatures.push(keys[key]);
        }
      }

      // order the signatures
      signatures.sort(function (a, b) {
        return Signature.compare(a, b);
      });

      // filter redundant conversions from signatures with varArgs
      // TODO: simplify this loop or move it to a separate function
      for (i = 0; i < signatures.length; i++) {
        signature = signatures[i];

        if (signature.varArgs) {
          var index = signature.params.length - 1;
          var param = signature.params[index];

          var t = 0;
          while (t < param.types.length) {
            if (param.conversions[t]) {
              var type = param.types[t];

              for (var j = 0; j < signatures.length; j++) {
                var other = signatures[j];
                var p = other.params[index];

                if (other !== signature &&
                    p &&
                    contains(p.types, type) && !p.conversions[index]) {
                  // this (conversion) type already exists, remove it
                  param.types.splice(t, 1);
                  param.conversions.splice(t, 1);
                  t--;
                  break;
                }
              }
            }
            t++;
          }
        }
      }

      return signatures;
    }

    /**
     * Filter all any type signatures
     * @param {Signature[]} signatures
     * @return {Signature[]} Returns only any type signatures
     */
    function filterAnyTypeSignatures (signatures) {
      var filtered = [];

      for (var i = 0; i < signatures.length; i++) {
        if (signatures[i].anyType) {
          filtered.push(signatures[i]);
        }
      }

      return filtered;
    }

    /**
     * create a map with normalized signatures as key and the function as value
     * @param {Signature[]} signatures   An array with split signatures
     * @return {Object.<string, Function>} Returns a map with normalized
     *                                     signatures as key, and the function
     *                                     as value.
     */
    function mapSignatures(signatures) {
      var normalized = {};

      for (var i = 0; i < signatures.length; i++) {
        var signature = signatures[i];
        if (signature.fn && !signature.hasConversions()) {
          var params = signature.params.join(',');
          normalized[params] = signature.fn;
        }
      }

      return normalized;
    }

    /**
     * Parse signatures recursively in a node tree.
     * @param {Signature[]} signatures  Array with expanded signatures
     * @param {Param[]} path            Traversed path of parameter types
     * @param {Signature[]} anys
     * @return {Node}                   Returns a node tree
     */
    function parseTree(signatures, path, anys) {
      var i, signature;
      var index = path.length;
      var nodeSignature;

      var filtered = [];
      for (i = 0; i < signatures.length; i++) {
        signature = signatures[i];

        // filter the first signature with the correct number of params
        if (signature.params.length === index && !nodeSignature) {
          nodeSignature = signature;
        }

        if (signature.params[index] != undefined) {
          filtered.push(signature);
        }
      }

      // sort the filtered signatures by param
      filtered.sort(function (a, b) {
        return Param.compare(a.params[index], b.params[index]);
      });

      // recurse over the signatures
      var entries = [];
      for (i = 0; i < filtered.length; i++) {
        signature = filtered[i];
        // group signatures with the same param at current index
        var param = signature.params[index];

        // TODO: replace the next filter loop
        var existing = entries.filter(function (entry) {
          return entry.param.overlapping(param);
        })[0];

        //var existing;
        //for (var j = 0; j < entries.length; j++) {
        //  if (entries[j].param.overlapping(param)) {
        //    existing = entries[j];
        //    break;
        //  }
        //}

        if (existing) {
          if (existing.param.varArgs) {
            throw new Error('Conflicting types "' + existing.param + '" and "' + param + '"');
          }
          existing.signatures.push(signature);
        }
        else {
          entries.push({
            param: param,
            signatures: [signature]
          });
        }
      }

      // find all any type signature that can still match our current path
      var matchingAnys = [];
      for (i = 0; i < anys.length; i++) {
        if (anys[i].paramsStartWith(path)) {
          matchingAnys.push(anys[i]);
        }
      }

      // see if there are any type signatures that don't match any of the
      // signatures that we have in our tree, i.e. we have alternative
      // matching signature(s) outside of our current tree and we should
      // fall through to them instead of throwing an exception
      var fallThrough = false;
      for (i = 0; i < matchingAnys.length; i++) {
        if (!contains(signatures, matchingAnys[i])) {
          fallThrough = true;
          break;
        }
      }

      // parse the childs
      var childs = new Array(entries.length);
      for (i = 0; i < entries.length; i++) {
        var entry = entries[i];
        childs[i] = parseTree(entry.signatures, path.concat(entry.param), matchingAnys)
      }

      return new Node(path, nodeSignature, childs, fallThrough);
    }

    /**
     * Generate an array like ['arg0', 'arg1', 'arg2']
     * @param {number} count Number of arguments to generate
     * @returns {Array} Returns an array with argument names
     */
    function getArgs(count) {
      // create an array with all argument names
      var args = [];
      for (var i = 0; i < count; i++) {
        args[i] = 'arg' + i;
      }

      return args;
    }

    /**
     * Compose a function from sub-functions each handling a single type signature.
     * Signatures:
     *   typed(signature: string, fn: function)
     *   typed(name: string, signature: string, fn: function)
     *   typed(signatures: Object.<string, function>)
     *   typed(name: string, signatures: Object.<string, function>)
     *
     * @param {string | null} name
     * @param {Object.<string, Function>} signatures
     * @return {Function} Returns the typed function
     * @private
     */
    function _typed(name, signatures) {
      var refs = new Refs();

      // parse signatures, expand them
      var _signatures = parseSignatures(signatures);
      if (_signatures.length == 0) {
        throw new Error('No signatures provided');
      }

      // filter all any type signatures
      var anys = filterAnyTypeSignatures(_signatures);

      // parse signatures into a node tree
      var node = parseTree(_signatures, [], anys);

      //var util = require('util');
      //console.log('ROOT');
      //console.log(util.inspect(node, { depth: null }));

      // generate code for the typed function
      var code = [];
      var _name = name || '';
      var _args = getArgs(maxParams(_signatures));
      code.push('function ' + _name + '(' + _args.join(', ') + ') {');
      code.push('  "use strict";');
      code.push('  var name = \'' + _name + '\';');
      code.push(node.toCode(refs, '  ', false));
      code.push('}');

      // generate body for the factory function
      var body = [
        refs.toCode(),
        'return ' + code.join('\n')
      ].join('\n');

      // evaluate the JavaScript code and attach function references
      var factory = (new Function(refs.name, 'createError', body));
      var fn = factory(refs, createError);

      //console.log('FN\n' + fn.toString()); // TODO: cleanup

      // attach the signatures with sub-functions to the constructed function
      fn.signatures = mapSignatures(_signatures);

      return fn;
    }

    /**
     * Calculate the maximum number of parameters in givens signatures
     * @param {Signature[]} signatures
     * @returns {number} The maximum number of parameters
     */
    function maxParams(signatures) {
      var max = 0;

      for (var i = 0; i < signatures.length; i++) {
        var len = signatures[i].params.length;
        if (len > max) {
          max = len;
        }
      }

      return max;
    }

    /**
     * Get the type of a value
     * @param {*} x
     * @returns {string} Returns a string with the type of value
     */
    function getTypeOf(x) {
      var obj;

      for (var i = 0; i < typed.types.length; i++) {
        var entry = typed.types[i];

        if (entry.name === 'Object') {
          // Array and Date are also Object, so test for Object afterwards
          obj = entry;
        }
        else {
          if (entry.test(x)) return entry.name;
        }
      }

      // at last, test whether an object
      if (obj && obj.test(x)) return obj.name;

      return 'unknown';
    }

    /**
     * Test whether an array contains some item
     * @param {Array} array
     * @param {*} item
     * @return {boolean} Returns true if array contains item, false if not.
     */
    function contains(array, item) {
      return array.indexOf(item) !== -1;
    }

    /**
     * Returns the last item in the array
     * @param {Array} array
     * @return {*} item
     */
    function last (array) {
      return array[array.length - 1];
    }

    // data type tests
    var types = [
      { name: 'number',    test: function (x) { return typeof x === 'number' } },
      { name: 'string',    test: function (x) { return typeof x === 'string' } },
      { name: 'boolean',   test: function (x) { return typeof x === 'boolean' } },
      { name: 'Function',  test: function (x) { return typeof x === 'function'} },
      { name: 'Array',     test: Array.isArray },
      { name: 'Date',      test: function (x) { return x instanceof Date } },
      { name: 'RegExp',    test: function (x) { return x instanceof RegExp } },
      { name: 'Object',    test: function (x) { return typeof x === 'object' } },
      { name: 'null',      test: function (x) { return x === null } },
      { name: 'undefined', test: function (x) { return x === undefined } }
    ];

    // configuration
    var config = {};

    // type conversions. Order is important
    var conversions = [];

    // types to be ignored
    var ignore = [];

    // temporary object for holding types and conversions, for constructing
    // the `typed` function itself
    // TODO: find a more elegant solution for this
    var typed = {
      config: config,
      types: types,
      conversions: conversions,
      ignore: ignore
    };

    /**
     * Construct the typed function itself with various signatures
     *
     * Signatures:
     *
     *   typed(signatures: Object.<string, function>)
     *   typed(name: string, signatures: Object.<string, function>)
     */
    typed = _typed('typed', {
      'Object': function (signatures) {
        var fns = [];
        for (var signature in signatures) {
          if (signatures.hasOwnProperty(signature)) {
            fns.push(signatures[signature]);
          }
        }
        var name = getName(fns);

        return _typed(name, signatures);
      },
      'string, Object': _typed,
      // TODO: add a signature 'Array.<function>'
      '...Function': function (fns) {
        var err;
        var name = getName(fns);
        var signatures = {};

        for (var i = 0; i < fns.length; i++) {
          var fn = fns[i];

          // test whether this is a typed-function
          if (!(typeof fn.signatures === 'object')) {
            err = new TypeError('Function is no typed-function (index: ' + i + ')');
            err.data = {index: i};
            throw err;
          }

          // merge the signatures
          for (var signature in fn.signatures) {
            if (fn.signatures.hasOwnProperty(signature)) {
              if (signatures.hasOwnProperty(signature)) {
                if (fn.signatures[signature] !== signatures[signature]) {
                  err = new Error('Signature "' + signature + '" is defined twice');
                  err.data = {signature: signature};
                  throw err;
                }
                // else: both signatures point to the same function, that's fine
              }
              else {
                signatures[signature] = fn.signatures[signature];
              }
            }
          }
        }

        return _typed(name, signatures);
      }
    });

    /**
     * Find a specific signature from a (composed) typed function, for
     * example:
     *
     *   typed.find(fn, ['number', 'string'])
     *   typed.find(fn, 'number, string')
     *
     * Function find only only works for exact matches.
     *
     * @param {Function} fn                   A typed-function
     * @param {string | string[]} signature   Signature to be found, can be
     *                                        an array or a comma separated string.
     * @return {Function}                     Returns the matching signature, or
     *                                        throws an errror when no signature
     *                                        is found.
     */
    function find (fn, signature) {
      if (!fn.signatures) {
        throw new TypeError('Function is no typed-function');
      }

      // normalize input
      var arr;
      if (typeof signature === 'string') {
        arr = signature.split(',');
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].trim();
        }
      }
      else if (Array.isArray(signature)) {
        arr = signature;
      }
      else {
        throw new TypeError('String array or a comma separated string expected');
      }

      var str = arr.join(',');

      // find an exact match
      var match = fn.signatures[str];
      if (match) {
        return match;
      }

      // TODO: extend find to match non-exact signatures

      throw new TypeError('Signature not found (signature: ' + (fn.name || 'unnamed') + '(' + arr.join(', ') + '))');
    }

    /**
     * Convert a given value to another data type.
     * @param {*} value
     * @param {string} type
     */
    function convert (value, type) {
      var from = getTypeOf(value);

      // check conversion is needed
      if (type === from) {
        return value;
      }

      for (var i = 0; i < typed.conversions.length; i++) {
        var conversion = typed.conversions[i];
        if (conversion.from === from && conversion.to === type) {
          return conversion.convert(value);
        }
      }

      throw new Error('Cannot convert from ' + from + ' to ' + type);
    }

    // attach types and conversions to the final `typed` function
    typed.config = config;
    typed.types = types;
    typed.conversions = conversions;
    typed.ignore = ignore;
    typed.create = create;
    typed.find = find;
    typed.convert = convert;

    // add a type
    typed.addType = function (type) {
      if (!type || typeof type.name !== 'string' || typeof type.test !== 'function') {
        throw new TypeError('Object with properties {name: string, test: function} expected');
      }

      typed.types.push(type);
    };

    // add a conversion
    typed.addConversion = function (conversion) {
      if (!conversion
          || typeof conversion.from !== 'string'
          || typeof conversion.to !== 'string'
          || typeof conversion.convert !== 'function') {
        throw new TypeError('Object with properties {from: string, to: string, convert: function} expected');
      }

      typed.conversions.push(conversion);
    };

    return typed;
  }

  return create();
}));


/***/ }),
/* 44 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lazy = __webpack_require__(1).lazy;
var isFactory = __webpack_require__(1).isFactory;
var traverse = __webpack_require__(1).traverse;
var ArgumentsError = __webpack_require__(27);

function factory (type, config, load, typed, math) {
  /**
   * Import functions from an object or a module
   *
   * Syntax:
   *
   *    math.import(object)
   *    math.import(object, options)
   *
   * Where:
   *
   * - `object: Object`
   *   An object with functions to be imported.
   * - `options: Object` An object with import options. Available options:
   *   - `override: boolean`
   *     If true, existing functions will be overwritten. False by default.
   *   - `silent: boolean`
   *     If true, the function will not throw errors on duplicates or invalid
   *     types. False by default.
   *   - `wrap: boolean`
   *     If true, the functions will be wrapped in a wrapper function
   *     which converts data types like Matrix to primitive data types like Array.
   *     The wrapper is needed when extending math.js with libraries which do not
   *     support these data type. False by default.
   *
   * Examples:
   *
   *    // define new functions and variables
   *    math.import({
   *      myvalue: 42,
   *      hello: function (name) {
   *        return 'hello, ' + name + '!';
   *      }
   *    });
   *
   *    // use the imported function and variable
   *    math.myvalue * 2;               // 84
   *    math.hello('user');             // 'hello, user!'
   *
   *    // import the npm module 'numbers'
   *    // (must be installed first with `npm install numbers`)
   *    math.import(require('numbers'), {wrap: true});
   *
   *    math.fibonacci(7); // returns 13
   *
   * @param {Object | Array} object   Object with functions to be imported.
   * @param {Object} [options]        Import options.
   */
  function math_import(object, options) {
    var num = arguments.length;
    if (num !== 1 && num !== 2) {
      throw new ArgumentsError('import', num, 1, 2);
    }

    if (!options) {
      options = {};
    }

    if (isFactory(object)) {
      _importFactory(object, options);
    }
    // TODO: allow a typed-function with name too
    else if (Array.isArray(object)) {
      object.forEach(function (entry) {
        math_import(entry, options);
      });
    }
    else if (typeof object === 'object') {
      // a map with functions
      for (var name in object) {
        if (object.hasOwnProperty(name)) {
          var value = object[name];
          if (isSupportedType(value)) {
            _import(name, value, options);
          }
          else if (isFactory(object)) {
            _importFactory(object, options);
          }
          else {
            math_import(value, options);
          }
        }
      }
    }
    else {
      if (!options.silent) {
        throw new TypeError('Factory, Object, or Array expected');
      }
    }
  }

  /**
   * Add a property to the math namespace and create a chain proxy for it.
   * @param {string} name
   * @param {*} value
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _import(name, value, options) {
    // TODO: refactor this function, it's to complicated and contains duplicate code
    if (options.wrap && typeof value === 'function') {
      // create a wrapper around the function
      value = _wrap(value);
    }

    if (isTypedFunction(math[name]) && isTypedFunction(value)) {
      if (options.override) {
        // give the typed function the right name
        value = typed(name, value.signatures);
      }
      else {
        // merge the existing and typed function
        value = typed(math[name], value);
      }

      math[name] = value;
      _importTransform(name, value);
      math.emit('import', name, function resolver() {
        return value;
      });
      return;
    }

    if (math[name] === undefined || options.override) {
      math[name] = value;
      _importTransform(name, value);
      math.emit('import', name, function resolver() {
        return value;
      });
      return;
    }

    if (!options.silent) {
      throw new Error('Cannot import "' + name + '": already exists');
    }
  }

  function _importTransform (name, value) {
    if (value && typeof value.transform === 'function') {
      math.expression.transform[name] = value.transform;
      if (allowedInExpressions(name)) {
        math.expression.mathWithTransform[name] = value.transform
      }
    }
    else {
      // remove existing transform
      delete math.expression.transform[name]
      if (allowedInExpressions(name)) {
        math.expression.mathWithTransform[name] = value
      }
    }
  }

  /**
   * Create a wrapper a round an function which converts the arguments
   * to their primitive values (like convert a Matrix to Array)
   * @param {Function} fn
   * @return {Function} Returns the wrapped function
   * @private
   */
  function _wrap (fn) {
    var wrapper = function wrapper () {
      var args = [];
      for (var i = 0, len = arguments.length; i < len; i++) {
        var arg = arguments[i];
        args[i] = arg && arg.valueOf();
      }
      return fn.apply(math, args);
    };

    if (fn.transform) {
      wrapper.transform = fn.transform;
    }

    return wrapper;
  }

  /**
   * Import an instance of a factory into math.js
   * @param {{factory: Function, name: string, path: string, math: boolean}} factory
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _importFactory(factory, options) {
    if (typeof factory.name === 'string') {
      var name = factory.name;
      var existingTransform = name in math.expression.transform
      var namespace = factory.path ? traverse(math, factory.path) : math;
      var existing = namespace.hasOwnProperty(name) ? namespace[name] : undefined;

      var resolver = function () {
        var instance = load(factory);
        if (instance && typeof instance.transform === 'function') {
          throw new Error('Transforms cannot be attached to factory functions. ' +
              'Please create a separate function for it with exports.path="expression.transform"');
        }

        if (isTypedFunction(existing) && isTypedFunction(instance)) {
          if (options.override) {
            // replace the existing typed function (nothing to do)
          }
          else {
            // merge the existing and new typed function
            instance = typed(existing, instance);
          }

          return instance;
        }

        if (existing === undefined || options.override) {
          return instance;
        }

        if (!options.silent) {
          throw new Error('Cannot import "' + name + '": already exists');
        }
      };

      if (factory.lazy !== false) {
        lazy(namespace, name, resolver);

        if (!existingTransform) {
          if (factory.path === 'expression.transform' || factoryAllowedInExpressions(factory)) {
            lazy(math.expression.mathWithTransform, name, resolver);
          }
        }
      }
      else {
        namespace[name] = resolver();

        if (!existingTransform) {
          if (factory.path === 'expression.transform' || factoryAllowedInExpressions(factory)) {
            math.expression.mathWithTransform[name] = resolver();
          }
        }
      }

      math.emit('import', name, resolver, factory.path);
    }
    else {
      // unnamed factory.
      // no lazy loading
      load(factory);
    }
  }

  /**
   * Check whether given object is a type which can be imported
   * @param {Function | number | string | boolean | null | Unit | Complex} object
   * @return {boolean}
   * @private
   */
  function isSupportedType(object) {
    return typeof object === 'function'
        || typeof object === 'number'
        || typeof object === 'string'
        || typeof object === 'boolean'
        || object === null
        || (object && object.isUnit === true)
        || (object && object.isComplex === true)
        || (object && object.isBigNumber === true)
        || (object && object.isFraction === true)
        || (object && object.isMatrix === true)
        || (object && Array.isArray(object) === true)
  }

  /**
   * Test whether a given thing is a typed-function
   * @param {*} fn
   * @return {boolean} Returns true when `fn` is a typed-function
   */
  function isTypedFunction (fn) {
    return typeof fn === 'function' && typeof fn.signatures === 'object';
  }

  function allowedInExpressions (name) {
    return !unsafe.hasOwnProperty(name);
  }

  function factoryAllowedInExpressions (factory) {
    return factory.path === undefined && !unsafe.hasOwnProperty(factory.name);
  }

  // namespaces and functions not available in the parser for safety reasons
  var unsafe = {
    'expression': true,
    'type': true,
    'docs': true,
    'error': true,
    'json': true,
    'chain': true // chain method not supported. Note that there is a unit chain too.
  };

  return math_import;
}

exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'import';
exports.factory = factory;
exports.lazy = true;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var object = __webpack_require__(1);

function factory (type, config, load, typed, math) {
  var MATRIX = ['Matrix', 'Array'];                   // valid values for option matrix
  var NUMBER = ['number', 'BigNumber', 'Fraction'];   // valid values for option number

  /**
   * Set configuration options for math.js, and get current options.
   * Will emit a 'config' event, with arguments (curr, prev, changes).
   *
   * Syntax:
   *
   *     math.config(config: Object): Object
   *
   * Examples:
   *
   *     math.config().number;                // outputs 'number'
   *     math.eval('0.4');                    // outputs number 0.4
   *     math.config({number: 'Fraction'});
   *     math.eval('0.4');                    // outputs Fraction 2/5
   *
   * @param {Object} [options] Available options:
   *                            {number} epsilon
   *                              Minimum relative difference between two
   *                              compared values, used by all comparison functions.
   *                            {string} matrix
   *                              A string 'Matrix' (default) or 'Array'.
   *                            {string} number
   *                              A string 'number' (default), 'BigNumber', or 'Fraction'
   *                            {number} precision
   *                              The number of significant digits for BigNumbers.
   *                              Not applicable for Numbers.
   *                            {string} parenthesis
   *                              How to display parentheses in LaTeX and string
   *                              output.
   *                            {string} randomSeed
   *                              Random seed for seeded pseudo random number generator.
   *                              Set to null to randomly seed.
   * @return {Object} Returns the current configuration
   */
  function _config(options) {
    if (options) {
      var prev = object.map(config, object.clone);

      // validate some of the options
      validateOption(options, 'matrix', MATRIX);
      validateOption(options, 'number', NUMBER);

      // merge options
      object.deepExtend(config, options);

      var curr = object.map(config, object.clone);

      var changes = object.map(options, object.clone);

      // emit 'config' event
      math.emit('config', curr, prev, changes);

      return curr;
    }
    else {
      return object.map(config, object.clone);
    }
  }

  // attach the valid options to the function so they can be extended
  _config.MATRIX = MATRIX;
  _config.NUMBER = NUMBER;

  return _config;
}

/**
 * Test whether an Array contains a specific item.
 * @param {Array.<string>} array
 * @param {string} item
 * @return {boolean}
 */
function contains (array, item) {
  return array.indexOf(item) !== -1;
}

/**
 * Find a string in an array. Case insensitive search
 * @param {Array.<string>} array
 * @param {string} item
 * @return {number} Returns the index when found. Returns -1 when not found
 */
function findIndex (array, item) {
  return array
      .map(function (i) {
        return i.toLowerCase();
      })
      .indexOf(item.toLowerCase());
}

/**
 * Validate an option
 * @param {Object} options         Object with options
 * @param {string} name            Name of the option to validate
 * @param {Array.<string>} values  Array with valid values for this option
 */
function validateOption(options, name, values) {
  if (options[name] !== undefined && !contains(values, options[name])) {
    var index = findIndex(values, options[name]);
    if (index !== -1) {
      // right value, wrong casing
      // TODO: lower case values are deprecated since v3, remove this warning some day.
      console.warn('Warning: Wrong casing for configuration option "' + name + '", should be "' + values[index] + '" instead of "' + options[name] + '".');

      options[name] = values[index]; // change the option to the right casing
    }
    else {
      // unknown value
      console.warn('Warning: Unknown value "' + options[name] + '" for configuration option "' + name + '". Available options: ' + values.map(JSON.stringify).join(', ') + '.');
    }
  }
}

exports.name = 'config';
exports.math = true; // request the math namespace as fifth argument
exports.factory = factory;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
  // types
  __webpack_require__(20),
  __webpack_require__(29),
  __webpack_require__(50),
  __webpack_require__(51),
  __webpack_require__(53),
  __webpack_require__(55),
  __webpack_require__(56),
  __webpack_require__(57),

  // construction functions
  __webpack_require__(58),
  __webpack_require__(0),
  __webpack_require__(59)
];


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * Convert a BigNumber to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {string} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'exponential'    Always use exponential notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          exponential notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'exponential' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} exponential An object containing two parameters,
 *                                          {number} lower and {number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return exponential notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
 *
 * @param {BigNumber} value
 * @param {Object | Function | number} [options]
 * @return {string} str The formatted value
 */
exports.format = function (value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (!value.isFinite()) {
    return value.isNaN() ? 'NaN' : (value.gt(0) ? 'Infinity' : '-Infinity');
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options !== undefined) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (typeof options === 'number') {
      precision = options;
    }
    else if (options.precision) {
      precision = options.precision;
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return exports.toFixed(value, precision);

    case 'exponential':
      return exports.toExponential(value, precision);

    case 'auto':
      // determine lower and upper bound for exponential notation.
      // TODO: implement support for upper and lower to be BigNumbers themselves
      var lower = 1e-3;
      var upper = 1e5;
      if (options && options.exponential) {
        if (options.exponential.lower !== undefined) {
          lower = options.exponential.lower;
        }
        if (options.exponential.upper !== undefined) {
          upper = options.exponential.upper;
        }
      }

      // adjust the configuration of the BigNumber constructor (yeah, this is quite tricky...)
      var oldConfig = {
        toExpNeg: value.constructor.toExpNeg,
        toExpPos: value.constructor.toExpPos
      };

      value.constructor.config({
        toExpNeg: Math.round(Math.log(lower) / Math.LN10),
        toExpPos: Math.round(Math.log(upper) / Math.LN10)
      });

      // handle special case zero
      if (value.isZero()) return '0';

      // determine whether or not to output exponential notation
      var str;
      var abs = value.abs();
      if (abs.gte(lower) && abs.lt(upper)) {
        // normal number notation
        str = value.toSignificantDigits(precision).toFixed();
      }
      else {
        // exponential notation
        str = exports.toExponential(value, precision);
      }

      // remove trailing zeros after the decimal point
      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
        var digits = arguments[2];
        var e = arguments[4];
        return (digits !== '.') ? digits + e : e;
      });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "exponential", or "fixed".');
  }
};

/**
 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {BigNumber} value
 * @param {number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toExponential = function (value, precision) {
  if (precision !== undefined) {
    return value.toExponential(precision - 1); // Note the offset of one
  }
  else {
    return value.toExponential();
  }
};

/**
 * Format a number with fixed notation.
 * @param {BigNumber} value
 * @param {number} [precision=0]        Optional number of decimals after the
 *                                      decimal point. Zero by default.
 */
exports.toFixed = function (value, precision) {
  return value.toFixed(precision || 0);
  // Note: the (precision || 0) is needed as the toFixed of BigNumber has an
  // undefined default precision instead of 0.
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Test whether value is a boolean
 * @param {*} value
 * @return {boolean} isBoolean
 */
exports.isBoolean = function(value) {
  return typeof value == 'boolean';
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(5);
var DimensionError = __webpack_require__(4);

var array = util.array;
var object = util.object;
var string = util.string;
var number = util.number;

var isArray = Array.isArray;
var isNumber = number.isNumber;
var isInteger = number.isInteger;
var isString = string.isString;

var validateIndex = array.validateIndex;

function factory (type, config, load, typed) {
  var Matrix = load(__webpack_require__(20)); // force loading Matrix (do not use via type.Matrix)
  var equalScalar = load(__webpack_require__(7));

  /**
   * Sparse Matrix implementation. This type implements a Compressed Column Storage format
   * for sparse matrices.
   * @class SparseMatrix
   */
  function SparseMatrix(data, datatype) {
    if (!(this instanceof SparseMatrix))
      throw new SyntaxError('Constructor must be called with the new operator');
    if (datatype && !isString(datatype))
      throw new Error('Invalid datatype: ' + datatype);
    
    if (data && data.isMatrix === true) {
      // create from matrix
      _createFromMatrix(this, data, datatype);
    }
    else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
      // initialize fields
      this._values = data.values;
      this._index = data.index;
      this._ptr = data.ptr;
      this._size = data.size;
      this._datatype = datatype || data.datatype;
    }
    else if (isArray(data)) {
      // create from array
      _createFromArray(this, data, datatype);
    }
    else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._values = [];
      this._index = [];
      this._ptr = [0];
      this._size = [0, 0];
      this._datatype = datatype;
    }
  }
  
  var _createFromMatrix = function (matrix, source, datatype) {
    // check matrix type
    if (source.type === 'SparseMatrix') {
      // clone arrays
      matrix._values = source._values ? object.clone(source._values) : undefined;
      matrix._index = object.clone(source._index);
      matrix._ptr = object.clone(source._ptr);
      matrix._size = object.clone(source._size);
      matrix._datatype = datatype || source._datatype;
    }
    else {
      // build from matrix data
      _createFromArray(matrix, source.valueOf(), datatype || source._datatype);
    }
  };
  
  var _createFromArray = function (matrix, data, datatype) {
    // initialize fields
    matrix._values = [];
    matrix._index = [];
    matrix._ptr = [];
    matrix._datatype = datatype;
    // discover rows & columns, do not use math.size() to avoid looping array twice
    var rows = data.length;
    var columns = 0;
    
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    
    if (isString(datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar;
      // convert 0 to the same datatype
      zero = typed.convert(0, datatype);
    }

    // check we have rows (empty array)
    if (rows > 0) {
      // column index
      var j = 0;
      do {
        // store pointer to values index
        matrix._ptr.push(matrix._index.length);
        // loop rows
        for (var i = 0; i < rows; i++) {
          // current row
          var row = data[i];
          // check row is an array
          if (isArray(row)) {
            // update columns if needed (only on first column)
            if (j === 0 && columns < row.length)
              columns = row.length;
            // check row has column
            if (j < row.length) {
              // value
              var v = row[j];
              // check value != 0
              if (!eq(v, zero)) {
                // store value
                matrix._values.push(v);
                // index
                matrix._index.push(i);
              }
            }
          }
          else {
            // update columns if needed (only on first column)
            if (j === 0 && columns < 1)
              columns = 1;
            // check value != 0 (row is a scalar)
            if (!eq(row, zero)) {
              // store value
              matrix._values.push(row);
              // index
              matrix._index.push(i);
            }
          }
        }
        // increment index
        j++;      
      }
      while (j < columns);
    }
    // store number of values in ptr
    matrix._ptr.push(matrix._index.length);
    // size
    matrix._size = [rows, columns];
  };
  
  SparseMatrix.prototype = new Matrix();

  /**
   * Attach type information
   */
  SparseMatrix.prototype.type = 'SparseMatrix';
  SparseMatrix.prototype.isSparseMatrix = true;

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     var format = matrix.storage()                   // retrieve storage format
   *
   * @memberof SparseMatrix
   * @return {string}           The storage format.
   */
  SparseMatrix.prototype.storage = function () {
    return 'sparse';
  };

  /**
   * Get the datatype of the data stored in the matrix.
   *
   * Usage:
   *     var format = matrix.datatype()                   // retrieve matrix datatype
   *
   * @memberof SparseMatrix
   * @return {string}           The datatype.
   */
  SparseMatrix.prototype.datatype = function () {
    return this._datatype;
  };

  /**
   * Create a new SparseMatrix
   * @memberof SparseMatrix
   * @param {Array} data
   * @param {string} [datatype]
   */
  SparseMatrix.prototype.create = function (data, datatype) {
    return new SparseMatrix(data, datatype);
  };

  /**
   * Get the matrix density.
   *
   * Usage:
   *     var density = matrix.density()                   // retrieve matrix density
   *
   * @memberof SparseMatrix
   * @return {number}           The matrix density.
   */
  SparseMatrix.prototype.density = function () {
    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];
    // calculate density
    return rows !== 0 && columns !== 0 ? (this._index.length / (rows * columns)) : 0;
  };
  
  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     var subset = matrix.subset(index)               // retrieve subset
   *     var value = matrix.subset(index, replacement)   // replace subset
   *
   * @memberof SparseMatrix
   * @param {Index} index
   * @param {Array | Maytrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  SparseMatrix.prototype.subset = function (index, replacement, defaultValue) { // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke subset on a Pattern only matrix');

    // check arguments
    switch (arguments.length) {
      case 1:
        return _getsubset(this, index);

        // intentional fall through
      case 2:
      case 3:
        return _setsubset(this, index, replacement, defaultValue);

      default:
        throw new SyntaxError('Wrong number of arguments');
    }
  };
  
  var _getsubset = function (matrix, idx) {
    // check idx
    if (!idx || idx.isIndex !== true) {
      throw new TypeError('Invalid index');
    }

    var isScalar = idx.isScalar();
    if (isScalar) {
      // return a scalar
      return matrix.get(idx.min());
    }
    // validate dimensions
    var size = idx.size();
    if (size.length != matrix._size.length) {
      throw new DimensionError(size.length, matrix._size.length);
    }

    // vars
    var i, ii, k, kk;
    
    // validate if any of the ranges in the index is out of range
    var min = idx.min();
    var max = idx.max();
    for (i = 0, ii = matrix._size.length; i < ii; i++) {
      validateIndex(min[i], matrix._size[i]);
      validateIndex(max[i], matrix._size[i]);
    }
    
    // matrix arrays
    var mvalues = matrix._values;
    var mindex = matrix._index;
    var mptr = matrix._ptr;
        
    // rows & columns dimensions for result matrix
    var rows = idx.dimension(0);
    var columns = idx.dimension(1);
    
    // workspace & permutation vector
    var w = [];
    var pv = [];
    
    // loop rows in resulting matrix
    rows.forEach(function (i, r) {
      // update permutation vector
      pv[i] = r[0];  
      // mark i in workspace
      w[i] = true;
    });

    // result matrix arrays
    var values = mvalues ? [] : undefined;
    var index = [];
    var ptr = [];
        
    // loop columns in result matrix
    columns.forEach(function (j) {
      // update ptr
      ptr.push(index.length);
      // loop values in column j
      for (k = mptr[j], kk = mptr[j + 1]; k < kk; k++) {
        // row
        i = mindex[k];
        // check row is in result matrix
        if (w[i] === true) {
          // push index
          index.push(pv[i]);
          // check we need to process values
          if (values)
            values.push(mvalues[k]);
        }
      }
    });
    // update ptr
    ptr.push(index.length);
    
    // return matrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: size,
      datatype: matrix._datatype
    });
  };
  
  var _setsubset = function (matrix, index, submatrix, defaultValue) {
    // check index
    if (!index || index.isIndex !== true) {
      throw new TypeError('Invalid index');
    }
    
    // get index size and check whether the index contains a single value
    var iSize = index.size(),
        isScalar = index.isScalar();
    
    // calculate the size of the submatrix, and convert it into an Array if needed
    var sSize;
    if (submatrix && submatrix.isMatrix === true) {
      // submatrix size
      sSize = submatrix.size();
      // use array representation
      submatrix = submatrix.toArray();
    }
    else {
      // get submatrix size (array, scalar)
      sSize = array.size(submatrix);
    }
    
    // check index is a scalar
    if (isScalar) {
      // verify submatrix is a scalar
      if (sSize.length !== 0) {
        throw new TypeError('Scalar expected');
      }
      // set value
      matrix.set(index.min(), submatrix, defaultValue);
    }
    else {
      // validate dimensions, index size must be one or two dimensions
      if (iSize.length !== 1 && iSize.length !== 2) {
        throw new DimensionError(iSize.length, matrix._size.length, '<');
      }
      
      // check submatrix and index have the same dimensions
      if (sSize.length < iSize.length) {
        // calculate number of missing outer dimensions
        var i = 0;
        var outer = 0;
        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }
        while (iSize[i] === 1) {
          outer++;
          i++;
        }
        // unsqueeze both outer and inner dimensions
        submatrix = array.unsqueeze(submatrix, iSize.length, outer, sSize);
      }
      
      // check whether the size of the submatrix matches the index size
      if (!object.deepEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, '>');
      }
      
      // offsets
      var x0 = index.min()[0];
      var y0 = index.min()[1];      
      
      // submatrix rows and columns
      var m = sSize[0];
      var n = sSize[1];

      // loop submatrix
      for (var x = 0; x < m; x++) {
        // loop columns
        for (var y = 0; y < n; y++) {
          // value at i, j
          var v = submatrix[x][y];
          // invoke set (zero value will remove entry from matrix)
          matrix.set([x + x0, y + y0], v, defaultValue);
        }
      }
    }
    return matrix;
  };

  /**
   * Get a single element from the matrix.
   * @memberof SparseMatrix
   * @param {number[]} index   Zero-based index
   * @return {*} value
   */
  SparseMatrix.prototype.get = function (index) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke get on a Pattern only matrix');

    // row and column
    var i = index[0];
    var j = index[1];

    // check i, j are valid
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[1]);

    // find value index
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    // check k is prior to next column k and it is in the correct row
    if (k < this._ptr[j + 1] && this._index[k] === i)
      return this._values[k];

    return 0;
  };
  
  /**
   * Replace a single element in the matrix.
   * @memberof SparseMatrix
   * @param {number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be set to zero.
   * @return {SparseMatrix} self
   */
  SparseMatrix.prototype.set = function (index, v, defaultValue) {
    if (!isArray(index))
      throw new TypeError('Array expected');
    if (index.length != this._size.length)
      throw new DimensionError(index.length, this._size.length);

    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke set on a Pattern only matrix');
      
    // row and column
    var i = index[0];
    var j = index[1];

    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];
    
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    if (isString(this._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [this._datatype, this._datatype]) || equalScalar;
      // convert 0 to the same datatype
      zero = typed.convert(0, this._datatype);
    }

    // check we need to resize matrix
    if (i > rows - 1 || j > columns - 1) {
      // resize matrix
      _resize(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue);
      // update rows & columns
      rows = this._size[0];
      columns = this._size[1];
    }

    // check i, j are valid
    validateIndex(i, rows);
    validateIndex(j, columns);

    // find value index
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    // check k is prior to next column k and it is in the correct row
    if (k < this._ptr[j + 1] && this._index[k] === i) {
      // check value != 0
      if (!eq(v, zero)) {
        // update value
        this._values[k] = v;
      }
      else {
        // remove value from matrix
        _remove(k, j, this._values, this._index, this._ptr);
      }
    }
    else {
      // insert value @ (i, j)
      _insert(k, i, j, v, this._values, this._index, this._ptr);
    }

    return this;
  };
  
  var _getValueIndex = function(i, top, bottom, index) {
    // check row is on the bottom side
    if (bottom - top === 0)
      return bottom;
    // loop rows [top, bottom[
    for (var r = top; r < bottom; r++) {
      // check we found value index
      if (index[r] === i)
        return r;
    }
    // we did not find row
    return top;
  };

  var _remove = function (k, j, values, index, ptr) {
    // remove value @ k
    values.splice(k, 1);
    index.splice(k, 1);
    // update pointers
    for (var x = j + 1; x < ptr.length; x++)
      ptr[x]--;
  };

  var _insert = function (k, i, j, v, values, index, ptr) {
    // insert value
    values.splice(k, 0, v);
    // update row for k
    index.splice(k, 0, i);
    // update column pointers
    for (var x = j + 1; x < ptr.length; x++)
      ptr[x]++;
  };
  
  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when 
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @memberof SparseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  SparseMatrix.prototype.resize = function (size, defaultValue, copy) {    
    // validate arguments
    if (!isArray(size))
      throw new TypeError('Array expected');
    if (size.length !== 2)
      throw new Error('Only two dimensions matrix are supported');

    // check sizes
    size.forEach(function (value) {
      if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
        throw new TypeError('Invalid size, must contain positive integers ' +
                            '(size: ' + string.format(size) + ')');
      }
    });
    
    // matrix to resize
    var m = copy ? this.clone() : this;
    // resize matrix
    return _resize(m, size[0], size[1], defaultValue);
  };
  
  var _resize = function (matrix, rows, columns, defaultValue) {
    // value to insert at the time of growing matrix
    var value = defaultValue || 0;
    
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    if (isString(matrix._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar;
      // convert 0 to the same datatype
      zero = typed.convert(0, matrix._datatype);
      // convert value to the same datatype
      value = typed.convert(value, matrix._datatype);
    }
    
    // should we insert the value?
    var ins = !eq(value, zero);

    // old columns and rows
    var r = matrix._size[0];
    var c = matrix._size[1];

    var i, j, k;

    // check we need to increase columns
    if (columns > c) {
      // loop new columns
      for (j = c; j < columns; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._values.length;
        // check we need to insert matrix._values
        if (ins) {
          // loop rows
          for (i = 0; i < r; i++) {
            // add new matrix._values
            matrix._values.push(value);
            // update matrix._index
            matrix._index.push(i);
          }
        }        
      }
      // store number of matrix._values in matrix._ptr
      matrix._ptr[columns] = matrix._values.length;
    }
    else if (columns < c) {
      // truncate matrix._ptr
      matrix._ptr.splice(columns + 1, c - columns);
      // truncate matrix._values and matrix._index
      matrix._values.splice(matrix._ptr[columns], matrix._values.length);
      matrix._index.splice(matrix._ptr[columns], matrix._index.length);
    }
    // update columns
    c = columns;

    // check we need to increase rows
    if (rows > r) {
      // check we have to insert values
      if (ins) {
        // inserts
        var n = 0;
        // loop columns
        for (j = 0; j < c; j++) {
          // update matrix._ptr for current column
          matrix._ptr[j] = matrix._ptr[j] + n;
          // where to insert matrix._values
          k = matrix._ptr[j + 1] + n;
          // pointer
          var p = 0;
          // loop new rows, initialize pointer
          for (i = r; i < rows; i++, p++) {
            // add value
            matrix._values.splice(k + p, 0, value);
            // update matrix._index
            matrix._index.splice(k + p, 0, i);
            // increment inserts
            n++;
          }
        }
        // store number of matrix._values in matrix._ptr
        matrix._ptr[c] = matrix._values.length;
      }
    }
    else if (rows < r) {
      // deletes
      var d = 0;
      // loop columns
      for (j = 0; j < c; j++) {
        // update matrix._ptr for current column
        matrix._ptr[j] = matrix._ptr[j] - d;
        // where matrix._values start for next column
        var k0 = matrix._ptr[j];
        var k1 = matrix._ptr[j + 1] - d;
        // loop matrix._index
        for (k = k0; k < k1; k++) {
          // row
          i = matrix._index[k];
          // check we need to delete value and matrix._index
          if (i > rows - 1) {
            // remove value
            matrix._values.splice(k, 1);
            // remove item from matrix._index
            matrix._index.splice(k, 1);
            // increase deletes
            d++;
          }
        }
      }
      // update matrix._ptr for current column
      matrix._ptr[j] = matrix._values.length;
    }
    // update matrix._size
    matrix._size[0] = rows;
    matrix._size[1] = columns;
    // return matrix
    return matrix;
  };

  /**
   * Reshape the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (reshape in place).
   *
   * NOTE: This might be better suited to copy by default, instead of modifying
   *       in place. For now, it operates in place to remain consistent with
   *       resize().
   *
   * @memberof SparseMatrix
   * @param {number[]} size           The new size the matrix should have.
   * @param {boolean} [copy]          Return a reshaped copy of the matrix
   *
   * @return {Matrix}                 The reshaped matrix
   */
  SparseMatrix.prototype.reshape = function (size, copy) {

    // validate arguments
    if (!isArray(size))
      throw new TypeError('Array expected');
    if (size.length !== 2)
      throw new Error('Sparse matrices can only be reshaped in two dimensions');

    // check sizes
    size.forEach(function (value) {
      if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
        throw new TypeError('Invalid size, must contain positive integers ' +
                            '(size: ' + string.format(size) + ')');
      }
    });

    // m * n must not change
    if(this._size[0] * this._size[1] !== size[0] * size[1]) {
      throw new Error('Reshaping sparse matrix will result in the wrong number of elements');
    }

    // matrix to reshape
    var m = copy ? this.clone() : this;

    // return unchanged if the same shape
    if(this._size[0] === size[0] && this._size[1] === size[1]) {
      return m;
    }

    // Convert to COO format (generate a column index)
    var colIndex = [];
    for(var i=0; i<m._ptr.length; i++) {
      for(var j=0; j<m._ptr[i+1]-m._ptr[i]; j++) {
        colIndex.push(i);
      }
    }

    // Clone the values array
    var values = m._values.slice();

    // Clone the row index array
    var rowIndex = m._index.slice();

    // Transform the (row, column) indices
    for(var i=0; i<m._index.length; i++) {
      var r1 = rowIndex[i];
      var c1 = colIndex[i];
      var flat = r1 * m._size[1] + c1;
      colIndex[i] = flat % size[1];
      rowIndex[i] = Math.floor(flat / size[1]);
    }

    // Now reshaping is supposed to preserve the row-major order, BUT these sparse matrices are stored
    // in column-major order, so we have to reorder the value array now. One option is to use a multisort,
    // sorting several arrays based on some other array.

    // OR, we could easily just:

    // 1. Remove all values from the matrix
    m._values.length = 0;
    m._index.length = 0;
    m._ptr.length = size[1] + 1;
    m._size = size.slice();
    for(var i=0; i<m._ptr.length; i++) {
      m._ptr[i] = 0;
    }

    // 2. Re-insert all elements in the proper order (simplified code from SparseMatrix.prototype.set)
    // This step is probably the most time-consuming
    for(var h=0; h<values.length; h++) {
      var i = rowIndex[h];
      var j = colIndex[h];
      var v = values[h];
      var k = _getValueIndex(i, m._ptr[j], m._ptr[j + 1], m._index);
      _insert(k, i, j, v, m._values, m._index, m._ptr);
    }

    // The value indices are inserted out of order, but apparently that's... still OK?

    return m;
  }
  
  /**
   * Create a clone of the matrix
   * @memberof SparseMatrix
   * @return {SparseMatrix} clone
   */
  SparseMatrix.prototype.clone = function () {
    var m = new SparseMatrix({
      values: this._values ? object.clone(this._values) : undefined,
      index: object.clone(this._index),
      ptr: object.clone(this._ptr),
      size: object.clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  
  /**
   * Retrieve the size of the matrix.
   * @memberof SparseMatrix
   * @returns {number[]} size
   */
  SparseMatrix.prototype.size = function() {
    return this._size.slice(0); // copy the Array
  };
  
  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @memberof SparseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {SparseMatrix} matrix
   */
  SparseMatrix.prototype.map = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke map on a Pattern only matrix');
    // matrix instance
    var me = this;
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // invoke callback
    var invoke = function (v, i, j) {
      // invoke callback
      return callback(v, [i, j], me);
    };
    // invoke _map
    return _map(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros);
  };

  /**
   * Create a new matrix with the results of the callback function executed on the interval
   * [minRow..maxRow, minColumn..maxColumn].
   */
  var _map = function (matrix, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
    // result arrays
    var values = [];
    var index = [];
    var ptr = [];
    
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    if (isString(matrix._datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [matrix._datatype, matrix._datatype]) || equalScalar;
      // convert 0 to the same datatype
      zero = typed.convert(0, matrix._datatype);
    }
    
    // invoke callback
    var invoke = function (v, x, y) {
      // invoke callback
      v = callback(v, x, y);
      // check value != 0
      if (!eq(v, zero)) {
        // store value
        values.push(v);
        // index
        index.push(x);
      }
    };
    // loop columns
    for (var j = minColumn; j <= maxColumn; j++) {
      // store pointer to values index
      ptr.push(values.length);
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = matrix._ptr[j];
      var k1 = matrix._ptr[j + 1];
      // row pointer
      var p = minRow;
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        var i = matrix._index[k];
        // check i is in range
        if (i >= minRow && i <= maxRow) {
          // zero values
          if (!skipZeros) {
           for (var x = p; x < i; x++)
             invoke(0, x - minRow, j - minColumn);
          }
          // value @ k
          invoke(matrix._values[k], i - minRow, j - minColumn);
        }
        // update pointer
        p = i + 1;
      }
      // zero values
      if (!skipZeros) {
        for (var y = p; y <= maxRow; y++)
          invoke(0, y - minRow, j - minColumn);
      }
    }
    // store number of values in ptr
    ptr.push(values.length);
    // return sparse matrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
    });
  };
  
  /**
   * Execute a callback function on each entry of the matrix.
   * @memberof SparseMatrix
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   */
  SparseMatrix.prototype.forEach = function (callback, skipZeros) {
    // check it is a pattern matrix
    if (!this._values)
      throw new Error('Cannot invoke forEach on a Pattern only matrix');
    // matrix instance
    var me = this;
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // column pointer
      var p = 0;
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        var i = this._index[k];
        // check we need to process zeros
        if (!skipZeros) {
          // zero values
          for (var x = p; x < i; x++)
            callback(0, [x, j], me);
        }
        // value @ k
        callback(this._values[k], [i, j], me);
        // update pointer
        p = i + 1;
      }
      // check we need to process zeros
      if (!skipZeros) {
        // zero values
        for (var y = p; y < rows; y++)
          callback(0, [y, j], me);
      }
    }
  };
  
  /**
   * Create an Array with a copy of the data of the SparseMatrix
   * @memberof SparseMatrix
   * @returns {Array} array
   */
  SparseMatrix.prototype.toArray = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, true);
  };

  /**
   * Get the primitive value of the SparseMatrix: a two dimensions array
   * @memberof SparseMatrix
   * @returns {Array} array
   */
  SparseMatrix.prototype.valueOf = function () {
    return _toArray(this._values, this._index, this._ptr, this._size, false);
  };
  
  var _toArray = function (values, index, ptr, size, copy) {    
    // rows and columns
    var rows = size[0];
    var columns = size[1];
    // result
    var a = [];
    // vars
    var i, j;
    // initialize array
    for (i = 0; i < rows; i++) {
      a[i] = [];
      for (j = 0; j < columns; j++)
        a[i][j] = 0;
    }

    // loop columns
    for (j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        i = index[k];
        // set value (use one for pattern matrix)
        a[i][j] = values ? (copy ? object.clone(values[k]) : values[k]) : 1;
      }
    }
    return a;
  };
  
  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @memberof SparseMatrix
   * @param {Object | number | Function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  SparseMatrix.prototype.format = function (options) {
    // rows and columns
    var rows = this._size[0];
    var columns = this._size[1];
    // density
    var density = this.density();
    // rows & columns
    var str = 'Sparse Matrix [' + string.format(rows, options) + ' x ' + string.format(columns, options) + '] density: ' + string.format(density, options) + '\n';
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // loop k within [k0, k1[
      for (var k = k0; k < k1; k++) {
        // row index
        var i = this._index[k];
        // append value
        str += '\n    (' + string.format(i, options) + ', ' + string.format(j, options) + ') ==> ' + (this._values ? string.format(this._values[k], options) : 'X');
      }
    }
    return str;
  };
  
  /**
   * Get a string representation of the matrix
   * @memberof SparseMatrix
   * @returns {string} str
   */
  SparseMatrix.prototype.toString = function () {
    return string.format(this.toArray());
  };
  
  /**
   * Get a JSON representation of the matrix
   * @memberof SparseMatrix
   * @returns {Object}
   */
  SparseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'SparseMatrix',
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size,
      datatype: this._datatype
    };
  };

  /**
   * Get the kth Matrix diagonal.
   *
   * @memberof SparseMatrix
   * @param {number | BigNumber} [k=0]     The kth diagonal where the vector will retrieved.
   *
   * @returns {Matrix}                     The matrix vector with the diagonal values.
   */
  SparseMatrix.prototype.diagonal = function(k) {
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (k.isBigNumber === true)
        k = k.toNumber();
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('The parameter k must be an integer number');
      }
    }
    else {
      // default value
      k = 0;
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    
    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];
    
    // number diagonal values
    var n = Math.min(rows - kSub, columns -  kSuper);
    
    // diagonal arrays
    var values = [];
    var index = [];
    var ptr = [];
    // initial ptr value
    ptr[0] = 0;
    // loop columns
    for (var j = kSuper; j < columns && values.length < n; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      // loop x within [k0, k1[
      for (var x = k0; x < k1; x++) {
        // row index
        var i = this._index[x];
        // check row
        if (i === j - kSuper + kSub) {
          // value on this column
          values.push(this._values[x]);
          // store row
          index[values.length - 1] = i - kSub;
          // exit loop
          break;
        }
      }
    }
    // close ptr
    ptr.push(values.length);
    // return matrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [n, 1]
    });
  };
  
  /**
   * Generate a matrix from a JSON object
   * @memberof SparseMatrix
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "SparseMatrix", "values": [], "index": [], "ptr": [], "size": []}`,
   *                       where mathjs is optional
   * @returns {SparseMatrix}
   */
  SparseMatrix.fromJSON = function (json) {
    return new SparseMatrix(json);
  };

  /**
   * Create a diagonal matrix.
   *
   * @memberof SparseMatrix
   * @param {Array} size                       The matrix size.
   * @param {number | Array | Matrix } value   The values for the diagonal.
   * @param {number | BigNumber} [k=0]         The kth diagonal where the vector will be filled in.
   * @param {string} [datatype]                The Matrix datatype, values must be of this datatype.
   *
   * @returns {SparseMatrix}
   */
  SparseMatrix.diagonal = function (size, value, k, defaultValue, datatype) {
    if (!isArray(size))
      throw new TypeError('Array expected, size parameter');
    if (size.length !== 2)
      throw new Error('Only two dimensions matrix are supported');
    
    // map size & validate
    size = size.map(function (s) {
      // check it is a big number
      if (s && s.isBigNumber === true) {
        // convert it
        s = s.toNumber();
      }
      // validate arguments
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error('Size values must be positive integers');
      } 
      return s;
    });
    
    // validate k if any
    if (k) {
      // convert BigNumber to a number
      if (k.isBigNumber === true)
        k = k.toNumber();
      // is must be an integer
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('The parameter k must be an integer number');
      }
    }
    else {
      // default value
      k = 0;
    }

    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;

    if (isString(datatype)) {
      // find signature that matches (datatype, datatype)
      eq = typed.find(equalScalar, [datatype, datatype]) || equalScalar;
      // convert 0 to the same datatype
      zero = typed.convert(0, datatype);
    }
    
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    
    // rows and columns
    var rows = size[0];
    var columns = size[1];
    
    // number of non-zero items
    var n = Math.min(rows - kSub, columns -  kSuper);
    
    // value extraction function
    var _value;
      
    // check value
    if (isArray(value)) {
      // validate array
      if (value.length !== n) {
        // number of values in array must be n
        throw new Error('Invalid value array length');
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value[i];
      };
    }
    else if (value && value.isMatrix === true) {
      // matrix size
      var ms = value.size();
      // validate matrix
      if (ms.length !== 1 || ms[0] !== n) {
        // number of values in array must be n
        throw new Error('Invalid matrix length');
      }
      // define function
      _value = function (i) {
        // return value @ i
        return value.get([i]);
      };
    }
    else {
      // define function
      _value = function () {
        // return value
        return value;
      };
    }
    
    // create arrays
    var values = [];
    var index = [];
    var ptr = [];
    
    // loop items
    for (var j = 0; j < columns; j++) {
      // number of rows with value
      ptr.push(values.length);
      // diagonal index
      var i = j - kSuper;      
      // check we need to set diagonal value
      if (i >= 0 && i < n) {
        // get value @ i
        var v = _value(i);
        // check for zero
        if (!eq(v, zero)) {
          // column
          index.push(i + kSub);
          // add value
          values.push(v);
        }
      }
    }
    // last value should be number of values
    ptr.push(values.length);
    // create SparseMatrix
    return new SparseMatrix({
      values: values,
      index: index,
      ptr: ptr,
      size: [rows, columns]
    });
  };
  
  /**
   * Swap rows i and j in Matrix.
   *
   * @memberof SparseMatrix
   * @param {number} i       Matrix row index 1
   * @param {number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */
  SparseMatrix.prototype.swapRows = function (i, j) {
    // check index
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error('Row index must be positive integers');
    }
    // check dimensions
    if (this._size.length !== 2) {
      throw new Error('Only two dimensional matrix is supported');
    }
    // validate index
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]);
    
    // swap rows
    SparseMatrix._swapRows(i, j, this._size[1], this._values, this._index, this._ptr);
    // return current instance
    return this;
  };
  
  /**
   * Loop rows with data in column j.
   *
   * @param {number} j            Column
   * @param {Array} values        Matrix values
   * @param {Array} index         Matrix row indeces
   * @param {Array} ptr           Matrix column pointers
   * @param {Function} callback   Callback function invoked for every row in column j
   */
  SparseMatrix._forEachRow = function (j, values, index, ptr, callback) {
    // indeces for column j
    var k0 = ptr[j];
    var k1 = ptr[j + 1];
    // loop
    for (var k = k0; k < k1; k++) {
      // invoke callback
      callback(index[k], values[k]);
    }
  };
  
  /**
   * Swap rows x and y in Sparse Matrix data structures.
   *
   * @param {number} x         Matrix row index 1
   * @param {number} y         Matrix row index 2
   * @param {number} columns   Number of columns in matrix
   * @param {Array} values     Matrix values
   * @param {Array} index      Matrix row indeces
   * @param {Array} ptr        Matrix column pointers
   */
  SparseMatrix._swapRows = function (x, y, columns, values, index, ptr) {
    // loop columns
    for (var j = 0; j < columns; j++) {
      // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      // find value index @ x
      var kx = _getValueIndex(x, k0, k1, index);
      // find value index @ x
      var ky = _getValueIndex(y, k0, k1, index);
      // check both rows exist in matrix
      if (kx < k1 && ky < k1 && index[kx] === x && index[ky] === y) {
        // swap values (check for pattern matrix)
        if (values) {
          var v = values[kx];
          values[kx] = values[ky];
          values[ky] = v;
        }
        // next column
        continue;
      }
      // check x row exist & no y row
      if (kx < k1 && index[kx] === x && (ky >= k1 || index[ky] !== y)) {
        // value @ x (check for pattern matrix)
        var vx = values ? values[kx] : undefined;
        // insert value @ y
        index.splice(ky, 0, y);
        if (values)
          values.splice(ky, 0, vx);        
        // remove value @ x (adjust array index if needed)
        index.splice(ky <= kx ? kx + 1 : kx, 1);
        if (values)
          values.splice(ky <= kx ? kx + 1 : kx, 1);
        // next column
        continue;
      }
      // check y row exist & no x row
      if (ky < k1 && index[ky] === y && (kx >= k1 || index[kx] !== x)) {
        // value @ y (check for pattern matrix)
        var vy = values ? values[ky] : undefined;
        // insert value @ x
        index.splice(kx, 0, x);
        if (values)
          values.splice(kx, 0, vy);
        // remove value @ y (adjust array index if needed)
        index.splice(kx <= ky ? ky + 1 : ky, 1);
        if (values)
          values.splice(kx <= ky ? ky + 1 : ky, 1);
      }
    }
  };

  // register this type in the base class Matrix
  type.Matrix._storage.sparse = SparseMatrix;

  return SparseMatrix;
}

exports.name = 'SparseMatrix';
exports.path = 'type';
exports.factory = factory;
exports.lazy = false;  // no lazy loading, as we alter type.Matrix._storage


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load) {
  
  var add = load(__webpack_require__(16));
  var equalScalar = load(__webpack_require__(7));
  
  /**
   * An ordered Sparse Accumulator is a representation for a sparse vector that includes a dense array 
   * of the vector elements and an ordered list of non-zero elements.
   */
  function Spa() {
    if (!(this instanceof Spa))
      throw new SyntaxError('Constructor must be called with the new operator');
    
    // allocate vector, TODO use typed arrays
    this._values = [];
    this._heap = new type.FibonacciHeap();
  }

  /**
   * Attach type information
   */
  Spa.prototype.type = 'Spa';
  Spa.prototype.isSpa = true;

  /**
   * Set the value for index i.
   *
   * @param {number} i                       The index
   * @param {number | BigNumber | Complex}   The value at index i
   */
  Spa.prototype.set = function (i, v) {
    // check we have a value @ i
    if (!this._values[i]) {
      // insert in heap
      var node = this._heap.insert(i, v);
      // set the value @ i
      this._values[i] = node;
    }
    else {
      // update the value @ i
      this._values[i].value = v;
    }
  };
  
  Spa.prototype.get = function (i) {
    var node = this._values[i];
    if (node)
      return node.value;
    return 0;
  };
  
  Spa.prototype.accumulate = function (i, v) {
    // node @ i
    var node = this._values[i];
    if (!node) {
      // insert in heap
      node = this._heap.insert(i, v);
      // initialize value
      this._values[i] = node;
    }
    else {
      // accumulate value
      node.value = add(node.value, v);
    }
  };
  
  Spa.prototype.forEach = function (from, to, callback) {
    // references
    var heap = this._heap;
    var values = this._values;
    // nodes
    var nodes = [];
    // node with minimum key, save it
    var node = heap.extractMinimum();
    if (node)
      nodes.push(node);
    // extract nodes from heap (ordered)
    while (node && node.key <= to) {
      // check it is in range
      if (node.key >= from) {
        // check value is not zero
        if (!equalScalar(node.value, 0)) {
          // invoke callback
          callback(node.key, node.value, this);
        }
      }
      // extract next node, save it
      node = heap.extractMinimum();
      if (node)
        nodes.push(node);
    }
    // reinsert all nodes in heap
    for (var i = 0; i < nodes.length; i++) {
      // current node
      var n = nodes[i];
      // insert node in heap
      node = heap.insert(n.key, n.value);
      // update values
      values[node.key] = node;
    }
  };
  
  Spa.prototype.swap = function (i, j) {
    // node @ i and j
    var nodei = this._values[i];
    var nodej = this._values[j];
    // check we need to insert indeces
    if (!nodei && nodej) {
      // insert in heap
      nodei = this._heap.insert(i, nodej.value);
      // remove from heap
      this._heap.remove(nodej);
      // set values
      this._values[i] = nodei;
      this._values[j] = undefined;
    }
    else if (nodei && !nodej) {
      // insert in heap
      nodej = this._heap.insert(j, nodei.value);
      // remove from heap
      this._heap.remove(nodei);
      // set values
      this._values[j] = nodej;
      this._values[i] = undefined;
    }
    else if (nodei && nodej) {
      // swap values
      var v = nodei.value;
      nodei.value = nodej.value;
      nodej.value = v;
    }
  };
  
  return Spa;
}

exports.name = 'Spa';
exports.path = 'type';
exports.factory = factory;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {

  var equalScalar = load(__webpack_require__(7));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij). 
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ┤  A(i,j)       ; A(i,j) !== 0
   *          └  B(i,j)       ; B(i,j) !== 0
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  var algorithm04 = function (a, b, callback) {
    // sparse matrix arrays
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    // sparse matrix arrays
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;

    // validate dimensions
    if (asize.length !== bsize.length)
      throw new DimensionError(asize.length, bsize.length);

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1])
      throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = avalues && bvalues ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // workspace
    var xa = avalues && bvalues ? [] : undefined;
    var xb = avalues && bvalues ? [] : undefined;
    // marks indicating we have a value in x for a given column
    var wa = [];
    var wb = [];

    // vars 
    var i, j, k, k0, k1;
    
    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length;
      // columns mark
      var mark = j + 1;
      // loop A(:,j)
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k];
        // update c
        cindex.push(i);
        // update workspace
        wa[i] = mark;
        // check we need to process values
        if (xa)
          xa[i] = avalues[k];
      }
      // loop B(:,j)
      for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k];
        // check row exists in A
        if (wa[i] === mark) {
          // update record in xa @ i
          if (xa) {
            // invoke callback
            var v = cf(xa[i], bvalues[k]);
            // check for zero
            if (!eq(v, zero)) {
              // update workspace
              xa[i] = v;              
            }
            else {
              // remove mark (index will be removed later)
              wa[i] = null;
            }
          }
        }
        else {
          // update c
          cindex.push(i);
          // update workspace
          wb[i] = mark;
          // check we need to process values
          if (xb)
            xb[i] = bvalues[k];
        }
      }
      // check we need to process values (non pattern matrix)
      if (xa && xb) {
        // initialize first index in j
        k = cptr[j];
        // loop index in j
        while (k < cindex.length) {
          // row
          i = cindex[k];
          // check workspace has value @ i
          if (wa[i] === mark) {
            // push value (Aij != 0 || (Aij != 0 && Bij != 0))
            cvalues[k] = xa[i];
            // increment pointer
            k++;
          }
          else if (wb[i] === mark) {
            // push value (bij != 0)
            cvalues[k] = xb[i];
            // increment pointer
            k++;
          }
          else {
            // remove index @ k
            cindex.splice(k, 1);
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };
  
  return algorithm04;
}

exports.name = 'algorithm04';
exports.factory = factory;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {
  
  var smaller = load(__webpack_require__(32));
  var larger = load(__webpack_require__(54));
  
  var oneOverLogPhi = 1.0 / Math.log((1.0 + Math.sqrt(5.0)) / 2.0);
  
  /**
   * Fibonacci Heap implementation, used interally for Matrix math.
   * @class FibonacciHeap
   * @constructor FibonacciHeap
   */
  function FibonacciHeap() {
    if (!(this instanceof FibonacciHeap))
      throw new SyntaxError('Constructor must be called with the new operator');

    // initialize fields
    this._minimum = null;
    this._size = 0;
  }

  /**
   * Attach type information
   */
  FibonacciHeap.prototype.type = 'FibonacciHeap';
  FibonacciHeap.prototype.isFibonacciHeap = true;

  /**
   * Inserts a new data element into the heap. No heap consolidation is
   * performed at this time, the new node is simply inserted into the root
   * list of this heap. Running time: O(1) actual.
   * @memberof FibonacciHeap
   */
  FibonacciHeap.prototype.insert = function (key, value) {
    // create node
    var node = {
      key: key,
      value: value,
      degree: 0
    };
    // check we have a node in the minimum
    if (this._minimum) {
      // minimum node
      var minimum = this._minimum;
      // update left & right of node
      node.left = minimum;
      node.right = minimum.right;
      minimum.right = node;
      node.right.left = node;
      // update minimum node in heap if needed
      if (smaller(key, minimum.key)) {
        // node has a smaller key, use it as minimum
        this._minimum = node;
      }
    }
    else {
      // set left & right
      node.left = node;
      node.right = node;
      // this is the first node
      this._minimum = node;
    }
    // increment number of nodes in heap
    this._size++;
    // return node
    return node;
  };

  /**
   * Returns the number of nodes in heap. Running time: O(1) actual.
   * @memberof FibonacciHeap
   */
  FibonacciHeap.prototype.size = function () {
    return this._size;
  };

  /**
   * Removes all elements from this heap.
   * @memberof FibonacciHeap
   */
  FibonacciHeap.prototype.clear = function () {
    this._minimum = null;
    this._size = 0;
  };

  /**
   * Returns true if the heap is empty, otherwise false.
   * @memberof FibonacciHeap
   */
  FibonacciHeap.prototype.isEmpty = function () {
    return !!this._minimum;
  };
  
  /**
   * Extracts the node with minimum key from heap. Amortized running 
   * time: O(log n).
   * @memberof FibonacciHeap
   */
  FibonacciHeap.prototype.extractMinimum = function () {
    // node to remove
    var node = this._minimum;
    // check we have a minimum
    if (node === null)
      return node;
    // current minimum
    var minimum = this._minimum;
    // get number of children
    var numberOfChildren = node.degree;
    // pointer to the first child
    var x = node.child;
    // for each child of node do...
    while (numberOfChildren > 0) {
      // store node in right side
      var tempRight = x.right;
      // remove x from child list
      x.left.right = x.right;
      x.right.left = x.left;
      // add x to root list of heap
      x.left = minimum;
      x.right = minimum.right;
      minimum.right = x;
      x.right.left = x;
      // set Parent[x] to null
      x.parent = null;
      x = tempRight;
      numberOfChildren--;
    }
    // remove node from root list of heap
    node.left.right = node.right;
    node.right.left = node.left;
    // update minimum
    if (node == node.right) {
      // empty
      minimum = null;
    }
    else {
      // update minimum
      minimum = node.right;
      // we need to update the pointer to the root with minimum key
      minimum = _findMinimumNode(minimum, this._size);
    }
    // decrement size of heap
    this._size--;
    // update minimum
    this._minimum = minimum;
    // return node
    return node;
  };
  
  /**
   * Removes a node from the heap given the reference to the node. The trees
   * in the heap will be consolidated, if necessary. This operation may fail
   * to remove the correct element if there are nodes with key value -Infinity.
   * Running time: O(log n) amortized.
   * @memberof FibonacciHeap
   */
  FibonacciHeap.prototype.remove = function (node) {
    // decrease key value
    this._minimum = _decreaseKey(this._minimum, node, -1);
    // remove the smallest
    this.extractMinimum();
  };
  
  /**
   * Decreases the key value for a heap node, given the new value to take on.
   * The structure of the heap may be changed and will not be consolidated. 
   * Running time: O(1) amortized.
   * @memberof FibonacciHeap
   */
  var _decreaseKey = function (minimum, node, key) {
    // set node key
    node.key = key;
    // get parent node
    var parent = node.parent;
    if (parent && smaller(node.key, parent.key)) {
      // remove node from parent
      _cut(minimum, node, parent);
      // remove all nodes from parent to the root parent
      _cascadingCut(minimum, parent);
    }
    // update minimum node if needed
    if (smaller(node.key, minimum.key))
      minimum = node;
    // return minimum
    return minimum;
  };
  
  /**
   * The reverse of the link operation: removes node from the child list of parent.
   * This method assumes that min is non-null. Running time: O(1).
   * @memberof FibonacciHeap
   */
  var _cut = function (minimum, node, parent) {
    // remove node from parent children and decrement Degree[parent]
    node.left.right = node.right;
    node.right.left = node.left;
    parent.degree--;
    // reset y.child if necessary
    if (parent.child == node)
      parent.child = node.right;
    // remove child if degree is 0
    if (parent.degree === 0)
      parent.child = null;
    // add node to root list of heap
    node.left = minimum;
    node.right = minimum.right;
    minimum.right = node;
    node.right.left = node;
    // set parent[node] to null
    node.parent = null;
    // set mark[node] to false
    node.mark = false;
  };
  
  /**
   * Performs a cascading cut operation. This cuts node from its parent and then
   * does the same for its parent, and so on up the tree.
   * Running time: O(log n); O(1) excluding the recursion.
   * @memberof FibonacciHeap
   */
  var _cascadingCut= function (minimum, node) {
    // store parent node
    var parent = node.parent;
    // if there's a parent...
    if (!parent)
      return;
    // if node is unmarked, set it marked
    if (!node.mark) {
      node.mark = true;
    }
    else {
      // it's marked, cut it from parent
      _cut(minimum, node, parent);
      // cut its parent as well
      _cascadingCut(parent);
    }
  };
  
  /**
   * Make the first node a child of the second one. Running time: O(1) actual.
   * @memberof FibonacciHeap
   */
  var _linkNodes = function (node, parent) {
    // remove node from root list of heap
    node.left.right = node.right;
    node.right.left = node.left;
    // make node a Child of parent
    node.parent = parent;
    if (!parent.child) {
      parent.child = node;
      node.right = node;
      node.left = node;
    }
    else {
      node.left = parent.child;
      node.right = parent.child.right;
      parent.child.right = node;
      node.right.left = node;
    }
    // increase degree[parent]
    parent.degree++;
    // set mark[node] false
    node.mark = false;
  };
  
  var _findMinimumNode = function (minimum, size) {
    // to find trees of the same degree efficiently we use an array of length O(log n) in which we keep a pointer to one root of each degree
    var arraySize = Math.floor(Math.log(size) * oneOverLogPhi) + 1;
    // create list with initial capacity
    var array = new Array(arraySize);
    // find the number of root nodes.
    var numRoots = 0;
    var x = minimum;
    if (x) {
      numRoots++;
      x = x.right;
      while (x !== minimum) {
        numRoots++;
        x = x.right;
      }
    }
    // vars
    var y;
    // For each node in root list do...
    while (numRoots > 0) {
      // access this node's degree..
      var d = x.degree;
      // get next node
      var next = x.right;
      // check if there is a node already in array with the same degree
      while (true) {
        // get node with the same degree is any
        y = array[d];
        if (!y)
          break;
        // make one node with the same degree a child of the other, do this based on the key value.
        if (larger(x.key, y.key)) {
          var temp = y;
          y = x;
          x = temp;
        }
        // make y a child of x
        _linkNodes(y, x);
        // we have handled this degree, go to next one.
        array[d] = null;
        d++;
      }
      // save this node for later when we might encounter another of the same degree.
      array[d] = x;
      // move forward through list.
      x = next;
      numRoots--;
    }
    // Set min to null (effectively losing the root list) and reconstruct the root list from the array entries in array[].
    minimum = null;
    // loop nodes in array
    for (var i = 0; i < arraySize; i++) {
      // get current node
      y = array[i];
      if (!y)
        continue;
      // check if we have a linked list
      if (minimum) {
        // First remove node from root list.
        y.left.right = y.right;
        y.right.left = y.left;
        // now add to root list, again.
        y.left = minimum;
        y.right = minimum.right;
        minimum.right = y;
        y.right.left = y;
        // check if this is a new min.
        if (smaller(y.key, minimum.key))
          minimum = y;
      }
      else
        minimum = y;
    }
    return minimum;
  };
  
  return FibonacciHeap;
}

exports.name = 'FibonacciHeap';
exports.path = 'type';
exports.factory = factory;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nearlyEqual = __webpack_require__(2).nearlyEqual;
var bigNearlyEqual = __webpack_require__(15);

function factory (type, config, load, typed) {
  
  var matrix = load(__webpack_require__(0));

  var algorithm03 = load(__webpack_require__(18));
  var algorithm07 = load(__webpack_require__(33));
  var algorithm12 = load(__webpack_require__(22));
  var algorithm13 = load(__webpack_require__(10));
  var algorithm14 = load(__webpack_require__(8));

  var latex = __webpack_require__(6);

  /**
   * Test whether value x is larger than y.
   *
   * The function returns true when x is larger than y and the relative
   * difference between x and y is larger than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.larger(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 3);             // returns false
   *    math.larger(5, 2 + 2);         // returns true
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('2 inch');
   *    math.larger(a, b);             // returns false
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the x is larger than y, else returns false
   */
  var larger = typed('larger', {

    'boolean, boolean': function (x, y) {
      return x > y;
    },

    'number, number': function (x, y) {
      return x > y && !nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.gt(y) && !bigNearlyEqual(x, y, config.epsilon);
    },

    'Fraction, Fraction': function (x, y) {
      return x.compare(y) === 1;
    },

    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return larger(x.value, y.value);
    },

    'string, string': function (x, y) {
      return x > y;
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = algorithm07(x, y, larger);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, larger, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, larger, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, larger);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return larger(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return larger(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return larger(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm12(x, y, larger, false);
          break;
        default:
          c = algorithm14(x, y, larger, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = algorithm12(y, x, larger, true);
          break;
        default:
          c = algorithm14(y, x, larger, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, larger, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, larger, true).valueOf();
    }
  });

  larger.toTex = {
    2: '\\left(${args[0]}' + latex.operators['larger'] + '${args[1]}\\right)'
  };

  return larger;
}

exports.name = 'larger';
exports.factory = factory;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(5);

var string = util.string;
var object = util.object;

var isArray = Array.isArray;
var isString = string.isString;

function factory (type, config, load) {

  var DenseMatrix = load(__webpack_require__(29));

  var smaller = load(__webpack_require__(32));

  function ImmutableDenseMatrix(data, datatype) {
    if (!(this instanceof ImmutableDenseMatrix))
      throw new SyntaxError('Constructor must be called with the new operator');
    if (datatype && !isString(datatype))
      throw new Error('Invalid datatype: ' + datatype);

    if ((data && data.isMatrix === true) || isArray(data)) {
      // use DenseMatrix implementation
      var matrix = new DenseMatrix(data, datatype);
      // internal structures
      this._data = matrix._data;
      this._size = matrix._size;
      this._datatype = matrix._datatype;
      this._min = null;
      this._max = null;
    }
    else if (data && isArray(data.data) && isArray(data.size)) {
      // initialize fields from JSON representation
      this._data = data.data;
      this._size = data.size;
      this._datatype = data.datatype;
      this._min = typeof data.min !== 'undefined' ? data.min : null;
      this._max = typeof data.max !== 'undefined' ? data.max : null;
    }
    else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._data = [];
      this._size = [0];
      this._datatype = datatype;
      this._min = null;
      this._max = null;
    }
  }

  ImmutableDenseMatrix.prototype = new DenseMatrix();

  /**
   * Attach type information
   */
  ImmutableDenseMatrix.prototype.type = 'ImmutableDenseMatrix';
  ImmutableDenseMatrix.prototype.isImmutableDenseMatrix = true;

  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     var subset = matrix.subset(index)               // retrieve subset
   *     var value = matrix.subset(index, replacement)   // replace subset
   *
   * @param {Index} index
   * @param {Array | ImmutableDenseMatrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  ImmutableDenseMatrix.prototype.subset = function (index) {
    switch (arguments.length) {
      case 1:
        // use base implementation
        var m = DenseMatrix.prototype.subset.call(this, index);
        // check result is a matrix
        if (m.isMatrix) {
          // return immutable matrix
          return new ImmutableDenseMatrix({
            data: m._data,
            size: m._size,
            datatype: m._datatype
          });
        }
        return m;
        
        // intentional fall through
      case 2:
      case 3:
        throw new Error('Cannot invoke set subset on an Immutable Matrix instance');

      default:
        throw new SyntaxError('Wrong number of arguments');
    }
  };

  /**
   * Replace a single element in the matrix.
   * @param {Number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be left undefined.
   * @return {ImmutableDenseMatrix} self
   */
  ImmutableDenseMatrix.prototype.set = function () {
    throw new Error('Cannot invoke set on an Immutable Matrix instance');
  };

  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @param {Number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  ImmutableDenseMatrix.prototype.resize = function () {
    throw new Error('Cannot invoke resize on an Immutable Matrix instance');
  };

  /**
   * Disallows reshaping in favor of immutability.
   *
   * @throws {Error} Operation not allowed
   */
  ImmutableDenseMatrix.prototype.reshape = function () {
    throw new Error('Cannot invoke reshape on an Immutable Matrix instance');
  };

  /**
   * Create a clone of the matrix
   * @return {ImmutableDenseMatrix} clone
   */
  ImmutableDenseMatrix.prototype.clone = function () {
    var m = new ImmutableDenseMatrix({
      data: object.clone(this._data),
      size: object.clone(this._size),
      datatype: this._datatype
    });
    return m;
  };

  /**
   * Get a JSON representation of the matrix
   * @returns {Object}
   */
  ImmutableDenseMatrix.prototype.toJSON = function () {
    return {
      mathjs: 'ImmutableDenseMatrix',
      data: this._data,
      size: this._size,
      datatype: this._datatype
    };
  };

  /**
   * Generate a matrix from a JSON object
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "ImmutableDenseMatrix", data: [], size: []}`,
   *                       where mathjs is optional
   * @returns {ImmutableDenseMatrix}
   */
  ImmutableDenseMatrix.fromJSON = function (json) {
    return new ImmutableDenseMatrix(json);
  };

  /**
   * Swap rows i and j in Matrix.
   *
   * @param {Number} i       Matrix row index 1
   * @param {Number} j       Matrix row index 2
   *
   * @return {Matrix}        The matrix reference
   */
  ImmutableDenseMatrix.prototype.swapRows = function () {
    throw new Error('Cannot invoke swapRows on an Immutable Matrix instance');
  };

  /**
   * Calculate the minimum value in the set
   * @return {Number | undefined} min
   */
  ImmutableDenseMatrix.prototype.min = function () {
    // check min has been calculated before
    if (this._min === null) {
      // minimum
      var m = null;
      // compute min
      this.forEach(function (v) {
        if (m === null || smaller(v, m))
          m = v;
      });
      this._min = m !== null ? m : undefined;
    }
    return this._min;
  };

  /**
   * Calculate the maximum value in the set
   * @return {Number | undefined} max
   */
  ImmutableDenseMatrix.prototype.max = function () {
    // check max has been calculated before
    if (this._max === null) {
      // maximum
      var m = null;
      // compute max
      this.forEach(function (v) {
        if (m === null || smaller(m, v))
          m = v;
      });
      this._max = m !== null ? m : undefined;
    }
    return this._max;
  };

  // exports
  return ImmutableDenseMatrix;
}

exports.name = 'ImmutableDenseMatrix';
exports.path = 'type';
exports.factory = factory;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clone = __webpack_require__(1).clone;
var isInteger = __webpack_require__(2).isInteger;

function factory (type) {
  
  /**
   * Create an index. An Index can store ranges and sets for multiple dimensions.
   * Matrix.get, Matrix.set, and math.subset accept an Index as input.
   *
   * Usage:
   *     var index = new Index(range1, range2, matrix1, array1, ...);
   *
   * Where each parameter can be any of:
   *     A number
   *     A string (containing a name of an object property)
   *     An instance of Range
   *     An Array with the Set values
   *     A Matrix with the Set values
   *
   * The parameters start, end, and step must be integer numbers.
   *
   * @class Index
   * @Constructor Index
   * @param {...*} ranges
   */
  function Index(ranges) {
    if (!(this instanceof Index)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    this._dimensions = [];
    this._isScalar = true;

    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i];

      if (arg && (arg.isRange === true)) {
        this._dimensions.push(arg);
        this._isScalar = false;
      }
      else if (arg && (Array.isArray(arg) || arg.isMatrix === true)) {
        // create matrix
        var m = _createImmutableMatrix(arg.valueOf());
        this._dimensions.push(m);
        // size
        var size = m.size();
        // scalar
        if (size.length !== 1 || size[0] !== 1) {
          this._isScalar = false;
        }
      }
      else if (typeof arg === 'number') {
        this._dimensions.push(_createImmutableMatrix([arg]));
      }
      else if (typeof arg === 'string') {
        // object property (arguments.count should be 1)
        this._dimensions.push(arg);
      }
      // TODO: implement support for wildcard '*'
      else {
        throw new TypeError('Dimension must be an Array, Matrix, number, string, or Range');
      }
    }
  }

  /**
   * Attach type information
   */
  Index.prototype.type = 'Index';
  Index.prototype.isIndex = true;

  function _createImmutableMatrix(arg) {
    // loop array elements
    for (var i = 0, l = arg.length; i < l; i++) {
      if (typeof arg[i] !== 'number' || !isInteger(arg[i])) {
        throw new TypeError('Index parameters must be positive integer numbers');
      }
    }
    // create matrix
    return new type.ImmutableDenseMatrix(arg);
  }

  /**
   * Create a clone of the index
   * @memberof Index
   * @return {Index} clone
   */
  Index.prototype.clone = function () {
    var index = new Index();
    index._dimensions = clone(this._dimensions);
    index._isScalar = this._isScalar;
    return index;
  };

  /**
   * Create an index from an array with ranges/numbers
   * @memberof Index
   * @param {Array.<Array | number>} ranges
   * @return {Index} index
   * @private
   */
  Index.create = function (ranges) {
    var index = new Index();
    Index.apply(index, ranges);
    return index;
  };

  /**
   * Retrieve the size of the index, the number of elements for each dimension.
   * @memberof Index
   * @returns {number[]} size
   */
  Index.prototype.size = function () {
    var size = [];

    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var d = this._dimensions[i];
      size[i] = (typeof d === 'string') ? 1 : d.size()[0];
    }

    return size;
  };

  /**
   * Get the maximum value for each of the indexes ranges.
   * @memberof Index
   * @returns {number[]} max
   */
  Index.prototype.max = function () {
    var values = [];

    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var range = this._dimensions[i];
      values[i] = (typeof range === 'string') ? range : range.max();
    }

    return values;
  };

  /**
   * Get the minimum value for each of the indexes ranges.
   * @memberof Index
   * @returns {number[]} min
   */
  Index.prototype.min = function () {
    var values = [];

    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var range = this._dimensions[i];
      values[i] = (typeof range === 'string') ? range : range.min();
    }

    return values;
  };

  /**
   * Loop over each of the ranges of the index
   * @memberof Index
   * @param {Function} callback   Called for each range with a Range as first
   *                              argument, the dimension as second, and the
   *                              index object as third.
   */
  Index.prototype.forEach = function (callback) {
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      callback(this._dimensions[i], i, this);
    }
  };

  /**
   * Retrieve the dimension for the given index
   * @memberof Index
   * @param {Number} dim                  Number of the dimension
   * @returns {Range | null} range
   */
  Index.prototype.dimension = function (dim) {
    return this._dimensions[dim] || null;
  };

  /**
   * Test whether this index contains an object property
   * @returns {boolean} Returns true if the index is an object property
   */
  Index.prototype.isObjectProperty = function () {
    return this._dimensions.length === 1 && typeof this._dimensions[0] === 'string';
  };

  /**
   * Returns the object property name when the Index holds a single object property,
   * else returns null
   * @returns {string | null}
   */
  Index.prototype.getObjectProperty = function () {
    return this.isObjectProperty() ? this._dimensions[0] : null;
  };

  /**
   * Test whether this index contains only a single value.
   *
   * This is the case when the index is created with only scalar values as ranges,
   * not for ranges resolving into a single value.
   * @memberof Index
   * @return {boolean} isScalar
   */
  Index.prototype.isScalar = function () {
    return this._isScalar;
  };

  /**
   * Expand the Index into an array.
   * For example new Index([0,3], [2,7]) returns [[0,1,2], [2,3,4,5,6]]
   * @memberof Index
   * @returns {Array} array
   */
  Index.prototype.toArray = function () {
    var array = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var dimension = this._dimensions[i];
      array.push((typeof dimension === 'string') ? dimension : dimension.toArray());
    }
    return array;
  };

  /**
   * Get the primitive value of the Index, a two dimensional array.
   * Equivalent to Index.toArray().
   * @memberof Index
   * @returns {Array} array
   */
  Index.prototype.valueOf = Index.prototype.toArray;

  /**
   * Get the string representation of the index, for example '[2:6]' or '[0:2:10, 4:7, [1,2,3]]'
   * @memberof Index
   * @returns {String} str
   */
  Index.prototype.toString = function () {
    var strings = [];

    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var dimension = this._dimensions[i];
      if (typeof dimension === 'string') {
        strings.push(JSON.stringify(dimension));
      }
      else {
        strings.push(dimension.toString());
      }
    }

    return '[' + strings.join(', ') + ']';
  };

  /**
   * Get a JSON representation of the Index
   * @memberof Index
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Index", "ranges": [{"mathjs": "Range", start: 0, end: 10, step:1}, ...]}`
   */
  Index.prototype.toJSON = function () {
    return {
      mathjs: 'Index',
      dimensions: this._dimensions
    };
  };

  /**
   * Instantiate an Index from a JSON object
   * @memberof Index
   * @param {Object} json A JSON object structured as:
   *                     `{"mathjs": "Index", "dimensions": [{"mathjs": "Range", start: 0, end: 10, step:1}, ...]}`
   * @return {Index}
   */
  Index.fromJSON = function (json) {
    return Index.create(json.dimensions);
  };

  return Index;
}

exports.name = 'Index';
exports.path = 'type';
exports.factory = factory;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var number = __webpack_require__(2);

function factory (type, config, load, typed) {
  /**
   * Create a range. A range has a start, step, and end, and contains functions
   * to iterate over the range.
   *
   * A range can be constructed as:
   *     var range = new Range(start, end);
   *     var range = new Range(start, end, step);
   *
   * To get the result of the range:
   *     range.forEach(function (x) {
   *         console.log(x);
   *     });
   *     range.map(function (x) {
   *         return math.sin(x);
   *     });
   *     range.toArray();
   *
   * Example usage:
   *     var c = new Range(2, 6);         // 2:1:5
   *     c.toArray();                     // [2, 3, 4, 5]
   *     var d = new Range(2, -3, -1);    // 2:-1:-2
   *     d.toArray();                     // [2, 1, 0, -1, -2]
   *
   * @class Range
   * @constructor Range
   * @param {number} start  included lower bound
   * @param {number} end    excluded upper bound
   * @param {number} [step] step size, default value is 1
   */
  function Range(start, end, step) {
    if (!(this instanceof Range)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (start != null) {
      if (start.isBigNumber === true)
        start = start.toNumber();
      else if (typeof start !== 'number')
        throw new TypeError('Parameter start must be a number');
    }
    if (end != null) {
      if (end.isBigNumber === true)
        end = end.toNumber();
      else if (typeof end !== 'number')
        throw new TypeError('Parameter end must be a number');
    }
    if (step != null) {
      if (step.isBigNumber === true)
        step = step.toNumber();
      else if (typeof step !== 'number')
        throw new TypeError('Parameter step must be a number');
    }

    this.start = (start != null) ? parseFloat(start) : 0;
    this.end   = (end != null)   ? parseFloat(end)   : 0;
    this.step  = (step != null)  ? parseFloat(step)  : 1;
  }

  /**
   * Attach type information
   */
  Range.prototype.type = 'Range';
  Range.prototype.isRange = true;

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @memberof Range
   * @param {string} str
   * @return {Range | null} range
   */
  Range.parse = function (str) {
    if (typeof str !== 'string') {
      return null;
    }

    var args = str.split(':');
    var nums = args.map(function (arg) {
      return parseFloat(arg);
    });

    var invalid = nums.some(function (num) {
      return isNaN(num);
    });
    if (invalid) {
      return null;
    }

    switch (nums.length) {
      case 2:
        return new Range(nums[0], nums[1]);
      case 3:
        return new Range(nums[0], nums[2], nums[1]);
      default:
        return null;
    }
  };

  /**
   * Create a clone of the range
   * @return {Range} clone
   */
  Range.prototype.clone = function () {
    return new Range(this.start, this.end, this.step);
  };

  /**
   * Retrieve the size of the range.
   * Returns an array containing one number, the number of elements in the range.
   * @memberof Range
   * @returns {number[]} size
   */
  Range.prototype.size = function () {
    var len = 0,
        start = this.start,
        step = this.step,
        end = this.end,
        diff = end - start;

    if (number.sign(step) == number.sign(diff)) {
      len = Math.ceil((diff) / step);
    }
    else if (diff == 0) {
      len = 0;
    }

    if (isNaN(len)) {
      len = 0;
    }
    return [len];
  };

  /**
   * Calculate the minimum value in the range
   * @memberof Range
   * @return {number | undefined} min
   */
  Range.prototype.min = function () {
    var size = this.size()[0];

    if (size > 0) {
      if (this.step > 0) {
        // positive step
        return this.start;
      }
      else {
        // negative step
        return this.start + (size - 1) * this.step;
      }
    }
    else {
      return undefined;
    }
  };

  /**
   * Calculate the maximum value in the range
   * @memberof Range
   * @return {number | undefined} max
   */
  Range.prototype.max = function () {
    var size = this.size()[0];

    if (size > 0) {
      if (this.step > 0) {
        // positive step
        return this.start + (size - 1) * this.step;
      }
      else {
        // negative step
        return this.start;
      }
    }
    else {
      return undefined;
    }
  };


  /**
   * Execute a callback function for each value in the range.
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Range being traversed.
   */
  Range.prototype.forEach = function (callback) {
    var x = this.start;
    var step = this.step;
    var end = this.end;
    var i = 0;

    if (step > 0) {
      while (x < end) {
        callback(x, [i], this);
        x += step;
        i++;
      }
    }
    else if (step < 0) {
      while (x > end) {
        callback(x, [i], this);
        x += step;
        i++;
      }
    }
  };

  /**
   * Execute a callback function for each value in the Range, and return the
   * results as an array
   * @memberof Range
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @returns {Array} array
   */
  Range.prototype.map = function (callback) {
    var array = [];
    this.forEach(function (value, index, obj) {
      array[index[0]] = callback(value, index, obj);
    });
    return array;
  };

  /**
   * Create an Array with a copy of the Ranges data
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.toArray = function () {
    var array = [];
    this.forEach(function (value, index) {
      array[index[0]] = value;
    });
    return array;
  };

  /**
   * Get the primitive value of the Range, a one dimensional array
   * @memberof Range
   * @returns {Array} array
   */
  Range.prototype.valueOf = function () {
    // TODO: implement a caching mechanism for range.valueOf()
    return this.toArray();
  };

  /**
   * Get a string representation of the range, with optional formatting options.
   * Output is formatted as 'start:step:end', for example '2:6' or '0:0.2:11'
   * @memberof Range
   * @param {Object | number | function} [options]  Formatting options. See
   *                                                lib/utils/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {string} str
   */
  Range.prototype.format = function (options) {
    var str = number.format(this.start, options);

    if (this.step != 1) {
      str += ':' + number.format(this.step, options);
    }
    str += ':' + number.format(this.end, options);
    return str;
  };

  /**
   * Get a string representation of the range.
   * @memberof Range
   * @returns {string}
   */
  Range.prototype.toString = function () {
    return this.format();
  };

  /**
   * Get a JSON representation of the range
   * @memberof Range
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
   */
  Range.prototype.toJSON = function () {
    return {
      mathjs: 'Range',
      start: this.start,
      end: this.end,
      step: this.step
    };
  };

  /**
   * Instantiate a Range from a JSON object
   * @memberof Range
   * @param {Object} json A JSON object structured as:
   *                      `{"mathjs": "Range", "start": 2, "end": 4, "step": 1}`
   * @return {Range}
   */
  Range.fromJSON = function (json) {
    return new Range(json.start, json.end, json.step);
  };

  return Range;
}

exports.name = 'Range';
exports.path = 'type';
exports.factory = factory;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {
  /**
   * Create an index. An Index can store ranges having start, step, and end
   * for multiple dimensions.
   * Matrix.get, Matrix.set, and math.subset accept an Index as input.
   *
   * Syntax:
   *
   *     math.index(range1, range2, ...)
   *
   * Where each range can be any of:
   *
   * - A number
   * - A string for getting/setting an object property
   * - An instance of `Range`
   * - A one-dimensional Array or a Matrix with numbers
   *
   * Indexes must be zero-based, integer numbers.
   *
   * Examples:
   *
   *    var math = math.js
   *
   *    var b = [1, 2, 3, 4, 5];
   *    math.subset(b, math.index([1, 2, 3]));     // returns [2, 3, 4]
   *
   *    var a = math.matrix([[1, 2], [3, 4]]);
   *    a.subset(math.index(0, 1));             // returns 2
   *
   * See also:
   *
   *    bignumber, boolean, complex, matrix, number, string, unit
   *
   * @param {...*} ranges   Zero or more ranges or numbers.
   * @return {Index}        Returns the created index
   */
  return typed('index', {
    '...number | string | BigNumber | Range | Array | Matrix': function (args) {
      var ranges = args.map(function (arg) {
        if (arg && arg.isBigNumber === true) {
          return arg.toNumber(); // convert BigNumber to Number
        }
        else if (arg && (Array.isArray(arg) || arg.isMatrix === true)) {
          return arg.map(function (elem) {
            // convert BigNumber to Number
            return (elem && elem.isBigNumber === true) ? elem.toNumber() : elem;
          });
        }
        else {
          return arg;
        }
      });

      var res = new type.Index();
      type.Index.apply(res, ranges);
      return res;
    }
  });
}

exports.name = 'index';
exports.factory = factory;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {

  var SparseMatrix = type.SparseMatrix;

  /**
   * Create a Sparse Matrix. The function creates a new `math.type.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   *
   * Syntax:
   *
   *    math.sparse()               // creates an empty sparse matrix.
   *    math.sparse(data)           // creates a sparse matrix with initial data.
   *    math.sparse(data, 'number') // creates a sparse matrix with initial data, number datatype.
   *
   * Examples:
   *
   *    var m = math.sparse([[1, 2], [3, 4]]);
   *    m.size();                        // Array [2, 2]
   *    m.resize([3, 2], 5);
   *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit, matrix
   *
   * @param {Array | Matrix} [data]    A two dimensional array
   *
   * @return {Matrix} The created matrix
   */
  var sparse = typed('sparse', {
    '': function () {
      return new SparseMatrix([]);
    },
    
    'string': function (datatype) {
      return new SparseMatrix([], datatype);
    },

    'Array | Matrix': function (data) {
      return new SparseMatrix(data);
    },
    
    'Array | Matrix, string': function (data, datatype) {
      return new SparseMatrix(data, datatype);
    }
  });

  sparse.toTex = {
    0: '\\begin{bsparse}\\end{bsparse}',
    1: '\\left(${args[0]}\\right)'
  };

  return sparse;
}

exports.name = 'sparse';
exports.factory = factory;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = [
  __webpack_require__(61),
  __webpack_require__(62),
  __webpack_require__(36),
  __webpack_require__(65),
  __webpack_require__(66),
  __webpack_require__(37),
  __webpack_require__(67),
  __webpack_require__(68),
  __webpack_require__(69),
  __webpack_require__(70),
  __webpack_require__(72),
  __webpack_require__(73),
  __webpack_require__(74),
  __webpack_require__(75),
  __webpack_require__(76),
  __webpack_require__(77),
  __webpack_require__(78),
  __webpack_require__(79),
  __webpack_require__(80),
  __webpack_require__(84),
  __webpack_require__(85),
  __webpack_require__(86),
  __webpack_require__(87),
  __webpack_require__(88)
];


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clone = __webpack_require__(1).clone;
var isInteger = __webpack_require__(2).isInteger;
var array = __webpack_require__(3);
var IndexError = __webpack_require__(28);
var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Concatenate two or more matrices.
   *
   * Syntax:
   *
   *     math.concat(A, B, C, ...)
   *     math.concat(A, B, C, ..., dim)
   *
   * Where:
   *
   * - `dim: number` is a zero-based dimension over which to concatenate the matrices.
   *   By default the last dimension of the matrices.
   *
   * Examples:
   *
   *    var A = [[1, 2], [5, 6]];
   *    var B = [[3, 4], [7, 8]];
   *
   *    math.concat(A, B);                  // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
   *    math.concat(A, B, 0);               // returns [[1, 2], [5, 6], [3, 4], [7, 8]]
   *    math.concat('hello', ' ', 'world'); // returns 'hello world'
   *
   * See also:
   *
   *    size, squeeze, subset, transpose
   *
   * @param {... Array | Matrix} args     Two or more matrices
   * @return {Array | Matrix} Concatenated matrix
   */
  var concat = typed('concat', {
    // TODO: change signature to '...Array | Matrix, dim?' when supported
    '...Array | Matrix | number | BigNumber': function (args) {
      var i;
      var len = args.length;
      var dim = -1;  // zero-based dimension
      var prevDim;
      var asMatrix = false;
      var matrices = [];  // contains multi dimensional arrays

      for (i = 0; i < len; i++) {
        var arg = args[i];

        // test whether we need to return a Matrix (if not we return an Array)
        if (arg && arg.isMatrix === true) {
          asMatrix = true;
        }

        if (typeof arg === 'number' || (arg && arg.isBigNumber === true)) {
          if (i !== len - 1) {
            throw new Error('Dimension must be specified as last argument');
          }

          // last argument contains the dimension on which to concatenate
          prevDim = dim;
          dim = arg.valueOf(); // change BigNumber to number

          if (!isInteger(dim)) {
            throw new TypeError('Integer number expected for dimension');
          }

          if (dim < 0 || (i > 0 && dim > prevDim)) {
            // TODO: would be more clear when throwing a DimensionError here
            throw new IndexError(dim, prevDim + 1);
          }
        }
        else {
          // this is a matrix or array
          var m = clone(arg).valueOf();
          var size = array.size(m);
          matrices[i] = m;
          prevDim = dim;
          dim = size.length - 1;

          // verify whether each of the matrices has the same number of dimensions
          if (i > 0 && dim != prevDim) {
            throw new DimensionError(prevDim + 1, dim + 1);
          }
        }
      }

      if (matrices.length == 0) {
        throw new SyntaxError('At least one matrix expected');
      }

      var res = matrices.shift();
      while (matrices.length) {
        res = _concat(res, matrices.shift(), dim, 0);
      }

      return asMatrix ? matrix(res) : res;
    },

    '...string': function (args) {
      return args.join('');
    }
  });

  concat.toTex = undefined; // use default template

  return concat;
}

/**
 * Recursively concatenate two matrices.
 * The contents of the matrices is not cloned.
 * @param {Array} a             Multi dimensional array
 * @param {Array} b             Multi dimensional array
 * @param {number} concatDim    The dimension on which to concatenate (zero-based)
 * @param {number} dim          The current dim (zero-based)
 * @return {Array} c            The concatenated matrix
 * @private
 */
function _concat(a, b, concatDim, dim) {
  if (dim < concatDim) {
    // recurse into next dimension
    if (a.length != b.length) {
      throw new DimensionError(a.length, b.length);
    }

    var c = [];
    for (var i = 0; i < a.length; i++) {
      c[i] = _concat(a[i], b[i], concatDim, dim + 1);
    }
    return c;
  }
  else {
    // concatenate this dimension
    return a.concat(b);
  }
}

exports.name = 'concat';
exports.factory = factory;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array = __webpack_require__(3);

function factory (type, config, load, typed) {
  var matrix   = load(__webpack_require__(0));
  var subtract = load(__webpack_require__(34));
  var multiply = load(__webpack_require__(19));

  /**
   * Calculate the cross product for two vectors in three dimensional space.
   * The cross product of `A = [a1, a2, a3]` and `B = [b1, b2, b3]` is defined
   * as:
   *
   *    cross(A, B) = [
   *      a2 * b3 - a3 * b2,
   *      a3 * b1 - a1 * b3,
   *      a1 * b2 - a2 * b1
   *    ]
   *
   * If one of the input vectors has a dimension greater than 1, the output
   * vector will be a 1x3 (2-dimensional) matrix.
   *
   * Syntax:
   *
   *    math.cross(x, y)
   *
   * Examples:
   *
   *    math.cross([1, 1, 0],   [0, 1, 1]);       // Returns [1, -1, 1]
   *    math.cross([3, -3, 1],  [4, 9, 2]);       // Returns [-15, -2, 39]
   *    math.cross([2, 3, 4],   [5, 6, 7]);       // Returns [-3, 6, -3]
   *    math.cross([[1, 2, 3]], [[4], [5], [6]]); // Returns [[-3, 6, -3]]
   *
   * See also:
   *
   *    dot, multiply
   *
   * @param  {Array | Matrix} x   First vector
   * @param  {Array | Matrix} y   Second vector
   * @return {Array | Matrix}     Returns the cross product of `x` and `y`
   */
  var cross = typed('cross', {
    'Matrix, Matrix': function (x, y) {
      return matrix(_cross(x.toArray(), y.toArray()));
    },

    'Matrix, Array': function (x, y) {
      return matrix(_cross(x.toArray(), y));
    },

    'Array, Matrix': function (x, y) {
      return matrix(_cross(x, y.toArray()));
    },

    'Array, Array': _cross
  });

  cross.toTex = {
    2: '\\left(${args[0]}\\right)\\times\\left(${args[1]}\\right)'
  };

  return cross;

  /**
   * Calculate the cross product for two arrays
   * @param {Array} x  First vector
   * @param {Array} y  Second vector
   * @returns {Array} Returns the cross product of x and y
   * @private
   */
  function _cross(x, y) {
    var highestDimension = Math.max(array.size(x).length, array.size(y).length);

    x = array.squeeze(x);
    y = array.squeeze(y);

    var xSize = array.size(x);
    var ySize = array.size(y);

    if (xSize.length != 1 || ySize.length != 1 || xSize[0] != 3 || ySize[0] != 3) {
      throw new RangeError('Vectors with length 3 expected ' +
      '(Size A = [' + xSize.join(', ') + '], B = [' + ySize.join(', ') + '])');
    }

    var product = [
      subtract(multiply(x[1], y[2]), multiply(x[2], y[1])),
      subtract(multiply(x[2], y[0]), multiply(x[0], y[2])),
      subtract(multiply(x[0], y[1]), multiply(x[1], y[0]))
    ];

    if (highestDimension > 1) {
      return [product];
    } else {
      return product;
    }
  }
}

exports.name = 'cross';
exports.factory = factory;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {Function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
 *
 * @return {Array | Matrix} res
 */
module.exports = function deepMap(array, callback, skipZeros) {
  if (array && (typeof array.map === 'function')) {
    // TODO: replace array.map with a for loop to improve performance
    return array.map(function (x) {
      return deepMap(x, callback, skipZeros);
    });
  }
  else {
    return callback(array);
  }
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {

  var equalScalar = load(__webpack_require__(7));

  var SparseMatrix = type.SparseMatrix;

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b). 
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤  
   *          └  0          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  var algorithm11 = function (s, b, callback, inverse) {
    // sparse matrix arrays
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;

    // sparse matrix cannot be a Pattern matrix
    if (!avalues)
      throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value');

    // rows & columns
    var rows = asize[0];
    var columns = asize[1];

    // datatype
    var dt;
    // equal signature to use
    var eq = equalScalar;
    // zero value
    var zero = 0;
    // callback signature to use
    var cf = callback;

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt;
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt]);
      // convert 0 to the same datatype
      zero = typed.convert(0, dt);
      // convert b to the same datatype
      b = typed.convert(b, dt);
      // callback
      cf = typed.find(callback, [dt, dt]);
    }

    // result arrays
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    // matrix
    var c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });

    // loop columns
    for (var j = 0; j < columns; j++) {
      // initialize ptr
      cptr[j] = cindex.length;
      // values in j
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        var i = aindex[k];
        // invoke callback
        var v = inverse ? cf(b, avalues[k]) : cf(avalues[k], b);
        // check value is zero
        if (!eq(v, zero)) {
          // push index & value
          cindex.push(i);
          cvalues.push(v);
        }
      }
    }
    // update ptr
    cptr[columns] = cindex.length;

    // return sparse matrix
    return c;
  };

  return algorithm11;
}

exports.name = 'algorithm11';
exports.factory = factory;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array     = __webpack_require__(3);
var clone     = __webpack_require__(1).clone;
var isInteger = __webpack_require__(2).isInteger;

function factory (type, config, load, typed) {

  var matrix = load(__webpack_require__(0));
  
  /**
   * Create a diagonal matrix or retrieve the diagonal of a matrix
   *
   * When `x` is a vector, a matrix with vector `x` on the diagonal will be returned.
   * When `x` is a two dimensional matrix, the matrixes `k`th diagonal will be returned as vector.
   * When k is positive, the values are placed on the super diagonal.
   * When k is negative, the values are placed on the sub diagonal.
   *
   * Syntax:
   *
   *     math.diag(X)
   *     math.diag(X, format)
   *     math.diag(X, k)
   *     math.diag(X, k, format)
   *
   * Examples:
   *
   *     // create a diagonal matrix
   *     math.diag([1, 2, 3]);      // returns [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
   *     math.diag([1, 2, 3], 1);   // returns [[0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]]
   *     math.diag([1, 2, 3], -1);  // returns [[0, 0, 0], [1, 0, 0], [0, 2, 0], [0, 0, 3]]
   *
   *    // retrieve the diagonal from a matrix
   *    var a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
   *    math.diag(a);   // returns [1, 5, 9]
   *
   * See also:
   *
   *     ones, zeros, eye
   *
   * @param {Matrix | Array} x          A two dimensional matrix or a vector
   * @param {number | BigNumber} [k=0]  The diagonal where the vector will be filled
   *                                    in or retrieved.
   * @param {string} [format='dense']   The matrix storage format.
   *
   * @returns {Matrix | Array} Diagonal matrix from input vector, or diagonal from input matrix.
   */
  var diag = typed('diag', {
    // FIXME: simplify this huge amount of signatures as soon as typed-function supports optional arguments

    'Array': function (x) {
      return _diag(x, 0, array.size(x), null);
    },

    'Array, number': function (x, k) {
      return _diag(x, k, array.size(x), null);
    },
    
    'Array, BigNumber': function (x, k) {
      return _diag(x, k.toNumber(), array.size(x), null);
    },

    'Array, string': function (x, format) {
      return _diag(x, 0, array.size(x), format);
    },

    'Array, number, string': function (x, k, format) {
      return _diag(x, k, array.size(x), format);
    },

    'Array, BigNumber, string': function (x, k, format) {
      return _diag(x, k.toNumber(), array.size(x), format);
    },

    'Matrix': function (x) {
      return _diag(x, 0, x.size(), x.storage());
    },

    'Matrix, number': function (x, k) {
      return _diag(x, k, x.size(), x.storage());
    },

    'Matrix, BigNumber': function (x, k) {
      return _diag(x, k.toNumber(), x.size(), x.storage());
    },

    'Matrix, string': function (x, format) {
      return _diag(x, 0, x.size(), format);
    },

    'Matrix, number, string': function (x, k, format) {
      return _diag(x, k, x.size(), format);
    },

    'Matrix, BigNumber, string': function (x, k, format) {
      return _diag(x, k.toNumber(), x.size(), format);
    }
  });

  diag.toTex = undefined; // use default template

  return diag;

  /**
   * Creeate diagonal matrix from a vector or vice versa
   * @param {Array | Matrix} x
   * @param {number} k
   * @param {string} format Storage format for matrix. If null,
   *                          an Array is returned
   * @returns {Array | Matrix}
   * @private
   */
  function _diag (x, k, size, format) {
    if (!isInteger(k)) {
      throw new TypeError ('Second parameter in function diag must be an integer');
    }
    
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // check dimensions
    switch (size.length) {
      case 1:
        return _createDiagonalMatrix(x, k, format, size[0], kSub, kSuper);
      case 2:
        return _getDiagonal(x, k, format, size, kSub, kSuper);
    }
    throw new RangeError('Matrix for function diag must be 2 dimensional');
  }
  
  function _createDiagonalMatrix(x, k, format, l, kSub, kSuper) {
    // matrix size
    var ms = [l + kSub, l + kSuper];
    // get matrix constructor
    var F = type.Matrix.storage(format || 'dense');
    // create diagonal matrix
    var m = F.diagonal(ms, x, k);
    // check we need to return a matrix
    return format !== null ? m : m.valueOf();
  }
  
  function _getDiagonal(x, k, format, s, kSub, kSuper) {
    // check x is a Matrix
    if (x && x.isMatrix === true) {
      // get diagonal matrix
      var dm = x.diagonal(k);
      // check we need to return a matrix
      if (format !== null) {
        // check we need to change matrix format
        if (format !== dm.storage())
          return matrix(dm, format);
        return dm;
      }
      return dm.valueOf();
    }
    // vector size
    var n = Math.min(s[0] - kSub, s[1] - kSuper);
    // diagonal values
    var vector = [];
    // loop diagonal
    for (var i = 0; i < n; i++) {
      vector[i] = x[i + kSub][i + kSuper];
    }
    // check we need to return a matrix
    return format !== null ? matrix(vector) : vector;
  }
}

exports.name = 'diag';
exports.factory = factory;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var size = __webpack_require__(3).size;

function factory (type, config, load, typed) {
  var add      = load(__webpack_require__(16));
  var multiply = load(__webpack_require__(19));

  /**
   * Calculate the dot product of two vectors. The dot product of
   * `A = [a1, a2, a3, ..., an]` and `B = [b1, b2, b3, ..., bn]` is defined as:
   *
   *    dot(A, B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn
   *
   * Syntax:
   *
   *    math.dot(x, y)
   *
   * Examples:
   *
   *    math.dot([2, 4, 1], [2, 2, 3]);       // returns number 15
   *    math.multiply([2, 4, 1], [2, 2, 3]);  // returns number 15
   *
   * See also:
   *
   *    multiply, cross
   *
   * @param  {Array | Matrix} x     First vector
   * @param  {Array | Matrix} y     Second vector
   * @return {number}               Returns the dot product of `x` and `y`
   */
  var dot = typed('dot', {
    'Matrix, Matrix': function (x, y) {
      return _dot(x.toArray(), y.toArray());
    },

    'Matrix, Array': function (x, y) {
      return _dot(x.toArray(), y);
    },

    'Array, Matrix': function (x, y) {
      return _dot(x, y.toArray());
    },

    'Array, Array': _dot
  });
  
  dot.toTex = {2: '\\left(${args[0]}\\cdot${args[1]}\\right)'};

  return dot;

  /**
   * Calculate the dot product for two arrays
   * @param {Array} x  First vector
   * @param {Array} y  Second vector
   * @returns {number} Returns the dot product of x and y
   * @private
   */
  // TODO: double code with math.multiply
  function _dot(x, y) {
    var xSize= size(x);
    var ySize = size(y);
    var len = xSize[0];

    if (xSize.length !== 1 || ySize.length !== 1) throw new RangeError('Vector expected'); // TODO: better error message
    if (xSize[0] != ySize[0]) throw new RangeError('Vectors must have equal length (' + xSize[0] + ' != ' + ySize[0] + ')');
    if (len == 0) throw new RangeError('Cannot calculate the dot product of empty vectors');

    var prod = 0;
    for (var i = 0; i < len; i++) {
      prod = add(prod, multiply(x[i], y[i]));
    }

    return prod;
  }
}

exports.name = 'dot';
exports.factory = factory;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var size = __webpack_require__(3).size;
var maxArgumentCount = __webpack_require__(13).maxArgumentCount;

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));
  
  /**
   * Filter the items in an array or one dimensional matrix.
   *
   * Syntax:
   *
   *    math.filter(x, test)
   *
   * Examples:
   *
   *    function isPositive (x) {
   *      return x > 0;
   *    }
   *    math.filter([6, -2, -1, 4, 3], isPositive); // returns [6, 4, 3]
   *
   *    math.filter(["23", "foo", "100", "55", "bar"], /[0-9]+/); // returns ["23", "100", "55"]
   *
   * See also:
   *
   *    forEach, map, sort
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to filter
   * @param {Function | RegExp} test
   *        A function or regular expression to test items.
   *        All entries for which `test` returns true are returned.
   *        When `test` is a function, it is invoked with three parameters:
   *        the value of the element, the index of the element, and the
   *        matrix/array being traversed. The function must return a boolean.
   * @return {Matrix | Array} Returns the filtered matrix.
   */
  var filter = typed('filter', {
    'Array, function': _filterCallback,

    'Array, RegExp': _filterRegExp,

    'Matrix, function': function (x, test) {
      return matrix(_filterCallback(x.toArray(), test));
    },

    'Matrix, RegExp': function (x, test) {
      return matrix(_filterRegExp(x.toArray(), test));
    }
  });

  filter.toTex = undefined; // use default template

  return filter;
}

/**
 * Filter values in a callback given a callback function
 * @param {Array} x
 * @param {Function} callback
 * @return {Array} Returns the filtered array
 * @private
 */
function _filterCallback (x, callback) {
  if (size(x).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  return x.filter(function (value, index, array) {
    // invoke the callback function with the right number of arguments
    if (args === 1) {
      return callback(value);
    }
    else if (args === 2) {
      return callback(value, [index]);
    }
    else { // 3 or -1
      return callback(value, [index], array);
    }
  });
}

/**
 * Filter values in a callback given a regular expression
 * @param {Array} x
 * @param {Function} regexp
 * @return {Array} Returns the filtered array
 * @private
 */
function _filterRegExp (x, regexp) {
  if (size(x).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  return x.filter(function (entry) {
    return regexp.test(entry);
  });
}

exports.name = 'filter';
exports.factory = factory;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clone = __webpack_require__(1).clone;
var _flatten = __webpack_require__(3).flatten;

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Flatten a multi dimensional matrix into a single dimensional matrix.
   *
   * Syntax:
   *
   *    math.flatten(x)
   *
   * Examples:
   *
   *    math.flatten([[1,2], [3,4]]);   // returns [1, 2, 3, 4]
   *
   * See also:
   *
   *    concat, resize, size, squeeze
   *
   * @param {Matrix | Array} x   Matrix to be flattened
   * @return {Matrix | Array} Returns the flattened matrix
   */
  var flatten = typed('flatten', {
    'Array': function (x) {
      return _flatten(clone(x));
    },

    'Matrix': function (x) {
      var flat = _flatten(clone(x.toArray()));
      // TODO: return the same matrix type as x
      return matrix(flat);
    }
  });

  flatten.toTex = undefined; // use default template

  return flatten;
}

exports.name = 'flatten';
exports.factory = factory;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var maxArgumentCount = __webpack_require__(13).maxArgumentCount;

function factory (type, config, load, typed) {
  /**
   * Iterate over all elements of a matrix/array, and executes the given callback function.
   *
   * Syntax:
   *
   *    math.forEach(x, callback)
   *
   * Examples:
   *
   *    math.forEach([1, 2, 3], function(value) {
   *      console.log(value);
   *    });
   *    // outputs 1, 2, 3
   *
   * See also:
   *
   *    filter, map, sort
   *
   * @param {Matrix | Array} x    The matrix to iterate on.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix/array being traversed.
   */
  var forEach = typed('forEach', {
    'Array, function': _forEach,

    'Matrix, function': function (x, callback) {
      return x.forEach(callback);
    }
  });

  forEach.toTex = undefined; // use default template

  return forEach;
}

/**
 * forEach for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @private
 */
function _forEach (array, callback) {
  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  var recurse = function (value, index) {
    if (Array.isArray(value)) {
      value.forEach(function (child, i) {
        // we create a copy of the index array and append the new index value
        recurse(child, index.concat(i));
      });
    }
    else {
      // invoke the callback function with the right number of arguments
      if (args === 1) {
        callback(value);
      }
      else if (args === 2) {
        callback(value, index);
      }
      else { // 3 or -1
        callback(value, index, array);
      }
    }
  };
  recurse(array, []);
}

exports.name = 'forEach';
exports.factory = factory;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(5);

function factory (type, config, load, typed) {
  var matrix       = load(__webpack_require__(0));
  var divideScalar = load(__webpack_require__(71));
  var addScalar    = load(__webpack_require__(17));
  var multiply     = load(__webpack_require__(19));
  var unaryMinus   = load(__webpack_require__(23));
  var det          = load(__webpack_require__(36));
  var eye          = load(__webpack_require__(37));

  /**
   * Calculate the inverse of a square matrix.
   *
   * Syntax:
   *
   *     math.inv(x)
   *
   * Examples:
   *
   *     math.inv([[1, 2], [3, 4]]);  // returns [[-2, 1], [1.5, -0.5]]
   *     math.inv(4);                 // returns 0.25
   *     1 / 4;                       // returns 0.25
   *
   * See also:
   *
   *     det, transpose
   *
   * @param {number | Complex | Array | Matrix} x     Matrix to be inversed
   * @return {number | Complex | Array | Matrix} The inverse of `x`.
   */
  var inv = typed('inv', {
    'Array | Matrix': function (x) {
      var size = (x.isMatrix === true) ? x.size() : util.array.size(x);
      switch (size.length) {
        case 1:
          // vector
          if (size[0] == 1) {
            if (x.isMatrix === true) {
              return matrix([
                divideScalar(1, x.valueOf()[0])
              ]);
            }
            else {
              return [
                divideScalar(1, x[0])
              ];
            }
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + util.string.format(size) + ')');
          }

        case 2:
          // two dimensional array
          var rows = size[0];
          var cols = size[1];
          if (rows == cols) {
            if (x.isMatrix === true) {
              return matrix(
                  _inv(x.valueOf(), rows, cols),
                  x.storage()
              );
            }
            else {
              // return an Array
              return _inv(x, rows, cols);
            }
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + util.string.format(size) + ')');
          }

        default:
          // multi dimensional array
          throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + util.string.format(size) + ')');
      }
    },

    'any': function (x) {
      // scalar
      return divideScalar(1, x); // FIXME: create a BigNumber one when configured for bignumbers
    }
  });

  /**
   * Calculate the inverse of a square matrix
   * @param {Array[]} mat     A square matrix
   * @param {number} rows     Number of rows
   * @param {number} cols     Number of columns, must equal rows
   * @return {Array[]} inv    Inverse matrix
   * @private
   */
  function _inv (mat, rows, cols){
    var r, s, f, value, temp;

    if (rows == 1) {
      // this is a 1 x 1 matrix
      value = mat[0][0];
      if (value == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [[
        divideScalar(1, value)
      ]];
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      var d = det(mat);
      if (d == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [
        [
          divideScalar(mat[1][1], d),
          divideScalar(unaryMinus(mat[0][1]), d)
        ],
        [
          divideScalar(unaryMinus(mat[1][0]), d),
          divideScalar(mat[0][0], d)
        ]
      ];
    }
    else {
      // this is a matrix of 3 x 3 or larger
      // calculate inverse using gauss-jordan elimination
      //      http://en.wikipedia.org/wiki/Gaussian_elimination
      //      http://mathworld.wolfram.com/MatrixInverse.html
      //      http://math.uww.edu/~mcfarlat/inverse.htm

      // make a copy of the matrix (only the arrays, not of the elements)
      var A = mat.concat();
      for (r = 0; r < rows; r++) {
        A[r] = A[r].concat();
      }

      // create an identity matrix which in the end will contain the
      // matrix inverse
      var B = eye(rows).valueOf();

      // loop over all columns, and perform row reductions
      for (var c = 0; c < cols; c++) {
        // element Acc should be non zero. if not, swap content
        // with one of the lower rows
        r = c;
        while (r < rows && A[r][c] == 0) {
          r++;
        }
        if (r == rows || A[r][c] == 0) {
          // TODO: in case of zero det, just return a matrix wih Infinity values? (like octave)
          throw Error('Cannot calculate inverse, determinant is zero');
        }
        if (r != c) {
          temp = A[c]; A[c] = A[r]; A[r] = temp;
          temp = B[c]; B[c] = B[r]; B[r] = temp;
        }

        // eliminate non-zero values on the other rows at column c
        var Ac = A[c],
            Bc = B[c];
        for (r = 0; r < rows; r++) {
          var Ar = A[r],
              Br = B[r];
          if(r != c) {
            // eliminate value at column c and row r
            if (Ar[c] != 0) {
              f = divideScalar(unaryMinus(Ar[c]), Ac[c]);

              // add (f * row c) to row r to eliminate the value
              // at column c
              for (s = c; s < cols; s++) {
                Ar[s] = addScalar(Ar[s], multiply(f, Ac[s]));
              }
              for (s = 0; s < cols; s++) {
                Br[s] = addScalar(Br[s],  multiply(f, Bc[s]));
              }
            }
          }
          else {
            // normalize value at Acc to 1,
            // divide each value on row r with the value at Acc
            f = Ac[c];
            for (s = c; s < cols; s++) {
              Ar[s] = divideScalar(Ar[s], f);
            }
            for (s = 0; s < cols; s++) {
              Br[s] = divideScalar(Br[s], f);
            }
          }
        }
      }
      return B;
    }
  }

  inv.toTex = {1: '\\left(${args[0]}\\right)^{-1}'};

  return inv;
}

exports.name = 'inv';
exports.factory = factory;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory(type, config, load, typed) {
  var multiplyScalar = load(__webpack_require__(24));

  /**
   * Divide two scalar values, `x / y`.
   * This function is meant for internal use: it is used by the public functions
   * `divide` and `inv`.
   *
   * This function does not support collections (Array or Matrix), and does
   * not validate the number of of inputs.
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit}                      Quotient, `x / y`
   * @private
   */
  var divideScalar = typed('divide', {
    'number, number': function (x, y) {
      return x / y;
    },

    'Complex, Complex': function (x, y) {
      return x.div(y);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.div(y);
    },

    'Fraction, Fraction': function (x, y) {
      return x.div(y);
    },

    'Unit, number | Fraction | BigNumber': function (x, y) {
      var res = x.clone();
      // TODO: move the divide function to Unit.js, it uses internals of Unit
      res.value = divideScalar(((res.value === null) ? res._normalize(1) : res.value), y);
      return res;
    },

    'number | Fraction | BigNumber, Unit': function (x, y) {
      var res = y.pow(-1);
      // TODO: move the divide function to Unit.js, it uses internals of Unit
      res.value = multiplyScalar(((res.value === null) ? res._normalize(1) : res.value), x);
      return res;
    },

    'Unit, Unit': function (x, y) {
      return x.divide(y);
    }

  });

  return divideScalar;
}

exports.factory = factory;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var size = __webpack_require__(3).size;

function factory(type, config, load, typed) {
  var matrix = load(__webpack_require__(0));
  var multiplyScalar = load(__webpack_require__(24))
    /**
     * Calculates the kronecker product of 2 matrices or vectors.
     *
     * NOTE: If a one dimensional vector / matrix is given, it will be
     * wrapped so its two dimensions.
     * See the examples.
     *
     * Syntax:
     *
     *    math.kron(x, y)
     *
     * Examples:
     *
     *    math.kron([[1, 0], [0, 1]], [[1, 2], [3, 4]]);
     *    // returns [ [ 1, 2, 0, 0 ], [ 3, 4, 0, 0 ], [ 0, 0, 1, 2 ], [ 0, 0, 3, 4 ] ]
     *
     *    math.kron([1,1], [2,3,4]);
     *    // returns [ [ 2, 3, 4, 2, 3, 4 ] ]
     *
     * See also:
     *
     *    multiply, dot, cross
     *
     * @param  {Array | Matrix} x     First vector
     * @param  {Array | Matrix} y     Second vector
     * @return {Array | Matrix}       Returns the kronecker product of `x` and `y`
     */
    var kron = typed('kron', {
        'Matrix, Matrix': function(x, y) {
            return matrix(_kron(x.toArray(), y.toArray()));
        },

        'Matrix, Array': function(x, y) {
            return matrix(_kron(x.toArray(), y));
        },

        'Array, Matrix': function(x, y) {
            return matrix(_kron(x, y.toArray()));
        },

        'Array, Array': _kron
    });

    return kron;

    /**
     * Calculate the kronecker product of two matrices / vectors
     * @param {Array} a  First vector
     * @param {Array} b  Second vector
     * @returns {Array} Returns the kronecker product of x and y
     * @private
     */
    function _kron(a, b) {
        // Deal with the dimensions of the matricies.
        if (size(a).length === 1) {
          // Wrap it in a 2D Matrix
          a = [a];
        }
        if (size(b).length === 1) {
          // Wrap it in a 2D Matrix
          b = [b]
        }
        if (size(a).length > 2 || size(b).length > 2) {
            throw new RangeError('Vectors with dimensions greater then 2 are not supported expected ' +
            '(Size x = ' + JSON.stringify(a.length) + ', y = ' + JSON.stringify(b.length) + ')');
        }
        var t = [];
        var r = [];

        return a.map(function(a) {
            return b.map(function(b) {
                return a.map(function(y) {
                    return b.map(function(x) {
                        return r.push(multiplyScalar(y, x));
                    });
                }, t.push(r = []));
            });
        }, t = []) && t;
    }
}

exports.name = 'kron';
exports.factory = factory;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var maxArgumentCount = __webpack_require__(13).maxArgumentCount;

function factory (type, config, load, typed) {
  /**
   * Create a new matrix or array with the results of the callback function executed on
   * each entry of the matrix/array.
   *
   * Syntax:
   *
   *    math.map(x, callback)
   *
   * Examples:
   *
   *    math.map([1, 2, 3], function(value) {
   *      return value * value;
   *    });  // returns [1, 4, 9]
   *
   * See also:
   *
   *    filter, forEach, sort
   *
   * @param {Matrix | Array} x    The matrix to iterate on.
   * @param {Function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the matrix being traversed.
   * @return {Matrix | array}     Transformed map of x
   */
  var map = typed('map', {
    'Array, function': _map,

    'Matrix, function': function (x, callback) {
      return x.map(callback);
    }
  });

  map.toTex = undefined; // use default template

  return map;
}

/**
 * Map for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @return {Array}
 * @private
 */
function _map (array, callback) {
  // figure out what number of arguments the callback function expects
  var args = maxArgumentCount(callback);

  var recurse = function (value, index) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i));
      });
    }
    else {
      // invoke the callback function with the right number of arguments
      if (args === 1) {
        return callback(value);
      }
      else if (args === 2) {
        return callback(value, index);
      }
      else { // 3 or -1
        return callback(value, index, array);
      }
    }
  };

  return recurse(array, []);
}

exports.name = 'map';
exports.factory = factory;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isInteger = __webpack_require__(2).isInteger;
var resize = __webpack_require__(3).resize;

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Create a matrix filled with ones. The created matrix can have one or
   * multiple dimensions.
   *
   * Syntax:
   *
   *    math.ones(m)
   *    math.ones(m, format)
   *    math.ones(m, n)
   *    math.ones(m, n, format)
   *    math.ones([m, n])
   *    math.ones([m, n], format)
   *    math.ones([m, n, p, ...])
   *    math.ones([m, n, p, ...], format)
   *
   * Examples:
   *
   *    math.ones(3);                   // returns [1, 1, 1]
   *    math.ones(3, 2);                // returns [[1, 1], [1, 1], [1, 1]]
   *    math.ones(3, 2, 'dense');       // returns Dense Matrix [[1, 1], [1, 1], [1, 1]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.ones(math.size(A));       // returns [[1, 1, 1], [1, 1, 1]]
   *
   * See also:
   *
   *    zeros, eye, size, range
   *
   * @param {...number | Array} size    The size of each dimension of the matrix
   * @param {string} [format]           The Matrix storage format
   *
   * @return {Array | Matrix | number}  A matrix filled with ones
   */
  var ones = typed('ones', {
    '': function () {
      return (config.matrix === 'Array')
          ? _ones([])
          : _ones([], 'default');
    },

    // math.ones(m, n, p, ..., format)
    // TODO: more accurate signature '...number | BigNumber, string' as soon as typed-function supports this
    '...number | BigNumber | string': function (size) {
      var last = size[size.length - 1];
      if (typeof last === 'string') {
        var format = size.pop();
        return _ones(size, format);
      }
      else if (config.matrix === 'Array') {
        return _ones(size);
      }
      else {
        return _ones(size, 'default');
      }
    },

    'Array': _ones,

    'Matrix': function (size) {
      var format = size.storage();
      return _ones(size.valueOf(), format);
    },

    'Array | Matrix, string': function (size, format) {
      return _ones (size.valueOf(), format);
    }
  });

  ones.toTex = undefined; // use default template

  return ones;

  /**
   * Create an Array or Matrix with ones
   * @param {Array} size
   * @param {string} [format='default']
   * @return {Array | Matrix}
   * @private
   */
  function _ones(size, format) {
    var hasBigNumbers = _normalize(size);
    var defaultValue = hasBigNumbers ? new type.BigNumber(1) : 1;
    _validate(size);

    if (format) {
      // return a matrix
      var m = matrix(format);
      if (size.length > 0) {
        return m.resize(size, defaultValue);
      }
      return m;
    }
    else {
      // return an Array
      var arr = [];
      if (size.length > 0) {
        return resize(arr, size, defaultValue);
      }
      return arr;
    }
  }

  // replace BigNumbers with numbers, returns true if size contained BigNumbers
  function _normalize(size) {
    var hasBigNumbers = false;
    size.forEach(function (value, index, arr) {
      if (value && value.isBigNumber === true) {
        hasBigNumbers = true;
        arr[index] = value.toNumber();
      }
    });
    return hasBigNumbers;
  }

  // validate arguments
  function _validate (size) {
    size.forEach(function (value) {
      if (typeof value !== 'number' || !isInteger(value) || value < 0) {
        throw new Error('Parameters in function ones must be positive integers');
      }
    });
  }
}

exports.name = 'ones';
exports.factory = factory;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isInteger = __webpack_require__(2).isInteger;

function factory (type, config, load, typed) {
  var asc = load(__webpack_require__(25));
  function desc(a, b) {
    return -asc(a, b);
  }

  /**
   * Partition-based selection of an array or 1D matrix.
   * Will find the kth smallest value, and mutates the input array.
   * Uses Quickselect.
   *
   * Syntax:
   *
   *    math.partitionSelect(x, k)
   *    math.partitionSelect(x, k, compare)
   *
   * Examples:
   *
   *    math.partitionSelect([5, 10, 1], 2);           // returns 10
   *    math.partitionSelect(['C', 'B', 'A', 'D'], 1); // returns 'B'
   *
   *    function sortByLength (a, b) {
   *      return a.length - b.length;
   *    }
   *    math.partitionSelect(['Langdon', 'Tom', 'Sara'], 2, sortByLength); // returns 'Langdon'
   *
   * See also:
   *
   *    sort
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to sort
   * @param {Number} k            The kth smallest value to be retrieved; zero-based index
   * @param {Function | 'asc' | 'desc'} [compare='asc']
   *        An optional comparator function. The function is called as
   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
   *        and 0 when a == b.
   * @return {*} Returns the kth lowest value.
   */
  return typed('partitionSelect', {
    'Array | Matrix, number': function (x, k) {
      return _partitionSelect(x, k, asc);
    },

    'Array | Matrix, number, string': function (x, k, compare) {
      if (compare === 'asc') {
        return _partitionSelect(x, k, asc);
      }
      else if (compare === 'desc') {
        return _partitionSelect(x, k, desc);
      }
      else {
        throw new Error('Compare string must be "asc" or "desc"');
      }
    },

    'Array | Matrix, number, function': _partitionSelect
  });

  function _partitionSelect(x, k, compare) {
    if (!isInteger(k) || k < 0) {
      throw new Error('k must be a non-negative integer');
    }

    if (x && x.isMatrix) {
      var size = x.size();
      if (size.length > 1) {
        throw new Error('Only one dimensional matrices supported');
      }
      return quickSelect(x.valueOf(), k, compare);
    }

    if (Array.isArray(x)) {
      return quickSelect(x, k, compare);
    }
  }

  /**
   * Quickselect algorithm.
   * Code adapted from:
   * http://blog.teamleadnet.com/2012/07/quick-select-algorithm-find-kth-element.html
   *
   * @param {Array} arr
   * @param {Number} k
   * @param {Function} compare
   * @private
   */
  function quickSelect(arr, k, compare) {
    if (k >= arr.length) {
      throw new Error('k out of bounds');
    }

    var from = 0;
    var to = arr.length - 1;

    // if from == to we reached the kth element
    while (from < to) {
      var r = from;
      var w = to;
      var pivot = arr[Math.floor(Math.random() * (to - from + 1)) + from];

      // stop if the reader and writer meets
      while (r < w) {
        // arr[r] >= pivot
        if (compare(arr[r], pivot) >= 0) { // put the large values at the end
          var tmp = arr[w];
          arr[w] = arr[r];
          arr[r] = tmp;
          --w;
        } else { // the value is smaller than the pivot, skip
          ++r;
        }
      }

      // if we stepped up (r++) we need to step one down (arr[r] > pivot)
      if (compare(arr[r], pivot) > 0) {
        --r;
      }

      // the r pointer is on the end of the first k elements
      if (k <= r) {
        to = r;
      } else {
        from = r + 1;
      }
    }

    return arr[k];
  }
}

exports.name = 'partitionSelect';
exports.factory = factory;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  var ZERO = new type.BigNumber(0);
  var ONE = new type.BigNumber(1);

  /**
   * Create an array from a range.
   * By default, the range end is excluded. This can be customized by providing
   * an extra parameter `includeEnd`.
   *
   * Syntax:
   *
   *     math.range(str [, includeEnd])               // Create a range from a string,
   *                                                  // where the string contains the
   *                                                  // start, optional step, and end,
   *                                                  // separated by a colon.
   *     math.range(start, end [, includeEnd])        // Create a range with start and
   *                                                  // end and a step size of 1.
   *     math.range(start, end, step [, includeEnd])  // Create a range with start, step,
   *                                                  // and end.
   *
   * Where:
   *
   * - `str: string`
   *   A string 'start:end' or 'start:step:end'
   * - `start: {number | BigNumber}`
   *   Start of the range
   * - `end: number | BigNumber`
   *   End of the range, excluded by default, included when parameter includeEnd=true
   * - `step: number | BigNumber`
   *   Step size. Default value is 1.
   * - `includeEnd: boolean`
   *   Option to specify whether to include the end or not. False by default.
   *
   * Examples:
   *
   *     math.range(2, 6);        // [2, 3, 4, 5]
   *     math.range(2, -3, -1);   // [2, 1, 0, -1, -2]
   *     math.range('2:1:6');     // [2, 3, 4, 5]
   *     math.range(2, 6, true);  // [2, 3, 4, 5, 6]
   *
   * See also:
   *
   *     ones, zeros, size, subset
   *
   * @param {*} args   Parameters describing the ranges `start`, `end`, and optional `step`.
   * @return {Array | Matrix} range
   */
  var range = typed('range', {
    // TODO: simplify signatures when typed-function supports default values and optional arguments

    // TODO: a number or boolean should not be converted to string here
    'string': _strRange,
    'string, boolean': _strRange,

    'number, number':  function (start, end) {
      return _out(_rangeEx(start, end, 1));
    },
    'number, number, number': function (start, end, step) {
      return _out(_rangeEx(start, end, step));
    },
    'number, number, boolean': function (start, end, includeEnd) {
      return includeEnd
          ? _out(_rangeInc(start, end, 1))
          : _out(_rangeEx(start, end, 1));
    },
    'number, number, number, boolean': function (start, end, step, includeEnd) {
      return includeEnd
          ? _out(_rangeInc(start, end, step))
          : _out(_rangeEx(start, end, step));
    },

    'BigNumber, BigNumber':  function (start, end) {
      return _out(_bigRangeEx(start, end, ONE));
    },
    'BigNumber, BigNumber, BigNumber': function (start, end, step) {
      return _out(_bigRangeEx(start, end, step));
    },
    'BigNumber, BigNumber, boolean': function (start, end, includeEnd) {
      return includeEnd
          ? _out(_bigRangeInc(start, end, ONE))
          : _out(_bigRangeEx(start, end, ONE));
    },
    'BigNumber, BigNumber, BigNumber, boolean': function (start, end, step, includeEnd) {
      return includeEnd
          ? _out(_bigRangeInc(start, end, step))
          : _out(_bigRangeEx(start, end, step));
    }

  });

  range.toTex = undefined; // use default template

  return range;

  function _out(arr) {
    return config.matrix === 'Array' ? arr : matrix(arr);
  }

  function _strRange (str, includeEnd) {
    var r = _parse(str);
    if (!r){
      throw new SyntaxError('String "' + str + '" is no valid range');
    }

    var fn;
    if (config.number === 'BigNumber') {
      fn = includeEnd ? _bigRangeInc : _bigRangeEx;
      return _out(fn(
          new type.BigNumber(r.start),
          new type.BigNumber(r.end),
          new type.BigNumber(r.step)));
    }
    else {
      fn = includeEnd ? _rangeInc : _rangeEx;
      return _out(fn(r.start, r.end, r.step));
    }
  }

  /**
   * Create a range with numbers. End is excluded
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {Array} range
   * @private
   */
  function _rangeEx (start, end, step) {
    var array = [],
        x = start;
    if (step > 0) {
      while (x < end) {
        array.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }

  /**
   * Create a range with numbers. End is included
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {Array} range
   * @private
   */
  function _rangeInc (start, end, step) {
    var array = [],
        x = start;
    if (step > 0) {
      while (x <= end) {
        array.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x >= end) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }

  /**
   * Create a range with big numbers. End is excluded
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */
  function _bigRangeEx (start, end, step) {
    var array = [],
        x = start;
    if (step.gt(ZERO)) {
      while (x.lt(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }
    else if (step.lt(ZERO)) {
      while (x.gt(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }

    return array;
  }

  /**
   * Create a range with big numbers. End is included
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */
  function _bigRangeInc (start, end, step) {
    var array = [],
        x = start;
    if (step.gt(ZERO)) {
      while (x.lte(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }
    else if (step.lt(ZERO)) {
      while (x.gte(end)) {
        array.push(x);
        x = x.plus(step);
      }
    }

    return array;
  }

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @param {string} str
   * @return {{start: number, end: number, step: number} | null} range Object containing properties start, end, step
   * @private
   */
  function _parse (str) {
    var args = str.split(':');

    // number
    var nums = args.map(function (arg) {
      // use Number and not parseFloat as Number returns NaN on invalid garbage in the string
      return Number(arg);
    });

    var invalid = nums.some(function (num) {
      return isNaN(num);
    });
    if(invalid) {
      return null;
    }

    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        };

      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        };

      default:
        return null;
    }
  }

}

exports.name = 'range';
exports.factory = factory;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);

var isInteger = __webpack_require__(2).isInteger;
var array = __webpack_require__(3);

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Reshape a multi dimensional array to fit the specified dimensions
   *
   * Syntax:
   *
   *     math.reshape(x, sizes)
   *
   * Examples:
   *
   *     math.reshape([1, 2, 3, 4, 5, 6], [2, 3]);
   *     // returns Array  [[1, 2, 3], [4, 5, 6]]
   *
   *     math.reshape([[1, 2], [3, 4]], [1, 4]);
   *     // returns Array  [[1, 2, 3, 4]]
   *
   *     math.reshape([[1, 2], [3, 4]], [4]);
   *     // returns Array [1, 2, 3, 4]
   *
   *     var x = math.matrix([1, 2, 3, 4, 5, 6, 7, 8]);
   *     math.reshape(x, [2, 2, 2]);
   *     // returns Matrix [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
   *
   * See also:
   *
   *     size, squeeze, resize
   *
   * @param {Array | Matrix | *} x  Matrix to be reshaped
   * @param {number[]} sizes        One dimensional array with integral sizes for
   *                                each dimension
   *
   * @return {* | Array | Matrix}   A reshaped clone of matrix `x`
   *
   * @throws {TypeError}            If `sizes` does not contain solely integers
   * @throws {DimensionError}       If the product of the new dimension sizes does
   *                                not equal that of the old ones
   */
  var reshape = typed('reshape', {

    'Matrix, Array': function (x, sizes) {
      if(x.reshape) {
        return x.reshape(sizes);
      } else {
        return matrix(array.reshape(x.valueOf(), sizes));
      }
    },

    'Array, Array': function (x, sizes) {
      sizes.forEach(function (size) {
        if (!isInteger(size)) {
          throw new TypeError('Invalid size for dimension: ' + size);
        }
      });
      return array.reshape(x, sizes);
    }

  });

  reshape.toTex = undefined; // use default template

  return reshape;
}

exports.name = 'reshape';
exports.factory = factory;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DimensionError = __webpack_require__(4);
var ArgumentsError = __webpack_require__(27);

var isInteger = __webpack_require__(2).isInteger;
var format = __webpack_require__(9).format;
var clone = __webpack_require__(1).clone;
var array = __webpack_require__(3);

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Resize a matrix
   *
   * Syntax:
   *
   *     math.resize(x, size)
   *     math.resize(x, size, defaultValue)
   *
   * Examples:
   *
   *     math.resize([1, 2, 3, 4, 5], [3]); // returns Array  [1, 2, 3]
   *     math.resize([1, 2, 3], [5], 0);    // returns Array  [1, 2, 3, 0, 0]
   *     math.resize(2, [2, 3], 0);         // returns Matrix [[2, 0, 0], [0, 0, 0]]
   *     math.resize("hello", [8], "!");    // returns string 'hello!!!'
   *
   * See also:
   *
   *     size, squeeze, subset, reshape
   *
   * @param {Array | Matrix | *} x             Matrix to be resized
   * @param {Array | Matrix} size              One dimensional array with numbers
   * @param {number | string} [defaultValue=0] Zero by default, except in
   *                                           case of a string, in that case
   *                                           defaultValue = ' '
   * @return {* | Array | Matrix} A resized clone of matrix `x`
   */
  // TODO: rework resize to a typed-function
  var resize = function resize (x, size, defaultValue) {
    if (arguments.length != 2 && arguments.length != 3) {
      throw new ArgumentsError('resize', arguments.length, 2, 3);
    }

    if (size && size.isMatrix === true) {
      size = size.valueOf(); // get Array
    }

    if (size.length && size[0] && size[0].isBigNumber === true) {
      // convert bignumbers to numbers
      size = size.map(function (value) {
        return (value && value.isBigNumber === true) ? value.toNumber() : value;
      });
    }
    
    // check x is a Matrix
    if (x && x.isMatrix === true) {
      // use optimized matrix implementation, return copy
      return x.resize(size, defaultValue, true);
    }
    
    if (typeof x === 'string') {
      // resize string
      return _resizeString(x, size, defaultValue);
    }
    
    // check result should be a matrix
    var asMatrix = Array.isArray(x) ? false : (config.matrix !== 'Array');

    if (size.length == 0) {
      // output a scalar
      while (Array.isArray(x)) {
        x = x[0];
      }

      return clone(x);
    }
    else {
      // output an array/matrix
      if (!Array.isArray(x)) {
        x = [x];
      }
      x = clone(x);

      var res = array.resize(x, size, defaultValue);
      return asMatrix ? matrix(res) : res;
    }
  };

  resize.toTex = undefined; // use default template

  return resize;

  /**
   * Resize a string
   * @param {string} str
   * @param {number[]} size
   * @param {string} [defaultChar=' ']
   * @private
   */
  function _resizeString(str, size, defaultChar) {
    if (defaultChar !== undefined) {
      if (typeof defaultChar !== 'string' || defaultChar.length !== 1) {
        throw new TypeError('Single character expected as defaultValue');
      }
    }
    else {
      defaultChar = ' ';
    }

    if (size.length !== 1) {
      throw new DimensionError(size.length, 1);
    }
    var len = size[0];
    if (typeof len !== 'number' || !isInteger(len)) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + format(size) + ')');
    }

    if (str.length > len) {
      return str.substring(0, len);
    }
    else if (str.length < len) {
      var res = str;
      for (var i = 0, ii = len - str.length; i < ii; i++) {
        res += defaultChar;
      }
      return res;
    }
    else {
      return str;
    }
  }
}

exports.name = 'resize';
exports.factory = factory;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var array = __webpack_require__(3);

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Calculate the size of a matrix or scalar.
   *
   * Syntax:
   *
   *     math.size(x)
   *
   * Examples:
   *
   *     math.size(2.3);                  // returns []
   *     math.size('hello world');        // returns [11]
   *
   *     var A = [[1, 2, 3], [4, 5, 6]];
   *     math.size(A);                    // returns [2, 3]
   *     math.size(math.range(1,6));      // returns [5]
   *
   * See also:
   *
   *     resize, squeeze, subset
   *
   * @param {boolean | number | Complex | Unit | string | Array | Matrix} x  A matrix
   * @return {Array | Matrix} A vector with size of `x`.
   */
  var size = typed('size', {
    'Matrix': function (x) {
      // TODO: return the same matrix type as the input
      return matrix(x.size());
    },

    'Array': array.size,

    'string': function (x) {
      return (config.matrix === 'Array') ? [x.length] : matrix([x.length]);
    },

    'number | Complex | BigNumber | Unit | boolean | null': function (x) {
      // scalar
      return (config.matrix === 'Array') ? [] : matrix([]);
    }
  });

  size.toTex = undefined; // use default template

  return size;
}

exports.name = 'size';
exports.factory = factory;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var size = __webpack_require__(3).size;

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));
  var compareAsc = load(__webpack_require__(25));
  var compareDesc = function (a, b) {
    return -compareAsc(a, b);
  };
  var compareNatural = load(__webpack_require__(81));

  /**
   * Sort the items in a matrix.
   *
   * Syntax:
   *
   *    math.sort(x)
   *    math.sort(x, compare)
   *
   * Examples:
   *
   *    math.sort([5, 10, 1]); // returns [1, 5, 10]
   *    math.sort(['C', 'B', 'A', 'D']); // returns ['A', 'B', 'C', 'D']
   *
   *    function sortByLength (a, b) {
   *      return a.length - b.length;
   *    }
   *    math.sort(['Langdon', 'Tom', 'Sara'], sortByLength); // returns ['Tom', 'Sara', 'Langdon']
   *
   * See also:
   *
   *    filter, forEach, map, compare, compareNatural
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to sort
   * @param {Function | 'asc' | 'desc' | 'natural'} [compare='asc']
   *        An optional _comparator function or name. The function is called as
   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
   *        and 0 when a == b.
   * @return {Matrix | Array} Returns the sorted matrix.
   */
  var sort = typed('sort', {
    'Array': function (x) {
      _arrayIsVector(x);
      return x.sort(compareAsc);
    },

    'Matrix': function (x) {
      _matrixIsVector(x);
      return matrix(x.toArray().sort(compareAsc), x.storage());
    },

    'Array, function': function (x, _comparator) {
      _arrayIsVector(x);
      return x.sort(_comparator);
    },

    'Matrix, function': function (x, _comparator) {
      _matrixIsVector(x);
      return matrix(x.toArray().sort(_comparator), x.storage());
    },

    'Array, string': function (x, order) {
      _arrayIsVector(x);
      return x.sort(_comparator(order));
    },

    'Matrix, string': function (x, order) {
      _matrixIsVector(x);
      return matrix(x.toArray().sort(_comparator(order)), x.storage());
    }
  });

  sort.toTex = undefined; // use default template

  /**
   * Get the comparator for given order ('asc', 'desc', 'natural')
   * @param {'asc' | 'desc' | 'natural'} order
   * @return {Function} Returns a _comparator function
   */
  function _comparator (order) {
    if (order === 'asc') {
      return compareAsc;
    }
    else if (order === 'desc') {
      return compareDesc;
    }
    else if (order === 'natural') {
      return compareNatural;
    }
    else {
      throw new Error('String "asc", "desc", or "natural" expected');
    }
  }

  /**
   * Validate whether an array is one dimensional
   * Throws an error when this is not the case
   * @param {Array} array
   * @private
   */
  function _arrayIsVector (array) {
    if (size(array).length !== 1) {
      throw new Error('One dimensional array expected');
    }
  }

  /**
   * Validate whether a matrix is one dimensional
   * Throws an error when this is not the case
   * @param {Matrix} matrix
   * @private
   */
  function _matrixIsVector (matrix) {
    if (matrix.size().length !== 1) {
      throw new Error('One dimensional matrix expected');
    }
  }

  return sort;
}

exports.name = 'sort';
exports.factory = factory;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var naturalSort = __webpack_require__(82);

function factory (type, config, load, typed) {
  var getTypeOf = load(__webpack_require__(83));
  var matrix = load(__webpack_require__(0));
  var compare = load(__webpack_require__(25));

  var compareBooleans = compare.signatures['boolean,boolean']

  /**
   * Compare two values of any type in a deterministic, natural way.
   *
   * For numeric values, the function works the same as `math.compare`.
   * For types of values that can't be compared mathematically,
   * the function compares in a natural way.
   *
   * For numeric values, x and y are considered equal when the relative
   * difference between x and y is smaller than the configured epsilon.
   * The function cannot be used to compare values smaller than
   * approximately 2.22e-16.
   *
   * For Complex numbers, first the real parts are compared. If equal,
   * the imaginary parts are compared.
   *
   * Arrays and Matrices are compared value by value until there is an
   * unequal pair of values encountered. Objects are compared by sorted
   * keys until the keys or their values are unequal.
   *
   * Syntax:
   *
   *    math.compareNatural(x, y)
   *
   * Examples:
   *
   *    math.compareNatural(6, 1);              // returns 1
   *    math.compareNatural(2, 3);              // returns -1
   *    math.compareNatural(7, 7);              // returns 0
   *
   *    math.compareNatural('10', '2');         // returns 1
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('40 mm');
   *    math.compareNatural(a, b);              // returns 1
   *
   *    var c = math.complex('2 + 3i');
   *    var d = math.complex('2 + 4i');
   *    math.compareNatural(c, d);              // returns -1
   *
   *    math.compareNatural([1, 2, 4], [1, 2, 3]); // returns 1
   *    math.compareNatural([1, 2, 3], [1, 2]);    // returns 1
   *    math.compareNatural([1, 5], [1, 2, 3]);    // returns 1
   *    math.compareNatural([1, 2], [1, 2]);       // returns 0
   *
   *    math.compareNatural({a: 2}, {a: 4});       // returns -1
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {*} x First value to compare
   * @param  {*} y Second value to compare
   * @return {number} Returns the result of the comparison: 1, 0 or -1.
   */
  var compareNatural = typed('compareNatural', {
    'any, any': function (x, y) {
      var typeX = getTypeOf(x);
      var typeY = getTypeOf(y);
      var c;

      // numeric types
      if ((typeX === 'number' || typeX === 'BigNumber' || typeX === 'Fraction') &&
          (typeY === 'number' || typeY === 'BigNumber' || typeY === 'Fraction')) {
        c = compare(x, y);
        if (c.toString() !== '0') {
          // c can be number, BigNumber, or Fraction
          return c > 0 ? 1 : -1; // return a number
        }
        else {
          return naturalSort(typeX, typeY);
        }
      }

      // matrix types
      if (typeX === 'Array' || typeX === 'Matrix' ||
          typeY === 'Array' || typeY === 'Matrix') {
        c = compareMatricesAndArrays (x, y);
        if (c !== 0) {
          return c;
        }
        else {
          return naturalSort(typeX, typeY);
        }
      }

      // in case of different types, order by name of type, i.e. 'BigNumber' < 'Complex'
      if (typeX !== typeY) {
        return naturalSort(typeX, typeY);
      }

      if (typeX === 'Complex') {
        return compareComplexNumbers(x, y);
      }

      if (typeX === 'Unit') {
        if (x.equalBase(y)) {
          return compareNatural(x.value, y.value);
        }

        // compare by units
        return compareArrays(x.formatUnits(), y.formatUnits());
      }

      if (typeX === 'boolean') {
        return compareBooleans(x, y);
      }

      if (typeX === 'string') {
        return naturalSort(x, y);
      }

      if (typeX === 'Object') {
        return compareObjects(x, y);
      }

      if (typeX === 'null') {
        return 0;
      }

      if (typeX === 'undefined') {
        return 0;
      }

      // this should not occur...
      throw new TypeError('Unsupported type of value "' + typeX + '"');
    }
  });

  compareNatural.toTex = undefined; // use default template

  /**
   * Compare mixed matrix/array types, by converting to same-shaped array.
   * This comparator is non-deterministic regarding input types.
   * @param {Array | SparseMatrix | DenseMatrix | *} x
   * @param {Array | SparseMatrix | DenseMatrix | *} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareMatricesAndArrays (x, y) {
    if (x && x.isSparseMatrix && y && y.isSparseMatrix) {
      return compareArrays(x.toJSON().values, y.toJSON().values);
    }
    if (x && x.isSparseMatrix) {
      // note: convert to array is expensive
      return compareMatricesAndArrays(x.toArray(), y);
    }
    if (y && y.isSparseMatrix) {
      // note: convert to array is expensive
      return compareMatricesAndArrays(x, y.toArray());
    }

    // convert DenseArray into Array
    if (x && x.isDenseMatrix) {
      return compareMatricesAndArrays(x.toJSON().data, y);
    }
    if (y && y.isDenseMatrix) {
      return compareMatricesAndArrays(x, y.toJSON().data);
    }

    // convert scalars to array
    if (!Array.isArray(x)) {
      return compareMatricesAndArrays([x], y);
    }
    if (!Array.isArray(y)) {
      return compareMatricesAndArrays(x, [y]);
    }

    return compareArrays(x, y);
  }

  /**
   * Compare two Arrays
   *
   * - First, compares value by value
   * - Next, if all corresponding values are equal,
   *   look at the length: longest array will be considered largest
   *
   * @param {Array} x
   * @param {Array} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareArrays (x, y) {
    // compare each value
    for (var i = 0, ii = Math.min(x.length, y.length); i < ii; i++) {
      var v = compareNatural(x[i], y[i]);
      if (v !== 0) {
        return v;
      }
    }

    // compare the size of the arrays
    if (x.length > y.length) { return 1; }
    if (x.length < y.length) { return -1; }

    // both Arrays have equal size and content
    return 0;
  }

  /**
   * Compare two objects
   *
   * - First, compare sorted property names
   * - Next, compare the property values
   *
   * @param {Object} x
   * @param {Object} y
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareObjects (x, y) {
    var keysX = Object.keys(x);
    var keysY = Object.keys(y);

    // compare keys
    keysX.sort(naturalSort)
    keysY.sort(naturalSort)
    var c = compareArrays(keysX, keysY);
    if (c !== 0) {
      return c;
    }

    // compare values
    for (var i = 0; i < keysX.length; i++) {
      var v = compareNatural(x[keysX[i]], y[keysY[i]]);
      if (v !== 0) {
        return v;
      }
    }

    return 0;
  }

  return compareNatural;
}

/**
 * Compare two complex numbers, `x` and `y`:
 *
 * - First, compare the real values of `x` and `y`
 * - If equal, compare the imaginary values of `x` and `y`
 * 
 * @params {Complex} x
 * @params {Complex} y
 * @returns {number} Returns the comparison result: -1, 0, or 1
 */
function compareComplexNumbers (x, y) {
  if (x.re > y.re) { return 1; }
  if (x.re < y.re) { return -1; }

  if (x.im > y.im) { return 1; }
  if (x.im < y.im) { return -1; }

  return 0;
}

exports.name = 'compareNatural';
exports.factory = factory;


/***/ }),
/* 82 */
/***/ (function(module, exports) {

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */
/*jshint unused:false */
module.exports = function naturalSort (a, b) {
	"use strict";
	var re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
		sre = /(^[ ]*|[ ]*$)/g,
		dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
		hre = /^0x[0-9a-f]+$/i,
		ore = /^0/,
		i = function(s) { return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s; },
		// convert all to strings strip whitespace
		x = i(a).replace(sre, '') || '',
		y = i(b).replace(sre, '') || '',
		// chunk/tokenize
		xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		// numeric, hex or date detection
		xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
		yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
		oFxNcL, oFyNcL;
	// first try and sort Hex codes or Dates
	if (yD) {
		if ( xD < yD ) { return -1; }
		else if ( xD > yD ) { return 1; }
	}
	// natural sorting through split numeric strings and default strings
	for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
		// find floats not starting with '0', string or 0 if not defined (Clint Priest)
		oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
		oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
		// handle numeric vs string comparison - number < string - (Kyle Adams)
		if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
		// rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
		else if (typeof oFxNcL !== typeof oFyNcL) {
			oFxNcL += '';
			oFyNcL += '';
		}
		if (oFxNcL < oFyNcL) { return -1; }
		if (oFxNcL > oFyNcL) { return 1; }
	}
	return 0;
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var types = __webpack_require__(21);

function factory (type, config, load, typed) {
  /**
   * Determine the type of a variable.
   *
   * Function `typeof` recognizes the following types of objects:
   *
   * Object                 | Returns       | Example
   * ---------------------- | ------------- | ------------------------------------------
   * null                   | `'null'`      | `math.typeof(null)`
   * number                 | `'number'`    | `math.typeof(3.5)`
   * boolean                | `'boolean'`   | `math.typeof (true)`
   * string                 | `'string'`    | `math.typeof ('hello world')`
   * Array                  | `'Array'`     | `math.typeof ([1, 2, 3])`
   * Date                   | `'Date'`      | `math.typeof (new Date())`
   * Function               | `'Function'`  | `math.typeof (function () {})`
   * Object                 | `'Object'`    | `math.typeof ({a: 2, b: 3})`
   * RegExp                 | `'RegExp'`    | `math.typeof (/a regexp/)`
   * undefined              | `'undefined'` | `math.typeof(undefined)`
   * math.type.BigNumber    | `'BigNumber'` | `math.typeof (math.bignumber('2.3e500'))`
   * math.type.Chain        | `'Chain'`     | `math.typeof (math.chain(2))`
   * math.type.Complex      | `'Complex'`   | `math.typeof (math.complex(2, 3))`
   * math.type.Fraction     | `'Fraction'`  | `math.typeof (math.fraction(1, 3))`
   * math.type.Help         | `'Help'`      | `math.typeof (math.help('sqrt'))`
   * math.type.Index        | `'Index'`     | `math.typeof (math.index(1, 3))`
   * math.type.Matrix       | `'Matrix'`    | `math.typeof (math.matrix([[1,2], [3, 4]]))`
   * math.type.Range        | `'Range'`     | `math.typeof (math.range(0, 10))`
   * math.type.Unit         | `'Unit'`      | `math.typeof (math.unit('45 deg'))`
   *
   * Syntax:
   *
   *    math.typeof(x)
   *
   * Examples:
   *
   *    math.typeof(3.5);                     // returns 'number'
   *    math.typeof(math.complex('2-4i'));    // returns 'Complex'
   *    math.typeof(math.unit('45 deg'));     // returns 'Unit'
   *    math.typeof('hello world');           // returns 'string'
   *
   * @param {*} x     The variable for which to test the type.
   * @return {string} Returns the name of the type. Primitive types are lower case,
   *                  non-primitive types are upper-camel-case.
   *                  For example 'number', 'string', 'Array', 'Date'.
   */
  var _typeof = typed('_typeof', {
    'any': function (x) {
      // JavaScript types
      var t = types.type(x);

      // math.js types
      if (t === 'Object') {
        if (x.isBigNumber === true) return 'BigNumber';
        if (x.isComplex === true)   return 'Complex';
        if (x.isFraction === true)  return 'Fraction';
        if (x.isMatrix === true)    return 'Matrix';
        if (x.isUnit === true)      return 'Unit';
        if (x.isIndex === true)     return 'Index';
        if (x.isRange === true)     return 'Range';
        if (x.isChain === true)     return 'Chain';
        if (x.isHelp === true)      return 'Help';
      }

      return t;
    }
  });

  _typeof.toTex = undefined; // use default template

  return _typeof;
}

exports.name = 'typeof';
exports.factory = factory;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var object = __webpack_require__(1);
var array = __webpack_require__(3);

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Squeeze a matrix, remove inner and outer singleton dimensions from a matrix.
   *
   * Syntax:
   *
   *     math.squeeze(x)
   *
   * Examples:
   *
   *     math.squeeze([3]);           // returns 3
   *     math.squeeze([[3]]);         // returns 3
   *
   *     var A = math.zeros(3, 1);    // returns [[0], [0], [0]] (size 3x1)
   *     math.squeeze(A);             // returns [0, 0, 0] (size 3)
   *
   *     var B = math.zeros(1, 3);    // returns [[0, 0, 0]] (size 1x3)
   *     math.squeeze(B);             // returns [0, 0, 0] (size 3)
   *
   *     // only inner and outer dimensions are removed
   *     var C = math.zeros(2, 1, 3); // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
   *     math.squeeze(C);             // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
   *
   * See also:
   *
   *     subset
   *
   * @param {Matrix | Array} x      Matrix to be squeezed
   * @return {Matrix | Array} Squeezed matrix
   */
  var squeeze = typed('squeeze', {
    'Array': function (x) {
      return array.squeeze(object.clone(x));
    },

    'Matrix': function (x) {
      var res = array.squeeze(x.toArray());
      // FIXME: return the same type of matrix as the input
      return Array.isArray(res) ? matrix(res) : res;
    },

    'any': function (x) {
      // scalar
      return object.clone(x);
    }
  });

  squeeze.toTex = undefined; // use default template

  return squeeze;
}

exports.name = 'squeeze';
exports.factory = factory;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clone = __webpack_require__(1).clone;
var validateIndex = __webpack_require__(3).validateIndex;
var getSafeProperty = __webpack_require__(14).getSafeProperty;
var setSafeProperty = __webpack_require__(14).setSafeProperty;
var DimensionError = __webpack_require__(4);

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Get or set a subset of a matrix or string.
   *
   * Syntax:
   *     math.subset(value, index)                                // retrieve a subset
   *     math.subset(value, index, replacement [, defaultValue])  // replace a subset
   *
   * Examples:
   *
   *     // get a subset
   *     var d = [[1, 2], [3, 4]];
   *     math.subset(d, math.index(1, 0));        // returns 3
   *     math.subset(d, math.index([0, 2], 1));   // returns [[2], [4]]
   *
   *     // replace a subset
   *     var e = [];
   *     var f = math.subset(e, math.index(0, [0, 2]), [5, 6]);  // f = [[5, 6]]
   *     var g = math.subset(f, math.index(1, 1), 7, 0);         // g = [[5, 6], [0, 7]]
   *
   * See also:
   *
   *     size, resize, squeeze, index
   *
   * @param {Array | Matrix | string} matrix  An array, matrix, or string
   * @param {Index} index                     An index containing ranges for each
   *                                          dimension
   * @param {*} [replacement]                 An array, matrix, or scalar.
   *                                          If provided, the subset is replaced with replacement.
   *                                          If not provided, the subset is returned
   * @param {*} [defaultValue=undefined]      Default value, filled in on new entries when
   *                                          the matrix is resized. If not provided,
   *                                          math.matrix elements will be left undefined.
   * @return {Array | Matrix | string} Either the retrieved subset or the updated matrix.
   */
  var subset = typed('subset', {
    // get subset
    'Array, Index': function (value, index) {
      var m = matrix(value);
      var subset = m.subset(index);       // returns a Matrix
      return index.isScalar()
          ? subset
          : subset.valueOf();  // return an Array (like the input)
    },

    'Matrix, Index': function (value, index) {
      return value.subset(index);
    },

    'Object, Index': _getObjectProperty,

    'string, Index': _getSubstring,

    // set subset
    'Array, Index, any': function (value, index, replacement) {
      return matrix(clone(value))
          .subset(index, replacement, undefined)
          .valueOf();
    },

    'Array, Index, any, any': function (value, index, replacement, defaultValue) {
      return matrix(clone(value))
          .subset(index, replacement, defaultValue)
          .valueOf();
    },

    'Matrix, Index, any': function (value, index, replacement) {
      return value.clone().subset(index, replacement);
    },

    'Matrix, Index, any, any': function (value, index, replacement, defaultValue) {
      return value.clone().subset(index, replacement, defaultValue);
    },

    'string, Index, string': _setSubstring,
    'string, Index, string, string': _setSubstring,
    'Object, Index, any': _setObjectProperty
  });

  subset.toTex = undefined; // use default template

  return subset;

  /**
   * Retrieve a subset of a string
   * @param {string} str            string from which to get a substring
   * @param {Index} index           An index containing ranges for each dimension
   * @returns {string} substring
   * @private
   */
  function _getSubstring(str, index) {
    if (!index || index.isIndex !== true) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new DimensionError(index.size().length, 1);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    validateIndex(index.min()[0], strLen);
    validateIndex(index.max()[0], strLen);

    var range = index.dimension(0);

    var substr = '';
    range.forEach(function (v) {
      substr += str.charAt(v);
    });

    return substr;
  }

  /**
   * Replace a substring in a string
   * @param {string} str            string to be replaced
   * @param {Index} index           An index containing ranges for each dimension
   * @param {string} replacement    Replacement string
   * @param {string} [defaultValue] Default value to be uses when resizing
   *                                the string. is ' ' by default
   * @returns {string} result
   * @private
   */
  function _setSubstring(str, index, replacement, defaultValue) {
    if (!index || index.isIndex !== true) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new DimensionError(index.size().length, 1);
    }
    if (defaultValue !== undefined) {
      if (typeof defaultValue !== 'string' || defaultValue.length !== 1) {
        throw new TypeError('Single character expected as defaultValue');
      }
    }
    else {
      defaultValue = ' ';
    }

    var range = index.dimension(0);
    var len = range.size()[0];

    if (len != replacement.length) {
      throw new DimensionError(range.size()[0], replacement.length);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    validateIndex(index.min()[0]);
    validateIndex(index.max()[0]);

    // copy the string into an array with characters
    var chars = [];
    for (var i = 0; i < strLen; i++) {
      chars[i] = str.charAt(i);
    }

    range.forEach(function (v, i) {
      chars[v] = replacement.charAt(i[0]);
    });

    // initialize undefined characters with a space
    if (chars.length > strLen) {
      for (i = strLen - 1, len = chars.length; i < len; i++) {
        if (!chars[i]) {
          chars[i] = defaultValue;
        }
      }
    }

    return chars.join('');
  }
}

/**
 * Retrieve a property from an object
 * @param {Object} object
 * @param {Index} index
 * @return {*} Returns the value of the property
 * @private
 */
function _getObjectProperty (object, index) {
  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1);
  }

  var key = index.dimension(0);
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property');
  }

  return getSafeProperty(object, key);
}

/**
 * Set a property on an object
 * @param {Object} object
 * @param {Index} index
 * @param {*} replacement
 * @return {*} Returns the updated object
 * @private
 */
function _setObjectProperty (object, index, replacement) {
  if (index.size().length !== 1) {
    throw new DimensionError(index.size(), 1);
  }

  var key = index.dimension(0);
  if (typeof key !== 'string') {
    throw new TypeError('String expected as index to retrieve an object property');
  }

  // clone the object, and apply the property to the clone
  var updated = clone(object);
  setSafeProperty(updated, key, replacement);

  return updated;
}

exports.name = 'subset';
exports.factory = factory;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clone = __webpack_require__(1).clone;
var format = __webpack_require__(9).format;

function factory (type, config, load, typed) {
  
  var matrix = load(__webpack_require__(0));
  var add = load(__webpack_require__(16));

  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   *
   * Syntax:
   *
   *    math.trace(x)
   *
   * Examples:
   *
   *    math.trace([[1, 2], [3, 4]]); // returns 5
   *
   *    var A = [
   *      [1, 2, 3],
   *      [-1, 2, 3],
   *      [2, 0, 3]
   *    ]
   *    math.trace(A); // returns 6
   *
   * See also:
   *
   *    diag
   *
   * @param {Array | Matrix} x  A matrix
   *
   * @return {number} The trace of `x`
   */
  var trace = typed('trace', {
    
    'Array': function (x) {
      // use dense matrix implementation
      return trace(matrix(x));
    },

    'Matrix': function (x) {
      // result
      var c;
      // process storage format
      switch (x.storage()) {
        case 'dense':
          c = _denseTrace(x);
          break;
        case 'sparse':
          c = _sparseTrace(x);
          break;
      }
      return c;
    },
    
    'any': clone
  });
  
  var _denseTrace = function (m) {
    // matrix size & data
    var size = m._size;
    var data = m._data;
    
    // process dimensions
    switch (size.length) {
      case 1:
        // vector
        if (size[0] == 1) {
          // return data[0]
          return clone(data[0]);
        }
        throw new RangeError('Matrix must be square (size: ' + format(size) + ')');
      case 2:
        // two dimensional
        var rows = size[0];
        var cols = size[1];
        if (rows === cols) {
          // calulate sum
          var sum = 0;
          // loop diagonal
          for (var i = 0; i < rows; i++)
            sum = add(sum, data[i][i]);
          // return trace
          return sum;
        }
        throw new RangeError('Matrix must be square (size: ' + format(size) + ')');        
      default:
        // multi dimensional
        throw new RangeError('Matrix must be two dimensional (size: ' + format(size) + ')');
    }
  };
  
  var _sparseTrace = function (m) {
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    var size = m._size;
    // check dimensions
    var rows = size[0];
    var columns = size[1];
    // matrix must be square
    if (rows === columns) {
      // calulate sum
      var sum = 0;
      // check we have data (avoid looping columns)
      if (values.length > 0) {
        // loop columns
        for (var j = 0; j < columns; j++) {
          // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
          var k0 = ptr[j];
          var k1 = ptr[j + 1];
          // loop k within [k0, k1[
          for (var k = k0; k < k1; k++) {
            // row index
            var i = index[k];
            // check row
            if (i === j) {
              // accumulate value
              sum = add(sum, values[k]);
              // exit loop
              break;
            }
            if (i > j) {
              // exit loop, no value on the diagonal for column j
              break;
            }
          }
        }
      }
      // return trace
      return sum;
    }
    throw new RangeError('Matrix must be square (size: ' + format(size) + ')');   
  };

  trace.toTex = {1: '\\mathrm{tr}\\left(${args[0]}\\right)'};
  
  return trace;
}

exports.name = 'trace';
exports.factory = factory;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clone = __webpack_require__(1).clone;
var format = __webpack_require__(9).format;

function factory (type, config, load, typed) {
  var latex = __webpack_require__(6);

  var matrix = load(__webpack_require__(0));

  var DenseMatrix = type.DenseMatrix,
      SparseMatrix = type.SparseMatrix;

  /**
   * Transpose a matrix. All values of the matrix are reflected over its
   * main diagonal. Only applicable to two dimensional matrices containing
   * a vector (i.e. having size `[1,n]` or `[n,1]`). One dimensional
   * vectors and scalars return the input unchanged.
   *
   * Syntax:
   *
   *     math.transpose(x)
   *
   * Examples:
   *
   *     var A = [[1, 2, 3], [4, 5, 6]];
   *     math.transpose(A);               // returns [[1, 4], [2, 5], [3, 6]]
   *
   * See also:
   *
   *     diag, inv, subset, squeeze
   *
   * @param {Array | Matrix} x  Matrix to be transposed
   * @return {Array | Matrix}   The transposed matrix
   */
  var transpose = typed('transpose', {

    'Array': function (x) {
      // use dense matrix implementation
      return transpose(matrix(x)).valueOf();
    },

    'Matrix': function (x) {
      // matrix size
      var size = x.size();

      // result
      var c;
      
      // process dimensions
      switch (size.length) {
        case 1:
          // vector
          c = x.clone();
          break;

        case 2:
          // rows and columns
          var rows = size[0];
          var columns = size[1];

          // check columns
          if (columns === 0) {
            // throw exception
            throw new RangeError('Cannot transpose a 2D matrix with no columns (size: ' + format(size) + ')');
          }

          // process storage format
          switch (x.storage()) {
            case 'dense':
              c = _denseTranspose(x, rows, columns);
              break;
            case 'sparse':
              c = _sparseTranspose(x, rows, columns);
              break;
          }
          break;
          
        default:
          // multi dimensional
          throw new RangeError('Matrix must be a vector or two dimensional (size: ' + format(this._size) + ')');
      }
      return c;
    },

    // scalars
    'any': function (x) {
      return clone(x);
    }
  });

  var _denseTranspose = function (m, rows, columns) {
    // matrix array
    var data = m._data;
    // transposed matrix data
    var transposed = [];
    var transposedRow;
    // loop columns
    for (var j = 0; j < columns; j++) {
      // initialize row
      transposedRow = transposed[j] = [];
      // loop rows
      for (var i = 0; i < rows; i++) {
        // set data
        transposedRow[i] = clone(data[i][j]);
      }
    }
    // return matrix
    return new DenseMatrix({
      data: transposed,
      size: [columns, rows],
      datatype: m._datatype
    });
  };

  var _sparseTranspose = function (m, rows, columns) {
    // matrix arrays
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    // result matrices
    var cvalues = values ? [] : undefined;
    var cindex = [];
    var cptr = [];
    // row counts
    var w = [];
    for (var x = 0; x < rows; x++)
      w[x] = 0;
    // vars
    var p, l, j;
    // loop values in matrix
    for (p = 0, l = index.length; p < l; p++) {
      // number of values in row
      w[index[p]]++;
    }
    // cumulative sum
    var sum = 0;
    // initialize cptr with the cummulative sum of row counts
    for (var i = 0; i < rows; i++) {
      // update cptr
      cptr.push(sum);
      // update sum
      sum += w[i];
      // update w
      w[i] = cptr[i];
    }
    // update cptr
    cptr.push(sum);
    // loop columns
    for (j = 0; j < columns; j++) {
      // values & index in column
      for (var k0 = ptr[j], k1 = ptr[j + 1], k = k0; k < k1; k++) {
        // C values & index
        var q = w[index[k]]++;
        // C[j, i] = A[i, j]
        cindex[q] = j;
        // check we need to process values (pattern matrix)
        if (values)
          cvalues[q] = clone(values[k]);
      }
    }
    // return matrix
    return new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [columns, rows],
      datatype: m._datatype
    });
  };

  transpose.toTex = {1: '\\left(${args[0]}\\right)' + latex.operators['transpose']};

  return transpose;
}

exports.name = 'transpose';
exports.factory = factory;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isInteger = __webpack_require__(2).isInteger;
var resize = __webpack_require__(3).resize;

function factory (type, config, load, typed) {
  var matrix = load(__webpack_require__(0));

  /**
   * Create a matrix filled with zeros. The created matrix can have one or
   * multiple dimensions.
   *
   * Syntax:
   *
   *    math.zeros(m)
   *    math.zeros(m, format)
   *    math.zeros(m, n)
   *    math.zeros(m, n, format)
   *    math.zeros([m, n])
   *    math.zeros([m, n], format)
   *
   * Examples:
   *
   *    math.zeros(3);                  // returns [0, 0, 0]
   *    math.zeros(3, 2);               // returns [[0, 0], [0, 0], [0, 0]]
   *    math.zeros(3, 'dense');         // returns [0, 0, 0]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.zeros(math.size(A));       // returns [[0, 0, 0], [0, 0, 0]]
   *
   * See also:
   *
   *    ones, eye, size, range
   *
   * @param {...number | Array} size    The size of each dimension of the matrix
   * @param {string} [format]           The Matrix storage format
   *
   * @return {Array | Matrix}           A matrix filled with zeros
   */
  var zeros = typed('zeros', {
    '': function () {
      return (config.matrix === 'Array')
          ? _zeros([])
          : _zeros([], 'default');
    },

    // math.zeros(m, n, p, ..., format)
    // TODO: more accurate signature '...number | BigNumber, string' as soon as typed-function supports this
    '...number | BigNumber | string': function (size) {
      var last = size[size.length - 1];
      if (typeof last === 'string') {
        var format = size.pop();
        return _zeros(size, format);
      }
      else if (config.matrix === 'Array') {
        return _zeros(size);
      }
      else {
        return _zeros(size, 'default');
      }
    },

    'Array': _zeros,

    'Matrix': function (size) {
      var format = size.storage();
      return _zeros(size.valueOf(), format);
    },

    'Array | Matrix, string': function (size, format) {
      return _zeros (size.valueOf(), format);
    }
  });

  zeros.toTex = undefined; // use default template

  return zeros;

  /**
   * Create an Array or Matrix with zeros
   * @param {Array} size
   * @param {string} [format='default']
   * @return {Array | Matrix}
   * @private
   */
  function _zeros(size, format) {
    var hasBigNumbers = _normalize(size);
    var defaultValue = hasBigNumbers ? new type.BigNumber(0) : 0;
    _validate(size);

    if (format) {
      // return a matrix
      var m = matrix(format);
      if (size.length > 0) {
        return m.resize(size, defaultValue);
      }
      return m;
    }
    else {
      // return an Array
      var arr = [];
      if (size.length > 0) {
        return resize(arr, size, defaultValue);
      }
      return arr;
    }
  }

  // replace BigNumbers with numbers, returns true if size contained BigNumbers
  function _normalize(size) {
    var hasBigNumbers = false;
    size.forEach(function (value, index, arr) {
      if (value && value.isBigNumber === true) {
        hasBigNumbers = true;
        arr[index] = value.toNumber();
      }
    });
    return hasBigNumbers;
  }

  // validate arguments
  function _validate (size) {
    size.forEach(function (value) {
      if (typeof value !== 'number' || !isInteger(value) || value < 0) {
        throw new Error('Parameters in function zeros must be positive integers');
      }
    });
  }
}

// TODO: zeros contains almost the same code as ones. Reuse this?

exports.name = 'zeros';
exports.factory = factory;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(90);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(undefined);
// imports


// module
exports.push([module.i, "* {\n margin: 0;\n padding: 0;\n box-sizing: border-box;\n}\n\nhtml, body {\n    margin: 0;\n    padding: 0;\n    font-family: sans-serif;\n    height: 100%;\n    width: 100%;\n}\n\n\ncanvas {\n    align-self: flex-start;\n    padding: 0;\n    margin: 0;\n    border: 1px solid black;\n    display: block;\n    background-color: rgba(220, 220, 220, 1);\n}\n\nnav {\n  width: 80px;\n  background-color: rgba(200, 200, 200, 1);\n}\n\nnav li {\n  text-align: center;\n  font-size: 2rem;\n  border: 4px solid black;\n  border-radius: 0.5rem;\n  padding: 1rem;\n}\n\n.hidden {\n  /*\n  display: none;\n  */\n}\n\n.wrapper {\n  height: 100%;\n  display: flex;\n}\n\n.page-1 {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: space-between;\n}\n\n.col1, .col2 {\n  display: flex;\n  justify-content: space-between;\n  flex-direction: column;\n}\n\n.col1 {\n  width:100%;\n}\n\n.col2 {\n  width: 400px;\n }\n\n\n.button {\n  width: 0.1px;\n  height: 0.1px;\n  opacity: 0;\n  overflow: hidden;\n  z-index: -1;\n}\n.button + label, .label {\n  font-size: 30px;\n  display: inline-block;\n  border: 2px solid black;\n  padding: 10px;\n  background-color: rgba(255, 255, 255, 1.0);\n  color: black;\n  text-decoration: none;\n}\n.button + label, .label{\n  cursor:pointer;\n}\n.button + label:hover, .label:hover{\n  background-color: rgba(240, 220, 200, 1);\n}\n\n#img-preview {\n  min-height: 300px;\n  min-width: 300px;\n  border: 2px solid black;\n}\n\n.edit-bar {\n}\n\n.nav {\n  font-size: 30px;\n  width: 80px;\n  height: 80px;\n  display: inline-block;\n  border: 2px solid black;\n  padding: 10px;\n  background-color: rgba(255, 255, 255, 1.0);\n  color: black;\n  text-decoration: none;\n  cursor:pointer;\n}\n\n.nav:hover {\n  background-color: rgba(240, 220, 200, 1);\n}\n", ""]);

// exports


/***/ }),
/* 91 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(93);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./tag-tables.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./tag-tables.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(undefined);
// imports


// module
exports.push([module.i, "#tag-tables,  #tag-tables tr, #tag-tables td {\n  width: 400px;\n  font-family: monospace;\n  text-align: center;\n  border-collapse: collapse;\n  border: 1px solid black;\n}\n\n#tag-tables thead {\n  display: block;\n}\n\n#tag-tables tbody {\n  display: block;\n  height: 465px;\n  max-height: 465px;\n  overflow-y:scroll;\n}\n\n#tag-tables tr:hover {\n  background-color: rgba(200, 200, 200, 1);\n}\n#tag-tables td .editable {\n  text-decoration: underline; \n}\n#tag-tables table a {\n  text-align: center;\n  color: red;\n  text-decoration: underline;\n}\n#tag-tables table a:hover {\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(95);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./export-table.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./export-table.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(undefined);
// imports


// module
exports.push([module.i, ".page-2 {\n  text-align: center;\n  width: 100%;\n}\n\n.export-table {\n  margin: 0 auto;\n  width: 1000px;\n  border: 1px solid black;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n.export-table .component {\n  max-width: 450px;\n  width: 450px;\n  border: 2px solid black;\n  border-collapse: collapse;\n  display: flex;\n}\n\n.export-table .component .col {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  padding: 5px;\n}\n\n.page-break {\n  height: 50px;\n  width: 100%;\n  break-after: always;\n}\n", ""]);

// exports


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(97);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./vex.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./vex.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(undefined);
// imports


// module
exports.push([module.i, "@keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-webkit-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-moz-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-ms-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-o-keyframes vex-fadein {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-webkit-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-moz-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-ms-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-o-keyframes vex-fadeout {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-webkit-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-moz-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-ms-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n@-o-keyframes vex-rotation {\n  0% {\n    transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -ms-transform: rotate(0deg);\n    -o-transform: rotate(0deg); }\n  100% {\n    transform: rotate(359deg);\n    -webkit-transform: rotate(359deg);\n    -moz-transform: rotate(359deg);\n    -ms-transform: rotate(359deg);\n    -o-transform: rotate(359deg); } }\n\n.vex, .vex *, .vex *:before, .vex *:after {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n\n.vex {\n  position: fixed;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  z-index: 1111;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n\n.vex-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n.vex-overlay {\n  background: #000;\n  filter: alpha(opacity=40);\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=40)\"; }\n\n.vex-overlay {\n  animation: vex-fadein 0.5s;\n  -webkit-animation: vex-fadein 0.5s;\n  -moz-animation: vex-fadein 0.5s;\n  -ms-animation: vex-fadein 0.5s;\n  -o-animation: vex-fadein 0.5s;\n  -webkit-backface-visibility: hidden;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.4);\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n  .vex.vex-closing .vex-overlay {\n    animation: vex-fadeout 0.5s;\n    -webkit-animation: vex-fadeout 0.5s;\n    -moz-animation: vex-fadeout 0.5s;\n    -ms-animation: vex-fadeout 0.5s;\n    -o-animation: vex-fadeout 0.5s;\n    -webkit-backface-visibility: hidden; }\n\n.vex-content {\n  animation: vex-fadein 0.5s;\n  -webkit-animation: vex-fadein 0.5s;\n  -moz-animation: vex-fadein 0.5s;\n  -ms-animation: vex-fadein 0.5s;\n  -o-animation: vex-fadein 0.5s;\n  -webkit-backface-visibility: hidden;\n  background: #fff; }\n  .vex.vex-closing .vex-content {\n    animation: vex-fadeout 0.5s;\n    -webkit-animation: vex-fadeout 0.5s;\n    -moz-animation: vex-fadeout 0.5s;\n    -ms-animation: vex-fadeout 0.5s;\n    -o-animation: vex-fadeout 0.5s;\n    -webkit-backface-visibility: hidden; }\n\n.vex-close:before {\n  font-family: Arial, sans-serif;\n  content: \"\\D7\"; }\n\n.vex-dialog-form {\n  margin: 0; }\n\n.vex-dialog-button {\n  text-rendering: optimizeLegibility;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent; }\n\n.vex-loading-spinner {\n  animation: vex-rotation 0.7s linear infinite;\n  -webkit-animation: vex-rotation 0.7s linear infinite;\n  -moz-animation: vex-rotation 0.7s linear infinite;\n  -ms-animation: vex-rotation 0.7s linear infinite;\n  -o-animation: vex-rotation 0.7s linear infinite;\n  -webkit-backface-visibility: hidden;\n  -moz-box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);\n  -webkit-box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);\n  box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);\n  position: fixed;\n  z-index: 1112;\n  margin: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  height: 2em;\n  width: 2em;\n  background: #fff; }\n\nbody.vex-open {\n  overflow: hidden; }\n", ""]);

// exports


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(99);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(12)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./vex-theme-flat-attack.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./vex-theme-flat-attack.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)(undefined);
// imports


// module
exports.push([module.i, "@keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-webkit-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-moz-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-ms-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@-o-keyframes vex-flipin-horizontal {\n  0% {\n    opacity: 0;\n    transform: rotateY(-90deg);\n    -webkit-transform: rotateY(-90deg);\n    -moz-transform: rotateY(-90deg);\n    -ms-transform: rotateY(-90deg);\n    -o-transform: rotateY(-90deg); }\n  100% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); } }\n\n@keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-webkit-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-moz-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-ms-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n@-o-keyframes vex-flipout-horizontal {\n  0% {\n    opacity: 1;\n    transform: rotateY(0deg);\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -ms-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg); }\n  100% {\n    opacity: 0;\n    transform: rotateY(90deg);\n    -webkit-transform: rotateY(90deg);\n    -moz-transform: rotateY(90deg);\n    -ms-transform: rotateY(90deg);\n    -o-transform: rotateY(90deg); } }\n\n.vex.vex-theme-flat-attack {\n  -moz-perspective: 1300px;\n  -webkit-perspective: 1300px;\n  perspective: 1300px;\n  -moz-perspective-origin: 50% 150px;\n  -webkit-perspective-origin: 50% 150px;\n  perspective-origin: 50% 150px;\n  padding-top: 100px;\n  padding-bottom: 100px;\n  font-size: 1.5em; }\n  .vex.vex-theme-flat-attack.vex-closing .vex-content {\n    animation: vex-flipout-horizontal 0.5s;\n    -webkit-animation: vex-flipout-horizontal 0.5s;\n    -moz-animation: vex-flipout-horizontal 0.5s;\n    -ms-animation: vex-flipout-horizontal 0.5s;\n    -o-animation: vex-flipout-horizontal 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-flat-attack .vex-content {\n    -webkit-transform-style: preserve-3d;\n    -moz-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    animation: vex-flipin-horizontal 0.5s;\n    -webkit-animation: vex-flipin-horizontal 0.5s;\n    -moz-animation: vex-flipin-horizontal 0.5s;\n    -ms-animation: vex-flipin-horizontal 0.5s;\n    -o-animation: vex-flipin-horizontal 0.5s;\n    -webkit-backface-visibility: hidden; }\n  .vex.vex-theme-flat-attack .vex-content {\n    font-family: \"Helvetica Neue\", sans-serif;\n    font-weight: 200;\n    background: #fff;\n    color: #444;\n    padding: 2em 2em 3em 2em;\n    line-height: 1.5em;\n    position: relative;\n    margin: 0 auto;\n    max-width: 100%;\n    width: 600px; }\n    .vex.vex-theme-flat-attack .vex-content h1, .vex.vex-theme-flat-attack .vex-content h2, .vex.vex-theme-flat-attack .vex-content h3, .vex.vex-theme-flat-attack .vex-content h4, .vex.vex-theme-flat-attack .vex-content h5, .vex.vex-theme-flat-attack .vex-content h6, .vex.vex-theme-flat-attack .vex-content p, .vex.vex-theme-flat-attack .vex-content ul, .vex.vex-theme-flat-attack .vex-content li {\n      color: inherit; }\n  .vex.vex-theme-flat-attack .vex-close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    cursor: pointer; }\n    .vex.vex-theme-flat-attack .vex-close:before {\n      font-family: \"Helvetica Neue\", sans-serif;\n      font-weight: 100;\n      line-height: 1px;\n      padding-top: .5em;\n      display: block;\n      font-size: 2em;\n      text-indent: 1px;\n      overflow: hidden;\n      height: 1.25em;\n      width: 1.25em;\n      text-align: center;\n      top: 0;\n      right: 0;\n      color: #fff;\n      background: #666; }\n  .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-message {\n    margin-bottom: .5em; }\n  .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input {\n    margin-bottom: .5em; }\n    .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input textarea, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"date\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"email\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"month\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"number\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"password\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"search\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"tel\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"text\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"time\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"url\"], .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"week\"] {\n      -moz-border-radius: 3px;\n      -webkit-border-radius: 3px;\n      border-radius: 3px;\n      background: #f0f0f0;\n      width: 100%;\n      padding: .25em .67em;\n      border: 0;\n      font-family: inherit;\n      font-weight: inherit;\n      font-size: inherit;\n      min-height: 2.5em;\n      margin: 0 0 .25em; }\n      .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n        -moz-box-shadow: inset 0 0 0 2px #666;\n        -webkit-box-shadow: inset 0 0 0 2px #666;\n        box-shadow: inset 0 0 0 2px #666;\n        outline: none; }\n  .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-buttons {\n    *zoom: 1;\n    padding-top: 1em;\n    margin-bottom: -3em;\n    margin-left: -2em;\n    margin-right: -2em; }\n    .vex.vex-theme-flat-attack .vex-dialog-form .vex-dialog-buttons:after {\n      content: \"\";\n      display: table;\n      clear: both; }\n  .vex.vex-theme-flat-attack .vex-dialog-button {\n    -moz-border-radius: 0;\n    -webkit-border-radius: 0;\n    border-radius: 0;\n    border: 0;\n    margin: 0;\n    float: right;\n    padding: .5em 1em;\n    font-size: 1.13em;\n    text-transform: uppercase;\n    font-weight: 200;\n    letter-spacing: .1em;\n    line-height: 1em;\n    font-family: inherit; }\n    .vex.vex-theme-flat-attack .vex-dialog-button.vex-last {\n      margin-left: 0; }\n    .vex.vex-theme-flat-attack .vex-dialog-button:focus {\n      outline: none; }\n    .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-primary {\n      background: #666;\n      color: #fff; }\n      .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-primary:focus {\n        -moz-box-shadow: inset 0 3px rgba(0, 0, 0, 0.2);\n        -webkit-box-shadow: inset 0 3px rgba(0, 0, 0, 0.2);\n        box-shadow: inset 0 3px rgba(0, 0, 0, 0.2); }\n    .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary {\n      background: #fff;\n      color: #ccc; }\n      .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary:focus {\n        -moz-box-shadow: inset 0 3px #aaa;\n        -webkit-box-shadow: inset 0 3px #aaa;\n        box-shadow: inset 0 3px #aaa;\n        background: #eee;\n        color: #777; }\n      .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary:hover, .vex.vex-theme-flat-attack .vex-dialog-button.vex-dialog-button-secondary:active {\n        color: #777; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-close:before {\n    background: #ff7ea7; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #ff7ea7;\n    -webkit-box-shadow: inset 0 0 0 2px #ff7ea7;\n    box-shadow: inset 0 0 0 2px #ff7ea7; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-pink .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #ff7ea7; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-close:before {\n    background: #ce4a55; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #ce4a55;\n    -webkit-box-shadow: inset 0 0 0 2px #ce4a55;\n    box-shadow: inset 0 0 0 2px #ce4a55; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-red .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #ce4a55; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-close:before {\n    background: #34b989; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #34b989;\n    -webkit-box-shadow: inset 0 0 0 2px #34b989;\n    box-shadow: inset 0 0 0 2px #34b989; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-green .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #34b989; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-close:before {\n    background: #477FA5; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input textarea:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"date\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"datetime\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"datetime-local\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"email\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"month\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"number\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"password\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"search\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"tel\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"text\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"time\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"url\"]:focus, .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-input input[type=\"week\"]:focus {\n    -moz-box-shadow: inset 0 0 0 2px #477FA5;\n    -webkit-box-shadow: inset 0 0 0 2px #477FA5;\n    box-shadow: inset 0 0 0 2px #477FA5; }\n  .vex.vex-theme-flat-attack.vex-theme-flat-attack-blue .vex-dialog-form .vex-dialog-buttons .vex-dialog-button.vex-dialog-button-primary {\n    background: #477FA5; }\n\n.vex-loading-spinner.vex-theme-flat-attack {\n  height: 4em;\n  width: 4em; }\n", ""]);

// exports


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vex = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

/* Copied from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */

if ("document" in window.self) {

  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_"))
    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

  (function (view) {

    "use strict";

    if (!('Element' in view)) return;

    var
        classListProp = "classList"
      , protoProp = "prototype"
      , elemCtrProto = view.Element[protoProp]
      , objCtr = Object
      , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
      }
      , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
            i = 0
          , len = this.length
        ;
        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      }
      // Vendors: please allow content code to instantiate DOMExceptions
      , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      }
      , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
          throw new DOMEx(
              "SYNTAX_ERR"
            , "An invalid or illegal string was specified"
          );
        }
        if (/\s/.test(token)) {
          throw new DOMEx(
              "INVALID_CHARACTER_ERR"
            , "String contains an invalid character"
          );
        }
        return arrIndexOf.call(classList, token);
      }
      , ClassList = function (elem) {
        var
            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
          , i = 0
          , len = classes.length
        ;
        for (; i < len; i++) {
          this.push(classes[i]);
        }
        this._updateClassName = function () {
          elem.setAttribute("class", this.toString());
        };
      }
      , classListProto = ClassList[protoProp] = []
      , classListGetter = function () {
        return new ClassList(this);
      }
    ;
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function (i) {
      return this[i] || null;
    };
    classListProto.contains = function (token) {
      token += "";
      return checkTokenAndGetIndex(this, token) !== -1;
    };
    classListProto.add = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
      ;
      do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
          this.push(token);
          updated = true;
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.remove = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
        , index
      ;
      do {
        token = tokens[i] + "";
        index = checkTokenAndGetIndex(this, token);
        while (index !== -1) {
          this.splice(index, 1);
          updated = true;
          index = checkTokenAndGetIndex(this, token);
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.toggle = function (token, force) {
      token += "";

      var
          result = this.contains(token)
        , method = result ?
          force !== true && "remove"
        :
          force !== false && "add"
      ;

      if (method) {
        this[method](token);
      }

      if (force === true || force === false) {
        return force;
      } else {
        return !result;
      }
    };
    classListProto.toString = function () {
      return this.join(" ");
    };

    if (objCtr.defineProperty) {
      var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
      };
      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
      }
    } else if (objCtr[protoProp].__defineGetter__) {
      elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }

    }(window.self));

    } else {
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    (function () {
      "use strict";

      var testElement = document.createElement("_");

      testElement.classList.add("c1", "c2");

      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if (!testElement.classList.contains("c2")) {
        var createMethod = function(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function(token) {
            var i, len = arguments.length;

            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle("c3", false);

      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function(token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };

      }

      testElement = null;
    }());
  }
}

},{}],2:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],3:[function(require,module,exports){
/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

'use strict';

function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

module.exports = {
  assign: assign,
  polyfill: polyfill
};

},{}],4:[function(require,module,exports){
// classList polyfill for old browsers
require('classlist-polyfill')
// Object.assign polyfill
require('es6-object-assign').polyfill()

// String to DOM function
var domify = require('domify')

// Use the DOM's HTML parsing to escape any dangerous strings
var escapeHtml = function escapeHtml (str) {
  if (typeof str !== 'undefined') {
    var div = document.createElement('div')
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  } else {
    return ''
  }
}

// Utility function to add space-delimited class strings to a DOM element's classList
var addClasses = function addClasses (el, classStr) {
  if (typeof classStr !== 'string' || classStr.length === 0) {
    return
  }
  var classes = classStr.split(' ')
  for (var i = 0; i < classes.length; i++) {
    var className = classes[i]
    if (className.length) {
      el.classList.add(className)
    }
  }
}

// Detect CSS Animation End Support
// https://github.com/limonte/sweetalert2/blob/99bd539f85e15ac170f69d35001d12e092ef0054/src/utils/dom.js#L194
var animationEndEvent = (function detectAnimationEndEvent () {
  var el = document.createElement('div')
  var eventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'animationend',
    'OAnimation': 'oanimationend',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  }
  for (var i in eventNames) {
    if (el.style[i] !== undefined) {
      return eventNames[i]
    }
  }
  return false
})()

// vex base CSS classes
var baseClassNames = {
  vex: 'vex',
  content: 'vex-content',
  overlay: 'vex-overlay',
  close: 'vex-close',
  closing: 'vex-closing',
  open: 'vex-open'
}

// Private lookup table of all open vex objects, keyed by id
var vexes = {}
var globalId = 1

// Private boolean to assist the escapeButtonCloses option
var isEscapeActive = false

// vex itself is an object that exposes a simple API to open and close vex objects in various ways
var vex = {
  open: function open (opts) {
    // Check for usage of deprecated options, and log a warning
    var warnDeprecated = function warnDeprecated (prop) {
      console.warn('The "' + prop + '" property is deprecated in vex 3. Use CSS classes and the appropriate "ClassName" options, instead.')
      console.warn('See http://github.hubspot.com/vex/api/advanced/#options')
    }
    if (opts.css) {
      warnDeprecated('css')
    }
    if (opts.overlayCSS) {
      warnDeprecated('overlayCSS')
    }
    if (opts.contentCSS) {
      warnDeprecated('contentCSS')
    }
    if (opts.closeCSS) {
      warnDeprecated('closeCSS')
    }

    // The dialog instance
    var vexInstance = {}

    // Set id
    vexInstance.id = globalId++

    // Store internally
    vexes[vexInstance.id] = vexInstance

    // Set state
    vexInstance.isOpen = true

    // Close function on the vex instance
    // This is how all API functions should close individual vexes
    vexInstance.close = function instanceClose () {
      // Check state
      if (!this.isOpen) {
        return true
      }

      var options = this.options

      // escapeButtonCloses is checked first
      if (isEscapeActive && !options.escapeButtonCloses) {
        return false
      }

      // Allow the user to validate any info or abort the close with the beforeClose callback
      var shouldClose = (function shouldClose () {
        // Call before close callback
        if (options.beforeClose) {
          return options.beforeClose.call(this)
        }
        // Otherwise indicate that it's ok to continue with close
        return true
      }.bind(this)())

      // If beforeClose() fails, abort the close
      if (shouldClose === false) {
        return false
      }

      // Update state
      this.isOpen = false

      // Detect if the content el has any CSS animations defined
      var style = window.getComputedStyle(this.contentEl)
      function hasAnimationPre (prefix) {
        return style.getPropertyValue(prefix + 'animation-name') !== 'none' && style.getPropertyValue(prefix + 'animation-duration') !== '0s'
      }
      var hasAnimation = hasAnimationPre('') || hasAnimationPre('-webkit-') || hasAnimationPre('-moz-') || hasAnimationPre('-o-')

      // Define the function that will actually close the instance
      var close = function close () {
        if (!this.rootEl.parentNode) {
          return
        }
        // Run once
        this.rootEl.removeEventListener(animationEndEvent, close)
        this.overlayEl.removeEventListener(animationEndEvent, close)
        // Remove from lookup table (prevent memory leaks)
        delete vexes[this.id]
        // Remove the dialog from the DOM
        this.rootEl.parentNode.removeChild(this.rootEl)
        // Remove the overlay from the DOM
        this.bodyEl.removeChild(this.overlayEl);
        // Call after close callback
        if (options.afterClose) {
          options.afterClose.call(this)
        }
        // Remove styling from the body, if no more vexes are open
        if (Object.keys(vexes).length === 0) {
          document.body.classList.remove(baseClassNames.open)
        }
      }.bind(this)

      // Close the vex
      if (animationEndEvent && hasAnimation) {
        // Setup the end event listener, to remove the el from the DOM
        this.rootEl.addEventListener(animationEndEvent, close)
        this.overlayEl.addEventListener(animationEndEvent, close)
        // Add the closing class to the dialog, showing the close animation
        this.rootEl.classList.add(baseClassNames.closing)
        this.overlayEl.classList.add(baseClassNames.closing)
      } else {
        close()
      }

      return true
    }

    // Allow strings as content
    if (typeof opts === 'string') {
      opts = {
        content: opts
      }
    }

    // `content` is unsafe internally, so translate
    // safe default: HTML-escape the content before passing it through
    if (opts.unsafeContent && !opts.content) {
      opts.content = opts.unsafeContent
    } else if (opts.content) {
      opts.content = escapeHtml(opts.content)
    }

    // Store options on instance for future reference
    var options = vexInstance.options = Object.assign({}, vex.defaultOptions, opts)

    // Get Body Element
    var bodyEl = vexInstance.bodyEl = document.getElementsByTagName('body')[0];

    // vex root
    var rootEl = vexInstance.rootEl = document.createElement('div')
    rootEl.classList.add(baseClassNames.vex)
    addClasses(rootEl, options.className)

    // Overlay
    var overlayEl = vexInstance.overlayEl = document.createElement('div')
    overlayEl.classList.add(baseClassNames.overlay)
    addClasses(overlayEl, options.overlayClassName)
    if (options.overlayClosesOnClick) {
      rootEl.addEventListener('click', function overlayClickListener (e) {
        if (e.target === rootEl) {
          vexInstance.close()
        }
      })
    }
    bodyEl.appendChild(overlayEl)

    // Content
    var contentEl = vexInstance.contentEl = document.createElement('div')
    contentEl.classList.add(baseClassNames.content)
    addClasses(contentEl, options.contentClassName)
    contentEl.appendChild(options.content instanceof window.Node ? options.content : domify(options.content))
    rootEl.appendChild(contentEl)

    // Close button
    if (options.showCloseButton) {
      var closeEl = vexInstance.closeEl = document.createElement('div')
      closeEl.classList.add(baseClassNames.close)
      addClasses(closeEl, options.closeClassName)
      closeEl.addEventListener('click', vexInstance.close.bind(vexInstance))
      contentEl.appendChild(closeEl)
    }

    // Add to DOM
    document.querySelector(options.appendLocation).appendChild(rootEl)

    // Call after open callback
    if (options.afterOpen) {
      options.afterOpen.call(vexInstance)
    }

    // Apply styling to the body
    document.body.classList.add(baseClassNames.open)

    // Return the created vex instance
    return vexInstance
  },

  // A top-level vex.close function to close dialogs by reference or id
  close: function close (vexOrId) {
    var id
    if (vexOrId.id) {
      id = vexOrId.id
    } else if (typeof vexOrId === 'string') {
      id = vexOrId
    } else {
      throw new TypeError('close requires a vex object or id string')
    }
    if (!vexes[id]) {
      return false
    }
    return vexes[id].close()
  },

  // Close the most recently created/opened vex
  closeTop: function closeTop () {
    var ids = Object.keys(vexes)
    if (!ids.length) {
      return false
    }
    return vexes[ids[ids.length - 1]].close()
  },

  // Close every vex!
  closeAll: function closeAll () {
    for (var id in vexes) {
      this.close(id)
    }
    return true
  },

  // A getter for the internal lookup table
  getAll: function getAll () {
    return vexes
  },

  // A getter for the internal lookup table
  getById: function getById (id) {
    return vexes[id]
  }
}

// Close top vex on escape
window.addEventListener('keyup', function vexKeyupListener (e) {
  if (e.keyCode === 27) {
    isEscapeActive = true
    vex.closeTop()
    isEscapeActive = false
  }
})

// Close all vexes on history pop state (useful in single page apps)
window.addEventListener('popstate', function () {
  if (vex.defaultOptions.closeAllOnPopState) {
    vex.closeAll()
  }
})

vex.defaultOptions = {
  content: '',
  showCloseButton: true,
  escapeButtonCloses: true,
  overlayClosesOnClick: true,
  appendLocation: 'body',
  className: '',
  overlayClassName: '',
  contentClassName: '',
  closeClassName: '',
  closeAllOnPopState: true
}

// TODO Loading symbols?

// Include escapeHtml function on the library object
Object.defineProperty(vex, '_escapeHtml', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: escapeHtml
})

// Plugin system!
vex.registerPlugin = function registerPlugin (pluginFn, name) {
  var plugin = pluginFn(vex)
  var pluginName = name || plugin.name
  if (vex[pluginName]) {
    throw new Error('Plugin ' + name + ' is already registered.')
  }
  vex[pluginName] = plugin
}

module.exports = vex

},{"classlist-polyfill":1,"domify":2,"es6-object-assign":3}]},{},[4])(4)
});

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.vexDialog = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],2:[function(require,module,exports){
// get successful control from form and assemble into object
// http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

// types which indicate a submit action and are not successful controls
// these will be ignored
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

// serializes form fields
// @param form MUST be an HTMLForm element
// @param options is an optional argument to configure the serialization. Default output
// with no options specified is a url encoded string
//    - hash: [true | false] Configure the output type. If true, the output will
//    be a js object.
//    - serializer: [function] Optional serializer function to override the default one.
//    The function takes 3 arguments (result, key, value) and should return new result
//    hash and url encoded str serializers are provided with this module
//    - disabled: [true | false]. If true serialize disabled fields.
//    - empty: [true | false]. If true serialize empty fields
function serialize(form, options) {
    if (typeof options != 'object') {
        options = { hash: !!options };
    }
    else if (options.hash === undefined) {
        options.hash = true;
    }

    var result = (options.hash) ? {} : '';
    var serializer = options.serializer || ((options.hash) ? hash_serializer : str_serialize);

    var elements = form && form.elements ? form.elements : [];

    //Object store each radio and set if it's empty or not
    var radio_store = Object.create(null);

    for (var i=0 ; i<elements.length ; ++i) {
        var element = elements[i];

        // ingore disabled fields
        if ((!options.disabled && element.disabled) || !element.name) {
            continue;
        }
        // ignore anyhting that is not considered a success field
        if (!k_r_success_contrls.test(element.nodeName) ||
            k_r_submitter.test(element.type)) {
            continue;
        }

        var key = element.name;
        var val = element.value;

        // we can't just use element.value for checkboxes cause some browsers lie to us
        // they say "on" for value when the box isn't checked
        if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
            val = undefined;
        }

        // If we want empty elements
        if (options.empty) {
            // for checkbox
            if (element.type === 'checkbox' && !element.checked) {
                val = '';
            }

            // for radio
            if (element.type === 'radio') {
                if (!radio_store[element.name] && !element.checked) {
                    radio_store[element.name] = false;
                }
                else if (element.checked) {
                    radio_store[element.name] = true;
                }
            }

            // if options empty is true, continue only if its radio
            if (!val && element.type == 'radio') {
                continue;
            }
        }
        else {
            // value-less fields are ignored unless options.empty is true
            if (!val) {
                continue;
            }
        }

        // multi select boxes
        if (element.type === 'select-multiple') {
            val = [];

            var selectOptions = element.options;
            var isSelectedOptions = false;
            for (var j=0 ; j<selectOptions.length ; ++j) {
                var option = selectOptions[j];
                var allowedEmpty = options.empty && !option.value;
                var hasValue = (option.value || allowedEmpty);
                if (option.selected && hasValue) {
                    isSelectedOptions = true;

                    // If using a hash serializer be sure to add the
                    // correct notation for an array in the multi-select
                    // context. Here the name attribute on the select element
                    // might be missing the trailing bracket pair. Both names
                    // "foo" and "foo[]" should be arrays.
                    if (options.hash && key.slice(key.length - 2) !== '[]') {
                        result = serializer(result, key + '[]', option.value);
                    }
                    else {
                        result = serializer(result, key, option.value);
                    }
                }
            }

            // Serialize if no selected options and options.empty is true
            if (!isSelectedOptions && options.empty) {
                result = serializer(result, key, '');
            }

            continue;
        }

        result = serializer(result, key, val);
    }

    // Check for all empty radio buttons and serialize them with key=""
    if (options.empty) {
        for (var key in radio_store) {
            if (!radio_store[key]) {
                result = serializer(result, key, '');
            }
        }
    }

    return result;
}

function parse_keys(string) {
    var keys = [];
    var prefix = /^([^\[\]]*)/;
    var children = new RegExp(brackets);
    var match = prefix.exec(string);

    if (match[1]) {
        keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

function hash_assign(result, keys, value) {
    if (keys.length === 0) {
        result = value;
        return result;
    }

    var key = keys.shift();
    var between = key.match(/^\[(.+?)\]$/);

    if (key === '[]') {
        result = result || [];

        if (Array.isArray(result)) {
            result.push(hash_assign(null, keys, value));
        }
        else {
            // This might be the result of bad name attributes like "[][foo]",
            // in this case the original `result` object will already be
            // assigned to an object literal. Rather than coerce the object to
            // an array, or cause an exception the attribute "_values" is
            // assigned as an array.
            result._values = result._values || [];
            result._values.push(hash_assign(null, keys, value));
        }

        return result;
    }

    // Key is an attribute name and can be assigned directly.
    if (!between) {
        result[key] = hash_assign(result[key], keys, value);
    }
    else {
        var string = between[1];
        // +var converts the variable into a number
        // better than parseInt because it doesn't truncate away trailing
        // letters and actually fails if whole thing is not a number
        var index = +string;

        // If the characters between the brackets is not a number it is an
        // attribute name and can be assigned directly.
        if (isNaN(index)) {
            result = result || {};
            result[string] = hash_assign(result[string], keys, value);
        }
        else {
            result = result || [];
            result[index] = hash_assign(result[index], keys, value);
        }
    }

    return result;
}

// Object/hash encoding serializer.
function hash_serializer(result, key, value) {
    var matches = key.match(brackets);

    // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.
    if (matches) {
        var keys = parse_keys(key);
        hash_assign(result, keys, value);
    }
    else {
        // Non bracket notation can make assignments directly.
        var existing = result[key];

        // If the value has been assigned already (for instance when a radio and
        // a checkbox have the same name attribute) convert the previous value
        // into an array before pushing into it.
        //
        // NOTE: If this requirement were removed all hash creation and
        // assignment could go through `hash_assign`.
        if (existing) {
            if (!Array.isArray(existing)) {
                result[key] = [ existing ];
            }

            result[key].push(value);
        }
        else {
            result[key] = value;
        }
    }

    return result;
}

// urlform encoding serializer
function str_serialize(result, key, value) {
    // encode newlines as \r\n cause the html spec says so
    value = value.replace(/(\r)?\n/g, '\r\n');
    value = encodeURIComponent(value);

    // spaces should be '+' rather than '%20'.
    value = value.replace(/%20/g, '+');
    return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}

module.exports = serialize;

},{}],3:[function(require,module,exports){
var domify = require('domify')
var serialize = require('form-serialize')

// Build DOM elements for the structure of the dialog
var buildDialogForm = function buildDialogForm (options) {
  var form = document.createElement('form')
  form.classList.add('vex-dialog-form')

  var message = document.createElement('div')
  message.classList.add('vex-dialog-message')
  message.appendChild(options.message instanceof window.Node ? options.message : domify(options.message))

  var input = document.createElement('div')
  input.classList.add('vex-dialog-input')
  input.appendChild(options.input instanceof window.Node ? options.input : domify(options.input))

  form.appendChild(message)
  form.appendChild(input)

  return form
}

// Take an array of buttons (see the default buttons below) and turn them into DOM elements
var buttonsToDOM = function buttonsToDOM (buttons) {
  var domButtons = document.createElement('div')
  domButtons.classList.add('vex-dialog-buttons')

  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i]
    var domButton = document.createElement('button')
    domButton.type = button.type
    domButton.textContent = button.text
    domButton.className = button.className
    domButton.classList.add('vex-dialog-button')
    if (i === 0) {
      domButton.classList.add('vex-first')
    } else if (i === buttons.length - 1) {
      domButton.classList.add('vex-last')
    }
    // Attach click listener to button with closure
    (function (button) {
      domButton.addEventListener('click', function (e) {
        if (button.click) {
          button.click.call(this, e)
        }
      }.bind(this))
    }.bind(this)(button))

    domButtons.appendChild(domButton)
  }

  return domButtons
}

var plugin = function plugin (vex) {
  // Define the API first
  var dialog = {
    // Plugin name
    name: 'dialog',

    // Open
    open: function open (opts) {
      var options = Object.assign({}, this.defaultOptions, opts)

      // `message` is unsafe internally, so translate
      // safe default: HTML-escape the message before passing it through
      if (options.unsafeMessage && !options.message) {
        options.message = options.unsafeMessage
      } else if (options.message) {
        options.message = vex._escapeHtml(options.message)
      }

      // Build the form from the options
      var form = options.unsafeContent = buildDialogForm(options)

      // Open the dialog
      var dialogInstance = vex.open(options)

      // Quick comment - these options and appending buttons and everything
      // would preferably be done _before_ opening the dialog. However, since
      // they rely on the context of the vex instance, we have to do them
      // after. A potential future fix would be to differentiate between
      // a "created" vex instance and an "opened" vex instance, so any actions
      // that rely on the specific context of the instance can do their stuff
      // before opening the dialog on the page.

      // Override the before close callback to also pass the value of the form
      var beforeClose = options.beforeClose && options.beforeClose.bind(dialogInstance)
      dialogInstance.options.beforeClose = function dialogBeforeClose () {
        // Only call the callback once - when the validation in beforeClose, if present, is true
        var shouldClose = beforeClose ? beforeClose() : true
        if (shouldClose) {
          options.callback(this.value || false)
        }
        // Return the result of beforeClose() to vex
        return shouldClose
      }.bind(dialogInstance)

      // Append buttons to form with correct context
      form.appendChild(buttonsToDOM.call(dialogInstance, options.buttons))

      // Attach form to instance
      dialogInstance.form = form

      // Add submit listener to form
      form.addEventListener('submit', options.onSubmit.bind(dialogInstance))

      // Optionally focus the first input in the form
      if (options.focusFirstInput) {
        var el = dialogInstance.contentEl.querySelector('button, input, select, textarea')
        if (el) {
          el.focus()
        }
      }

      // For chaining
      return dialogInstance
    },

    // Alert
    alert: function (options) {
      // Allow string as message
      if (typeof options === 'string') {
        options = {
          message: options
        }
      }
      options = Object.assign({}, this.defaultOptions, this.defaultAlertOptions, options)
      return this.open(options)
    },

    // Confirm
    confirm: function (options) {
      if (typeof options !== 'object' || typeof options.callback !== 'function') {
        throw new Error('dialog.confirm(options) requires options.callback.')
      }
      options = Object.assign({}, this.defaultOptions, this.defaultConfirmOptions, options)
      return this.open(options)
    },

    // Prompt
    prompt: function (options) {
      if (typeof options !== 'object' || typeof options.callback !== 'function') {
        throw new Error('dialog.prompt(options) requires options.callback.')
      }
      var defaults = Object.assign({}, this.defaultOptions, this.defaultPromptOptions)
      var dynamicDefaults = {
        unsafeMessage: '<label for="vex">' + vex._escapeHtml(options.label || defaults.label) + '</label>',
        input: '<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="' + vex._escapeHtml(options.placeholder || defaults.placeholder) + '" value="' + vex._escapeHtml(options.value || defaults.value) + '" />'
      }
      options = Object.assign(defaults, dynamicDefaults, options)
      // Pluck the value of the "vex" input field as the return value for prompt's callback
      // More closely mimics "window.prompt" in that a single string is returned
      var callback = options.callback
      options.callback = function promptCallback (value) {
        if (typeof value === 'object') {
          var keys = Object.keys(value)
          value = keys.length ? value[keys[0]] : ''
        }
        callback(value)
      }
      return this.open(options)
    }
  }

  // Now define any additional data that's not the direct dialog API
  dialog.buttons = {
    YES: {
      text: 'OK',
      type: 'submit',
      className: 'vex-dialog-button-primary',
      click: function yesClick () {
        this.value = true
      }
    },

    NO: {
      text: 'Cancel',
      type: 'button',
      className: 'vex-dialog-button-secondary',
      click: function noClick () {
        this.value = false
        this.close()
      }
    }
  }

  dialog.defaultOptions = {
    callback: function () {},
    afterOpen: function () {},
    message: '',
    input: '',
    buttons: [
      dialog.buttons.YES,
      dialog.buttons.NO
    ],
    showCloseButton: false,
    onSubmit: function onDialogSubmit (e) {
      e.preventDefault()
      if (this.options.input) {
        this.value = serialize(this.form, { hash: true })
      }
      return this.close()
    },
    focusFirstInput: true
  }

  dialog.defaultAlertOptions = {
    buttons: [
      dialog.buttons.YES
    ]
  }

  dialog.defaultPromptOptions = {
    label: 'Prompt:',
    placeholder: '',
    value: ''
  }

  dialog.defaultConfirmOptions = {}

  return dialog
}

module.exports = plugin

},{"domify":1,"form-serialize":2}]},{},[3])(3)
});

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var nativeImage = __webpack_require__(38).nativeImage
var types = ['image/png', 'image/jpg', 'image/jpeg']

module.exports = function canvasBuffer (canvas, type, quality) {
  type = type || 'image/png'
  quality = typeof quality === 'number' ? quality : 0.9
  if (types.indexOf(type) === -1) {
    throw new Error('unsupported image type ' + type)
  }

  var data = canvas.toDataURL(type, quality)
  var img = typeof nativeImage.createFromDataURL === 'function'
    ? nativeImage.createFromDataURL(data) // electron v0.36+
    : nativeImage.createFromDataUrl(data) // electron v0.30
  if (/^image\/jpe?g$/.test(type)) {
    return img.toJpeg(Math.floor(quality * 100))
  } else {
    return img.toPng()
  }
}


/***/ }),
/* 103 */
/***/ (function(module, exports) {

class Canvas {
  constructor(canvas, transform, globals_, image) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.transform = transform;
    this.image = image;
    this.globals_ = globals_;
    // Hardcoded draw_ratio value
    this.draw_ratio = 1;
  }

  draw_label(label, ctx=this.context, draw_ratio=1) {
    if (label.x !== null && label.y !== null) {
      this.draw_ratio = draw_ratio;
      let font_size = 60 / (draw_ratio);
      ctx.textAlign = 'center';
      ctx.font = `${font_size}px sans-serif`;
      const wid = ctx.measureText(label.title).width;
      const ht = font_size;
      if (label.defect === 0) { ctx.fillStyle = 'rgba(0, 200, 0, 0.8)'; }
      else if (label.defect === 1) { ctx.fillStyle = 'rgba(255, 200, 0, 0.9)'; }
      else { ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; }
      // Dictates minimum label width
      let l_w = (wid + 10/draw_ratio)
      let l_h = (ht + 10/draw_ratio)
      ctx.fillRect(label.x - l_w/2, 
                  label.y - l_h/2,
                  l_w,
                  l_h
                  );
      ctx.strokeRect(label.x - l_w/2,
                    label.y - l_h/2,
                    l_w,
                    l_h
                    );
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.textBaseline = 'middle';
      ctx.fillText(label.title, label.x, label.y);
    }
  }

  draw_overlay(c=this.canvas, ctx=this.context,
    text=`Building ${this.globals_.BUILDING} Level ${this.globals_.FLOOR}`) {
    // Clear the transform to draw the overlay

    let ht = c.height/20;
    let font_size = c.height/35;
    ctx.setTransform.apply(ctx, [1, 0, 0, 1, 0, 0]);
    ctx.fillStyle = 'rgba(220, 220, 220, 0.9)';
    ctx.fillRect(0, c.height-ht, c.width, ht);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.font = `${font_size}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    let textwidth = this.context.measureText(text).width;
    ctx.fillText(text, c.width/2,
                  c.height-ht/2);
    
    // Restore the previous transform
    this.context.restore();

  }

  draw_canvas() {
    this.context.clearRect(0, 0, 9999, 9999); // This code can break if image > 9999x9999
    this.context.setTransform.apply(this.context, this.transform);
    this.context.save();
    this.context.drawImage(this.image, 0, 0);
    this.draw_ratio = Math.min(3800/this.image.height, 4043/this.image.width);
    this.globals_.LABELS.map( (label) => {this.draw_label(label, this.context, this.draw_ratio); });
    this.draw_overlay();
  }

  pan_up(amt) {
    this.transform[5] += amt;
    this.draw_canvas();
  }

  pan_down(amt) {
    this.transform[5] -= 50;
    this.draw_canvas();
  }

  pan_left(amt) {
    this.transform[4] += 50;
    this.draw_canvas();
  }

  pan_right(amt) {
    this.transform[4] -= 50;
    this.draw_canvas();
  }

  zoom_in(amt) {
    this.transform[0] *= amt;
    this.transform[1] *= amt;
    this.transform[2] *= amt;
    this.transform[3] *= amt;
    this.draw_canvas();
  }

  zoom_out(amt) {
    this.transform[0] /= amt;
    this.transform[1] /= amt;
    this.transform[2] /= amt;
    this.transform[3] /= amt;
    this.draw_canvas();
  }

  handle_scroll(e) {
    e.deltaY < 0 ? this.zoom_in(1.03) : this.zoom_out(1.03);
    this.draw_canvas(); 
  }
}

module.exports = Canvas;


/***/ })
/******/ ]);