'use strict';

var Blind = require('../index');

var plainText = 'abcdefghijlkmno';
var key = 'kiSyAWnj9VDVIfI3u7zj';
var encryptedText = 'H/YapTKT1fF6Jgz1chno';

module.exports = function (n) {
  n.plan(9);

  n.equals(new Blind().encrypt(plainText, key), encryptedText, 'should encrypt a plaintext value with argument key');
  n.equals(new Blind({ encryptKey: key }).encrypt(plainText), encryptedText, 'should encrypt a plaintext value with property encryptKey');
  n.throws(function () { new Blind().encrypt(plainText); }, 'should reject a missing key');

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    t.throws(function () {
      var blind = new Blind();
      blind.binaryEncoding = 'xyz';
      blind.encrypt(plainText, key);
    }, 'should reject an invalid value');
  });

  n.test('property encryptAlgorithm', function (t) {
    t.plan(1);

    t.throws(function () {
      var blind = new Blind();
      blind.encryptAlgorithm = 'xyz';
      blind.encrypt(plainText, key);
    }, 'should reject an invalid value');
  });

  n.test('property encryptKey', function (t) {
    t.plan(2);

    t.throws(function () {
      var blind = new Blind();
      blind.encryptKey = 10;
      blind.encrypt(plainText);
    }, 'should reject a non-string');

    t.throws(function () {
      var blind = new Blind();
      blind.encryptKey = 'abcde';
      blind.encrypt(plainText);
    }, 'should reject a non-binary-encoded string');
  });

  n.test('property maxDataLength', function (t) {
    t.plan(2);

    t.throws(function () {
      var blind = new Blind();
      blind.maxDataLength = 'xyz';
      blind.encrypt(plainText, key);
    }, 'should reject a non-number');

    t.throws(function () {
      var blind = new Blind();
      blind.encryptAlgorithm = 'xyz';
      blind.encrypt(plainText, key);
    }, 'should reject an out-of range number');
  });

  n.test('argument data', function (t) {
    t.plan(2);

    t.throws(function () { new Blind().encrypt(10, key); }, 'should reject a non-string');

    t.throws(function () {
      var blind = new Blind();
      blind.maxDataLength = 15;
      blind.encrypt('abcdefghijklmnop', key);
    }, 'should reject a string that is too long');
  });

  n.test('argument key', function (t) {
    t.plan(2);

    t.throws(function () { new Blind().encrypt(plainText, 10); }, 'should reject a non-string');
    t.throws(function () { new Blind().encrypt(plainText, 'abcde'); }, 'should reject a non-binary-encoded string');
  });
};
