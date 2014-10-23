'use strict';

var Blind = require('../index');

var key = 'kiSyAWnj9VDVIfI3u7zj';

module.exports = function (n) {
  n.plan(9);

  n.equal(new Blind().binaryEncoding, 'base64', 'should instantiate with new');
  n.equal(Blind().binaryEncoding, 'base64', 'should instantiate without new');

  n.test('option binaryEncoding', function (t) {
    t.equal(new Blind({ binaryEncoding: 'hex' }).binaryEncoding, 'hex', 'should accept a valid value');
    t.throws(function () { new Blind({ binaryEncoding: 'xyz' }); }, 'should reject an invalid value');
    t.end();
  });

  n.test('option encryptAlgorithm', function (t) {
    t.equal(new Blind({ encryptAlgorithm: 'aes-256-cbc' }).encryptAlgorithm, 'aes-256-cbc', 'should accept a valid value');
    t.throws(function () { new Blind({ encryptAlgorithm: 'xyz' }); }, 'should reject an invalid value');
    t.end();
  });

  n.test('option encryptKey', function (t) {
    t.equal(new Blind({ encryptKey: key }).encryptKey, key, 'should accept a valid value');
    t.throws(function () { new Blind({ encryptKey: 10 }); }, 'should reject a non-string');
    t.throws(function () { new Blind({ encryptKey: 'abcde' }); }, 'should reject a non-binary-encoded value');
    t.end();
  });

  n.test('option hashAlgorithm', function (t) {
    t.equal(new Blind({ hashAlgorithm: 'sha1' }).hashAlgorithm, 'sha1', 'should accept a valid value');
    t.throws(function () { new Blind({ hashAlgorithm: 'xyz' }); }, 'should reject an invalid value');
    t.end();
  });

  n.test('option hashRounds', function (t) {
    t.equal(new Blind({ hashRounds: 20 }).hashRounds, 20, 'should accept a valid value');
    t.throws(function () { new Blind({ hashRounds: 'xyz' }); }, 'should reject a non-number');
    t.throws(function () { new Blind({ hashRounds: -1 }); }, 'should reject an out-of range number');
    t.end();
  });

  n.test('option maxDataLength', function (t) {
    t.equal(new Blind({ maxDataLength: 8192 }).maxDataLength, 8192, 'should accept a valid value');
    t.throws(function () { new Blind({ maxDataLength: 'xyz' }); }, 'should reject a non-number');
    t.throws(function () { new Blind({ maxDataLength: -1 }); }, 'should reject an out-of range number');
    t.end();
  });

  n.test('option maxRandomLength', function (t) {
    t.equal(new Blind({ maxRandomLength: 256 }).maxRandomLength, 256, 'should accept a valid value');
    t.throws(function () { new Blind({ maxRandomLength: 'xyz' }); }, 'should reject a non-number');
    t.throws(function () { new Blind({ maxRandomLength: -1 }); }, 'should reject an out-of range number');
    t.end();
  });
};
