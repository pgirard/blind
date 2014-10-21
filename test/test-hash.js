'use strict';

var assert = require('assert');

var Blind = require('../index');
var is = require('../is');

module.exports = function (it, shared) {
  it.describe('hash()', function (it) {

    it.should('hash a value', function () {
      var blind = Blind.create();
      var length = Math.ceil(blind.hashLength * 4 / 3);
      return blind.hash(shared.plainText, shared.randomValue).then(function (value) {
        assert.isTrue(is.base64(value) && value.length === length);
      });
    });


    it.describe('property binaryEncoding', function (it) {

      it.should('reject an invalid value', function () {
        var blind = Blind.create();
        blind.binaryEncoding = 'xyz';
        return blind.hash(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('property hashLength', function (it) {

      it.should('reject a non-number', function () {
        var blind = Blind.create();
        blind.hashLength = 'xyz';
        return blind.hash(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject an out-of range number', function () {
        var blind = Blind.create();
        blind.hashLength = -1;
        return blind.hash(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('property hashRounds', function (it) {

      it.should('reject a non-number', function () {
        var blind = Blind.create();
        blind.hashRounds = 'xyz';
        return blind.hash(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject an out-of range number', function () {
        var blind = Blind.create();
        blind.hashRounds = -1;
        return blind.hash(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('property maxDataLength', function (it) {

      it.should('reject a non-number', function () {
        var blind = Blind.create();
        blind.maxDataLength = 'xyz';
        return blind.hash(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject an out-of range number', function () {
        var blind = Blind.create();
        blind.maxDataLength = -1;
        return blind.hash(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('argument data', function (it) {

      it.should('reject a string that is too long', function () {
        var blind = Blind.create();
        blind.maxDataLength = 15;
        return blind.hash('abcdefghijklmnop', shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });
    });

    it.describe('argument salt', function (it) {

      it.should('reject a non-string', function () {
        return Blind.create().hash(shared.plainText, 10).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject a non-binary-encoded string', function () {
        return Blind.create().hash(shared.plainText, 'abcde').catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });
    });
  });
};
