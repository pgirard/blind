'use strict';

var assert = require('assert');

var Blind = require('../index');

module.exports = function (it, shared) {
  it.describe('decrypt()', function (it) {

    it.should('decrypt an encrypted value', function () {
      return Blind.create().decrypt(shared.encryptedText, shared.randomValue).then(function (value) {
        assert.strictEqual(value, shared.plainText);
      });
    });

    it.should('reject an encrypted value and key that don\'t match', function () {
      return Blind.create().decrypt(shared.encryptedText, shared.randomValue + 'abcd').catch(function (error) {
        assert.instanceOf(error, Error);
      });
    });

    it.describe('property binaryEncoding', function (it) {

      it.should('reject an invalid value', function () {
        var blind = Blind.create();
        blind.binaryEncoding = 'xyz';
        return blind.decrypt(shared.encryptedText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('property encryptAlgorithm', function (it) {

      it.should('reject an invalid value', function () {
        var blind = Blind.create();
        blind.encryptAlgorithm = 'xyz';
        return blind.decrypt(shared.encryptedText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('property maxDataLength', function (it) {

      it.should('reject a non-number', function () {
        var blind = Blind.create();
        blind.maxDataLength = 'xyz';
        return blind.decrypt(shared.encryptedText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject an out-of range number', function () {
        var blind = Blind.create();
        blind.maxDataLength = -1;
        return blind.decrypt(shared.encryptedText, shared.randomValue).catch(function (error) {
          assert.instanceOf(error, RangeError);
        });
      });
    });

    it.describe('argument data', function (it) {

      it.should('reject a string that is too long', function () {
        var blind = Blind.create();
        blind.maxDataLength = 15;
        return blind.decrypt(shared.encryptedText + 'abcd', shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject a non-binary-encoded string', function () {
        return Blind.create().decrypt(shared.encryptedText + 'a', shared.randomValue).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });
    });

    it.describe('argument key', function (it) {

      it.should('reject a non-string', function () {
        return Blind.create().decrypt(shared.encryptedText, 10).catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });

      it.should('reject a non-binary-encoded string', function () {
        return Blind.create().decrypt(shared.encryptedText, 'abcde').catch(function (error) {
          assert.instanceOf(error, TypeError);
        });
      });
    });
  });
};
