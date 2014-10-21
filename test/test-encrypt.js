'use strict';

var Blind = require('../index');

var plainText = 'abcdefghijlkmno';
var key = 'kiSyAWnj9VDVIfI3u7zj';
var encryptedText = 'f+ElzhNFLVHKi/j/I6fu';

module.exports = function (n) {
  n.plan(6);

  Blind.create().encrypt(plainText, key).then(function (value) {
    n.equal(value, encryptedText, 'should encrypt a plaintext value');
  });

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.binaryEncoding = 'xyz';
    blind.encrypt(plainText, key).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an invalid value');
    });
  });

  n.test('property encryptAlgorithm', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.encryptAlgorithm = 'xyz';
    blind.encrypt(plainText, key).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an invalid value');
    });
  });

  n.test('property maxDataLength', function (t) {
    t.plan(2);

    var blind = Blind.create();
    blind.maxDataLength = 'xyz';
    blind.encrypt(plainText, key).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    blind = Blind.create();
    blind.maxDataLength = -1;
    blind.encrypt(plainText, key).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an out-of range number');
    });
  });

  n.test('argument data', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.maxDataLength = 15;
    blind.encrypt('abcdefghijklmnop', key).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a string that is too long');
    });
  });

  n.test('argument key', function (t) {
    t.plan(2);

    Blind.create().encrypt(plainText, 10).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    Blind.create().encrypt(plainText, 'abcde').catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-binary-encoded string');
    });
  });
};
