'use strict';

var is = require('is');

var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;

is.base64 = function (value) {
  return is.string(value) && (!value.length || base64Regex.test(value));
};

is.hex = function (value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};

module.exports = is;
