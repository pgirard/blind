'use strict';

var testStatic = require('./test-static');
var testConstructor = require('./test-constructor');
var testRandom = require('./test-random');
var testEncrypt = require('./test-encrypt');
var testDecrypt = require('./test-decrypt');
var testHash = require('./test-hash');

var shared = {
  randomValue: null,
  plainText: 'abcdefghijklmno',
  encryptedText: null
};

module.exports = function (it) {
  it.describe('blind', function (it) {
    testStatic(it);
    testConstructor(it);
    testRandom(it, shared);
    testEncrypt(it, shared);
    testDecrypt(it, shared);
    testHash(it, shared);
  });
};
