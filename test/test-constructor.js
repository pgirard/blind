'use strict';

var assert = require('assert');

var Blind = require('../index');

module.exports = function (it) {
  it.describe('constructor', function (it) {

    it.describe('option binaryEncoding', function (it) {

      it.should('accept a valid value', function () {
        assert.strictEqual(Blind.create({ binaryEncoding: 'hex' }).binaryEncoding, 'hex');
      });

      it.should('reject an invalid value', function () {
        assert.throws(function () { Blind.create({ binaryEncoding: 'xyz' }); }, RangeError);
      });
    });

    it.describe('option encryptAlgorithm', function (it) {

      it.should('accept a valid value', function () {
        assert.strictEqual(Blind.create({ encryptAlgorithm: 'aes-256-cbc' }).encryptAlgorithm, 'aes-256-cbc');
      });

      it.should('reject an invalid value', function () {
        assert.throws(function () { Blind.create({ encryptAlgorithm: 'xyz' }); }, RangeError);
      });
    });

    it.describe('option hashLength', function (it) {

      it.should('accept a valid value', function () {
        assert.strictEqual(Blind.create({ hashLength: 20 }).hashLength, 20);
      });

      it.should('reject a non-number', function () {
        assert.throws(function () { Blind.create({ hashLength: 'xyz' }); }, TypeError);
      });

      it.should('reject an out-of range number', function () {
        assert.throws(function () { Blind.create({ hashLength: -1 }); }, RangeError);
      });
    });

    it.describe('option hashRounds', function (it) {

      it.should('accept a valid value', function () {
        assert.strictEqual(Blind.create({ hashRounds: 20 }).hashRounds, 20);
      });

      it.should('reject a non-number', function () {
        assert.throws(function () { Blind.create({ hashRounds: 'xyz' }); }, TypeError);
      });

      it.should('reject an out-of range number', function () {
        assert.throws(function () { Blind.create({ hashRounds: -1 }); }, RangeError);
      });
    });

    it.describe('option maxDataLength', function (it) {

      it.should('accept a valid value', function () {
        assert.strictEqual(Blind.create({ maxDataLength: 8192 }).maxDataLength, 8192);
      });

      it.should('reject a non-number', function () {
        assert.throws(function () { Blind.create({ maxDataLength: 'xyz' }); }, TypeError);
      });

      it.should('reject an out-of range number', function () {
        assert.throws(function () { Blind.create({ maxDataLength: -1 }); }, RangeError);
      });
    });

    it.describe('option maxRandomLength', function (it) {

      it.should('accept a valid value', function () {
        assert.strictEqual(Blind.create({ maxRandomLength: 256 }).maxRandomLength, 256);
      });

      it.should('reject a non-number', function () {
        assert.throws(function () { Blind.create({ maxRandomLength: 'xyz' }); }, TypeError);
      });

      it.should('reject an out-of range number', function () {
        assert.throws(function () { Blind.create({ maxRandomLength: 6 }); }, RangeError);
      });
    });
  });
};
