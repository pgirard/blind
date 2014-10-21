'use strict';

module.exports = function (t) {
  t.test('static', require('./test-static'));
  t.test('constructor', require('./test-constructor'));
  t.test('random()', require('./test-random'));
  t.test('encrypt()', require('./test-encrypt'));
  t.test('decrypt()', require('./test-decrypt'));
  t.test('hash()', require('./test-hash'));
};

// var testStatic = require('./test-static');
// var testConstructor = require('./test-constructor');
// var testRandom = require('./test-random');
// var testEncrypt = require('./test-encrypt');
// var testDecrypt = require('./test-decrypt');
// var testHash = require('./test-hash');

// var shared = {
//   randomValue: null,
//   plainText: 'abcdefghijklmno',
//   encryptedText: null
// };

// module.exports = function (it) {
//   it.describe('blind', function (it) {
//     testStatic(it);
//     testConstructor(it);
//     testRandom(it, shared);
//     testEncrypt(it, shared);
//     testDecrypt(it, shared);
//     testHash(it, shared);
//   });
// };
