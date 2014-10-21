'use strict';

var assert = require('assert');

var is = require('../is');

module.exports = function (it) {
  it.describe('is', function (it) {

    it.describe('base64()', function (it) {

      it.should('accept a valid base64 value', function () {
        assert.isTrue(is.base64('wxyzWXYZ/+=='));
      });

      it.should('reject an invalid base64 value', function () {
        assert.isFalse(is.base64('wxyzWXYZ1234/+'));
      });
    });

    it.describe('hex()', function (it) {

      it.should('accept a valid hex value', function () {
        assert.isTrue(is.hex('abcd1234'));
      });

      it.should('reject an invalid hex value', function () {
        assert.isFalse(is.hex('wxyz1234'));
      });
    });
  });
};
