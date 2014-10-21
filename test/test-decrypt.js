'use strict';

var Blind = require('../index');

var plainText = 'abcdefghijlkmno';
var key = 'kiSyAWnj9VDVIfI3u7zj';
var encryptedText = 'f+ElzhNFLVHKi/j/I6fu';

module.exports = function (n) {
  n.plan(7);

  Blind.create().decrypt(encryptedText, key).then(function (value) {
    n.equal(value, plainText, 'should decrypt an encrypted value');
  });

  Blind.create().decrypt(plainText, key).catch(function (error) {
    n.ok(error instanceof Error, 'should reject an encrypted value and key that don\'t match');
  });

  n.test('property binaryEncoding', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.binaryEncoding = 'xyz';
    blind.decrypt(encryptedText, key).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an invalid value');
    });
  });

  n.test('property encryptAlgorithm', function (t) {
    t.plan(1);

    var blind = Blind.create();
    blind.encryptAlgorithm = 'xyz';
    blind.decrypt(encryptedText, key).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an invalid value');
    });
  });

  n.test('property maxDataLength', function (t) {
    t.plan(2);

    var blind = Blind.create();
    blind.maxDataLength = 'xyz';
    blind.decrypt(encryptedText, key).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    blind = Blind.create();
    blind.maxDataLength = -1;
    blind.decrypt(encryptedText, key).catch(function (error) {
      t.ok(error instanceof RangeError, 'should reject an out-of range number');
    });
  });

  n.test('argument data', function (t) {
    t.plan(2);

    var blind = Blind.create();
    blind.maxDataLength = 15;
    blind.decrypt(encryptedText + 'abcd', key).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a string that is too long');
    });

    Blind.create().decrypt(encryptedText + 'a', key).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-binary-encoded string');
    });
  });

  n.test('argument key', function (t) {
    t.plan(2);

    Blind.create().decrypt(encryptedText, 10).catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-number');
    });

    Blind.create().decrypt(encryptedText, 'abcde').catch(function (error) {
      t.ok(error instanceof TypeError, 'should reject a non-binary-encoded string');
    });
  });
};
