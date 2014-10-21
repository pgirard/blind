'use strict';

var assert = require('assert');

var Blind = require('../index');
var is = require('../is');

module.exports = function (it, shared) {
  it.describe('encrypt()', function (it) {

    it.should('encrypt a plaintext value', function () {
      return Blind.create().encrypt(shared.plainText, shared.randomValue).then(function (value) {
        shared.encryptedText = value;
        assert.isTrue(is.base64(value));
      });
    });

    it.describe('property binaryEncoding', function (it) {

      it.should('reject an invalid value', function () {
        var blind = Blind.create();
        blind.binaryEncoding = 'xyz';
        return blind.encrypt(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('property encryptAlgorithm', function (it) {

      it.should('reject an invalid value', function () {
        var blind = Blind.create();
        blind.encryptAlgorithm = 'xyz';
        return blind.encrypt(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('property maxDataLength', function (it) {

      it.should('reject a non-number', function () {
        var blind = Blind.create();
        blind.maxDataLength = 'xyz';
        return blind.encrypt(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject an out-of range number', function () {
        var blind = Blind.create();
        blind.maxDataLength = -1;
        return blind.encrypt(shared.plainText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('argument data', function (it) {

      it.should('reject a string that is too long', function () {
        var blind = Blind.create();
        blind.maxDataLength = 15;
        return blind.encrypt('abcdefghijklmnop', shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });
    });

    it.describe('argument key', function (it) {

      it.should('reject a non-string', function () {
        return Blind.create().encrypt(shared.plainText, 10).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject a non-binary-encoded string', function () {
        return Blind.create().encrypt(shared.plainText, 'abcde').catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });
    });
  });
};
