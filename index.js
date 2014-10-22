'use strict';

var crypto = require('crypto');
var Promise = require('bluebird');
var is = require('is');

// constants

var maxEncryptBlockSize = 16;
var minRandomLength = 8;
var stringEncoding = 'utf8';

// valid values

var validEncryptAlgorithms = crypto.getCiphers();
var validBinaryEncodings = [ 'base64', 'hex' ];

// defaults for property values

var binaryEncodingDefault = 'base64';
var encryptAlgorithmDefault = 'aes-256-cfb';
var hashLengthDefault = 60;
var hashRoundsDefault = 10000;
var maxDataLengthDefault = 4096;
var maxRandomLengthDefault = 120;
var skipChecksDefault = false;

// property error messages

var binaryEncodingMessage = 'Property \'binaryEncoding\' must be one of the following: ' + validBinaryEncodings.join(', ');
var encryptAlgorithmMessage = 'Property \'encryptAlgorithm\' invalid; see require(\'crypto\').getCiphers() for a list of valid values';
var hashLengthMessage = 'Property \'hashLength\' must be a number';
var hashLengthRangeMessage = 'Property \'hashLength\' must be an integer greater than 0';
var hashRoundsMessage = 'Property \'hashRounds\' must be a number';
var hashRoundsRangeMessage = 'Property \'hashRounds\' must be an integer greater than 0';
var maxDataLengthMessage = 'Property \'maxDataLength\' must be a number';
var maxDataLengthRangeMessage = 'Property \'maxDataLength\' must be an integer greater than 0';
var maxRandomLengthMessage = 'Property \'maxRandomLength\' must be a number';
var maxRandomLengthRangeMessage = 'Property \'maxRandomLength\' must be an integer greater than ' + minRandomLength;

// constructor

function Blind(options) {
  options = options || {};

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

  // set and check hashLength

  this.hashLength = options.hashLength || hashLengthDefault;

  if (!is.number(this.hashLength)) {
    throw new TypeError(hashLengthMessage);
  }

  if (!is.int(this.hashLength) || this.hashLength < 1) {
    throw new RangeError(hashLengthRangeMessage);
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
  var self = this;
  var check = this._check('random');
  if (check) {
    return Promise.reject(check);
  }
  return new Promise(function (resolve, reject) {

    // check properties and arguments

    if (!self.skipChecks) {

      if (!is.number(length)) {
        return reject(new TypeError('Argument \'length\' must be a number'));
      }

      if (!is.int(length) || !is.within(length, minRandomLength, self.maxRandomLength)) {
        return reject(new RangeError('Argument \'length\' must be an integer between ' + minRandomLength + ' and ' + self.maxRandomLength));
      }
    }

    // generate the random value

    crypto.randomBytes(length, function (error, buffer) {
      if (!error) {
        resolve(buffer.toString(self.binaryEncoding));
      }
      else {
        reject(error);
      }
    });
  });
};

Blind.prototype.encrypt = function(data, key) {
  var self = this;
  var check = this._check('encrypt');
  if (check) {
    return Promise.reject(check);
  }
  return new Promise(function (resolve, reject) {

    // check properties and arguments

    if (!self.skipChecks) {

      if (!is.string(data) || !is.within(data.length, 1, self.maxDataLength)) {
        return reject(new TypeError('Argument \'data\' must be a string between 1 and ' + self.maxDataLength + ' characters long'));
      }

      if (!is.string(key) || !key.length) {
        return reject(new TypeError('Argument \'key\' must be a string with one or more characters'));
      }

      if (!is[self.binaryEncoding](key)) {
        return reject(new TypeError('Argument \'key\' must be a ' + self.binaryEncoding + ' encoded binary value'));
      }
    }

    // encrypt the data

    try {
      var cipher = crypto.createCipher(self.encryptAlgorithm, key);
      var buffers = [];

      cipher.on('data', function (chunk) {
        buffers.push(chunk);
      })
      .on('end', function () {
        resolve(Buffer.concat(buffers).toString(self.binaryEncoding));
      })
      .end(data, stringEncoding);
    }
    catch (error) {
      reject(error);
    }
  });
};

Blind.prototype.decrypt = function(data, key) {
  var self = this;
  var check = this._check('decrypt');
  if (check) {
    return Promise.reject(check);
  }
  return new Promise(function (resolve, reject) {

    // check properties and arguments

    if (!self.skipChecks) {

      var minLength = self.binaryEncoding === 'base64' ? 4 : 2;
      var encodingMultiplier = self.binaryEncoding === 'base64' ? 4 / 3 : 2;
      var maxBlockLength = Math.ceil(self.maxDataLength / maxEncryptBlockSize);
      var maxLength = Math.ceil(maxBlockLength * maxEncryptBlockSize * encodingMultiplier);

      if (!is.string(data) || !is.within(data.length, minLength, maxLength)) {
        return reject(new TypeError('Argument \'data\' must be a string between ' + minLength + ' and ' + maxLength + ' characters long'));
      }

      if (!is[self.binaryEncoding](data)) {
        return reject(new TypeError('Argument \'data\' must be a ' + self.binaryEncoding + ' encoded binary value'));
      }

      if (!is.string(key) || !key.length) {
        return reject(new TypeError('Argument \'key\' must be a string with one or more characters'));
      }

      if (!is[self.binaryEncoding](key)) {
        return reject(new TypeError('Argument \'key\' must be a ' + self.binaryEncoding + ' encoded binary value'));
      }
    }

    // decrypt the data

    try {
      var decipher = crypto.createDecipher(self.encryptAlgorithm, key);
      var buffers = [];

      decipher.on('data', function (chunk) {
        buffers.push(chunk);
      })
      .on('end', function () {
        resolve(Buffer.concat(buffers).toString(stringEncoding));
      })
      .end(data, self.binaryEncoding);
    }
    catch (error) {
      reject(new Error('Could not decrypt data; \'data\' may not be encrypted ' +
        ' or may not have been encrypted with \'key\''));
    }
  });
};

Blind.prototype.hash = function(data, salt) {
  var self = this;
  var check = this._check('hash');
  if (check) {
    return Promise.reject(check);
  }
  return new Promise(function (resolve, reject) {

    // check properties and arguments

    if (!self.skipChecks) {

      if (!is.string(data) || !is.within(data.length, 1, self.maxDataLength)) {
        return reject(new TypeError('Argument \'data\' must be a string between 1 and ' + self.maxDataLength + ' characters long'));
      }

      if (salt) {
        if (!is.string(salt) || !salt.length) {
          return reject(new TypeError('Argument \'salt\' must be a string with one or more characters'));
        }

        if (!is[self.binaryEncoding](salt)) {
          return reject(new TypeError('Argument \'salt\' must a ' + self.binaryEncoding + ' encoded binary value'));
        }
      }
    }

    // hash the data

    crypto.pbkdf2(data, salt, self.hashRounds, self.hashLength, function (error, hash) {
      if (!error) {
        resolve(hash.toString(self.binaryEncoding));
      }
      else {
        reject(error);
      }
    });
  });
};
Blind.prototype._check = function (method) {
  if (this.skipChecks) {
    return;
  }

  if (validBinaryEncodings.indexOf(this.binaryEncoding) < 0) {
    return new RangeError(binaryEncodingMessage);
  }

  if (!is.number(this.maxDataLength)) {
    return new TypeError(maxDataLengthMessage);
  }

  if (!is.int(this.maxDataLength) || this.maxDataLength < 1) {
    return new RangeError(maxDataLengthRangeMessage);
  }

  if (method === 'encrypt' || method === 'decrypt') {
    if (validEncryptAlgorithms.indexOf(this.encryptAlgorithm) < 0) {
      return new RangeError(encryptAlgorithmMessage);
    }
  }

  if (method === 'hash') {
    if (!is.number(this.hashLength)) {
      return new TypeError(hashLengthMessage);
    }

    if (!is.int(this.hashLength) || this.hashLength < 1) {
      return new RangeError(hashLengthRangeMessage);
    }

    if (!is.number(this.hashRounds)) {
      return new TypeError(hashRoundsMessage);
    }

    if (!is.int(this.hashRounds) || this.hashRounds < 1) {
      return new RangeError(hashRoundsRangeMessage);
    }
  }

  if (method === 'random') {
    if (!is.number(this.maxRandomLength)) {
      return new TypeError(maxRandomLengthMessage);
    }

    if (!is.int(this.maxRandomLength) || this.maxRandomLength < minRandomLength + 1) {
      return new RangeError(maxRandomLengthRangeMessage);
    }
  }
};
// static methods

Blind.create = function (options) {
  return new Blind(options);
};

module.exports = Blind;
