'use strict';

var crypto = require('crypto');
var is = require('is');

// constants

var maxEncryptBlockSize = 16;
var minRandomLength = 8;
var stringEncoding = 'utf8';

// valid values

var validEncryptAlgorithms = crypto.getCiphers();
var validHashAlgorithms = crypto.getHashes();
var validBinaryEncodings = [ 'base64', 'hex' ];

// defaults for property values

var binaryEncodingDefault = 'base64';
var encryptAlgorithmDefault = 'aes-256-cfb';
var hashAlgorithmDefault = 'sha256';
var hashRoundsDefault = 10000;
var maxDataLengthDefault = 4096;
var maxRandomLengthDefault = 120;
var skipChecksDefault = false;

// property error messages

var binaryEncodingMessage = 'Property \'binaryEncoding\' must be one of the following: ' + validBinaryEncodings.join(', ');
var encryptAlgorithmMessage = 'Property \'encryptAlgorithm\' invalid; see require(\'crypto\').getCiphers() for a list of valid values';
var hashAlgorithmMessage = 'Property \'hashAlgorithm\' invalid; see require(\'crypto\').getHashes() for a list of valid values';
var hashRoundsMessage = 'Property \'hashRounds\' must be a number';
var hashRoundsRangeMessage = 'Property \'hashRounds\' must be an integer greater than 0';
var maxDataLengthMessage = 'Property \'maxDataLength\' must be a number';
var maxDataLengthRangeMessage = 'Property \'maxDataLength\' must be an integer greater than 0';
var maxRandomLengthMessage = 'Property \'maxRandomLength\' must be a number';
var maxRandomLengthRangeMessage = 'Property \'maxRandomLength\' must be an integer greater than ' + minRandomLength;

// constructor

function Blind(options) {
  options = options || {};

  if (!(this instanceof Blind)) {
    return new Blind(options);
  }

  // set and check binaryEncoding

  this.binaryEncoding = options.binaryEncoding || binaryEncodingDefault;

  if (validBinaryEncodings.indexOf(this.binaryEncoding) < 0) {
    throw new RangeError(binaryEncodingMessage);
  }

  // set and check encryptAlgorithm

  this.encryptAlgorithm = options.encryptAlgorithm || encryptAlgorithmDefault;

  if (validEncryptAlgorithms.indexOf(this.encryptAlgorithm) < 0) {
    throw new RangeError(encryptAlgorithmMessage);
  }

  // set and check hashAlgorithm

  this.hashAlgorithm = options.hashAlgorithm || hashAlgorithmDefault;

  if (validHashAlgorithms.indexOf(this.hashAlgorithm) < 0) {
    throw new RangeError(hashAlgorithmMessage);
  }

  // set and check hashRounds

  this.hashRounds = options.hashRounds || hashRoundsDefault;

  if (!is.number(this.hashRounds)) {
    throw new TypeError(hashRoundsMessage);
  }

  if (!is.int(this.hashRounds) || this.hashRounds < 1) {
    throw new RangeError(hashRoundsRangeMessage);
  }

  // set and check maxDataLength

  this.maxDataLength = options.maxDataLength || maxDataLengthDefault;

  if (!is.number(this.maxDataLength)) {
    throw new TypeError(maxDataLengthMessage);
  }

  if (!is.int(this.maxDataLength) || this.maxDataLength < 1) {
    throw new RangeError(maxDataLengthRangeMessage);
  }

  // set and check maxRandomLength

  this.maxRandomLength = options.maxRandomLength || maxRandomLengthDefault;

  if (!is.number(this.maxRandomLength)) {
    throw new TypeError(maxRandomLengthMessage);
  }

  if (!is.int(this.maxRandomLength) || this.maxRandomLength < minRandomLength + 1) {
    throw new RangeError(maxRandomLengthRangeMessage);
  }

  // set skipChecks

  this.skipChecks = options.skipChecks || skipChecksDefault;
}

// methods

Blind.prototype.random = function (length) {

  // check properties and arguments

  if (!this.skipChecks) {
    if (validBinaryEncodings.indexOf(this.binaryEncoding) < 0) {
      throw new RangeError(binaryEncodingMessage);
    }

    if (!is.number(this.maxRandomLength)) {
      throw new TypeError(maxRandomLengthMessage);
    }

    if (!is.int(this.maxRandomLength) || this.maxRandomLength < minRandomLength + 1) {
      throw new RangeError(maxRandomLengthRangeMessage);
    }

    if (!is.number(length)) {
      throw new TypeError('Argument \'length\' must be a number');
    }

    if (!is.int(length) || !is.within(length, minRandomLength, this.maxRandomLength)) {
      throw new RangeError('Argument \'length\' must be an integer between ' + minRandomLength + ' and ' + this.maxRandomLength);
    }
  }

  // generate the random value

  return crypto.randomBytes(length).toString(this.binaryEncoding);
};

Blind.prototype.encrypt = function(data, key) {

  // check properties and arguments

  if (!this.skipChecks) {
    if (validBinaryEncodings.indexOf(this.binaryEncoding) < 0) {
      throw new RangeError(binaryEncodingMessage);
    }

    if (validEncryptAlgorithms.indexOf(this.encryptAlgorithm) < 0) {
      throw new RangeError(encryptAlgorithmMessage);
    }

    if (!is.number(this.maxDataLength)) {
      throw new TypeError(maxDataLengthMessage);
    }

    if (!is.int(this.maxDataLength) || this.maxDataLength < 1) {
      throw new RangeError(maxDataLengthRangeMessage);
    }

    if (!is.string(data) || !is.within(data.length, 1, this.maxDataLength)) {
      throw new TypeError('Argument \'data\' must be a string between 1 and ' + this.maxDataLength + ' characters long');
    }

    if (!is.string(key) || !key.length) {
      throw new TypeError('Argument \'key\' must be a string with one or more characters');
    }

    if (!is[this.binaryEncoding](key)) {
      throw new TypeError('Argument \'key\' must be a ' + this.binaryEncoding + ' encoded binary value');
    }
  }

  // encrypt the data

  var cipher = crypto.createCipher(this.encryptAlgorithm, key);
  return cipher.update(data, stringEncoding, this.binaryEncoding) + cipher.final(this.binaryEncoding);
};

Blind.prototype.decrypt = function(data, key) {

  // check properties and arguments

  if (!this.skipChecks) {
    if (validBinaryEncodings.indexOf(this.binaryEncoding) < 0) {
      throw new RangeError(binaryEncodingMessage);
    }

    if (validEncryptAlgorithms.indexOf(this.encryptAlgorithm) < 0) {
      throw new RangeError(encryptAlgorithmMessage);
    }

    if (!is.number(this.maxDataLength)) {
      throw new TypeError(maxDataLengthMessage);
    }

    if (!is.int(this.maxDataLength) || this.maxDataLength < 1) {
      throw new RangeError(maxDataLengthRangeMessage);
    }

    var minLength = this.binaryEncoding === 'base64' ? 4 : 2;
    var encodingMultiplier = this.binaryEncoding === 'base64' ? 4 / 3 : 2;
    var maxBlockLength = Math.ceil(this.maxDataLength / maxEncryptBlockSize);
    var maxLength = Math.ceil(maxBlockLength * maxEncryptBlockSize * encodingMultiplier);

    if (!is.string(data) || !is.within(data.length, minLength, maxLength)) {
      throw new TypeError('Argument \'data\' must be a string between ' + minLength + ' and ' + maxLength + ' characters long');
    }

    if (!is[this.binaryEncoding](data)) {
      throw new TypeError('Argument \'data\' must be a ' + this.binaryEncoding + ' encoded binary value');
    }

    if (!is.string(key) || !key.length) {
      throw new TypeError('Argument \'key\' must be a string with one or more characters');
    }

    if (!is[this.binaryEncoding](key)) {
      throw new TypeError('Argument \'key\' must be a ' + this.binaryEncoding + ' encoded binary value');
    }
  }

  // decrypt the data

  var decipher = crypto.createDecipher(this.encryptAlgorithm, key);
  return decipher.update(data, this.binaryEncoding, stringEncoding) + decipher.final(stringEncoding);
};

Blind.prototype.hash = function(data, salt) {

  // check properties and arguments

  if (!this.skipChecks) {
    if (validBinaryEncodings.indexOf(this.binaryEncoding) < 0) {
      throw new RangeError(binaryEncodingMessage);
    }

    if (validHashAlgorithms.indexOf(this.hashAlgorithm) < 0) {
      throw new RangeError(hashAlgorithmMessage);
    }

    if (!is.number(this.hashRounds)) {
      throw new TypeError(hashRoundsMessage);
    }

    if (!is.int(this.hashRounds) || this.hashRounds < 1) {
      throw new RangeError(hashRoundsRangeMessage);
    }

    if (!is.number(this.maxDataLength)) {
      throw new TypeError(maxDataLengthMessage);
    }

    if (!is.int(this.maxDataLength) || this.maxDataLength < 1) {
      throw new RangeError(maxDataLengthRangeMessage);
    }

    if (!is.string(data) || !is.within(data.length, 1, this.maxDataLength)) {
      throw new TypeError('Argument \'data\' must be a string between 1 and ' + this.maxDataLength + ' characters long');
    }

    if (salt) {
      if (!is.string(salt) || !salt.length) {
        throw new TypeError('Argument \'salt\' must be a string with one or more characters');
      }

      if (!is[this.binaryEncoding](salt)) {
        throw new TypeError('Argument \'salt\' must a ' + this.binaryEncoding + ' encoded binary value');
      }
    }
  }

  // hash the data

  salt = salt || '';

  var buffer = Buffer.concat([ new Buffer(salt, this.binaryEncoding), new Buffer(data) ]);
  var hash;

  for (var i = 0; i < this.hashRounds; i++) {
    hash = crypto.createHash(this.hashAlgorithm);
    hash.update(buffer);
    buffer = hash.digest();
  }

  return buffer.toString(this.binaryEncoding);
};

module.exports = Blind;
