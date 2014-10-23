'use strict';

var Blind = require('../index');

var plainText = 'abcdefghijlkmno';
var key = 'kiSyAWnj9VDVIfI3u7zj';
var encryptedText = 'f+ElzhNFLVHKi/j/I6fu';

module.exports = function (n) {
  n.plan(7);

  n.equals(new Blind().decrypt(encryptedText, key), plainText, 'should decrypt an encrypted value');
  n.throws(function () { new Blind().decrypt(plainText, key); }, 'should reject an encrypted value and key that don\'t match');

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    t.throws(function () {
      var blind = new Blind();
      blind.binaryEncoding = 'xyz';
      blind.decrypt(encryptedText, key);
    }, 'should reject an invalid value');
  });

  n.test('property encryptAlgorithm', function (t) {
    t.plan(1);

    t.throws(function () {
      var blind = new Blind();
      blind.encryptAlgorithm = 'xyz';
      blind.decrypt(encryptedText, key);
    }, 'should reject an invalid value');
  });

  n.test('property maxDataLength', function (t) {
    t.plan(2);

    t.throws(function () {
      var blind = new Blind();
      blind.maxDataLength = 'xyz';
      blind.decrypt(encryptedText, key);
    }, 'should reject a non-number');

    t.throws(function () {
      var blind = new Blind();
      blind.encryptAlgorithm = 'xyz';
      blind.decrypt(encryptedText, key);
    }, 'should reject an out-of range number');
  });

  n.test('argument data', function (t) {
    t.plan(3);

    t.throws(function () { new Blind().decrypt(10, key); }, 'should reject a non-string');

    t.throws(function () {
      var blind = new Blind();
      blind.maxDataLength = 15;
      blind.decrypt(encryptedText + 'abcd', key);
    }, 'should reject a string that is too long');

    t.throws(function () { new Blind().decrypt(encryptedText + 'a', key); }, 'should reject a non-binary-encoded string');
  });

  n.test('argument key', function (t) {
    t.plan(2);

    t.throws(function () { new Blind().decrypt(encryptedText, 10); }, 'should reject a non-string');
    t.throws(function () { new Blind().decrypt(encryptedText, 'abcde'); }, 'should reject a non-binary-encoded string');
  });
};
