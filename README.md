# blind

simple string encryption and hashing for Node

<img src="blind.jpg" />

[![NPM][npm-badge]][npm-badge-url]

## features
 * for hiding small text strings
 * helpful error messages
 * Node only, wraps [crypto](http://nodejs.org/api/crypto.html) functions
 * demonstration and utility [web application](https://github.com/pgirard/blind-app) available

## constructor

``` js
var Blind = require('blind');
var blind = new Blind(options);

// or to go straight to an instance
var blind = require('blind')(options);
```

## options / properties and defaults
 * __binaryEncoding__ - 'base64' or 'hex', encoding of random values, keys, salt, encrypted values and hashes
 * __encryptAlgorithm__ - 'aes-256-cfb', algorithm used in encrypt() and decrypt(); see
    [crypto.getCiphers()](http://nodejs.org/api/crypto.html#crypto_crypto_getciphers) for a list of valid values
 * __encryptKey__ - undefined, default key to use in encrypt() and decrypt(); must be a binary encoded string
 * __hashAlgorithm__ - 'sha256', algorithm used in hash(); see
    [crypto.getHashes()](http://nodejs.org/api/crypto.html#crypto_crypto_gethashes) for a list of valid values
 * __hashRounds__ - 10000, number of iterations to use in hash() to make it computationally expensive
 * __maxDataLength__ - 4096, maximum allowed length in characters of data to be encrypted or hashed
 * __maxRandomLength__ - 120, maximum allowed length value for random()
 * __randomLength__ - 24, default length to use in random()
 * __skipChecks__ - false, whether to skip property and argument checks in the functions; setting to true improves
    performance slightly but returns cryptic error messages when it fails (not recommended)

## functions

### random(length)

Generates a random value of the specified length in bytes (optional, defaults to _randomLength_).
Returns the random value as a binary-encoded string.
Use this to generate keys and salt for the functions below.
Wraps [crypto.randomBytes](http://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback).

``` js
random = new Blind().random();
// example: '3EwDPmJtBzfxXcevaVaGBE9geAFhX0Y8'

random = new Blind().random(16);
// example: 'PZ3oXv2v6Pq5HAPFI9NFbQ=='

random = new Blind({ binaryEncoding: 'hex' }).random(16)
// example: '5dfc4556a70e95a9cfda08975187b165'
```

### encrypt(data, key)

Encrypts plain text data using a binary-encoded key (optional if _encryptKey_ is set).
Returns the encrypted value as a binary-encoded string.
Wraps [crypto.Cipher](http://nodejs.org/api/crypto.html#crypto_class_cipher).  

``` js
encrypted = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).encrypt('Blueberry pancakes');
assert.equal(encrypted, 'yg7scmfKvnvwAcSnDy1Z+Gzm');

encrypted = new Blind().encrypt('Blueberry pancakes', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(encrypted, 'yg7scmfKvnvwAcSnDy1Z+Gzm');

encrypted = new Blind({ encryptAlgorithm: 'blowfish' })
  .encrypt('Blueberry pancakes', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(encrypted, 'ARCwwlkXGORgv46zgh4sX8DzqpcWf8pi');
```

### decrypt(encrypted, key)

Decrypts the string of encrypted data using the binary-encoded key (optional if _encryptKey_ is set).
Returns the plain text value.
Wraps [crypto.Decipher](http://nodejs.org/api/crypto.html#crypto_class_decipher).

``` js
decrypted = new Blind({ encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ==' }).decrypt('yg7scmfKvnvwAcSnDy1Z+Gzm');
assert.equal(decrypted, 'Blueberry pancakes');

decrypted = new Blind().decrypt('yg7scmfKvnvwAcSnDy1Z+Gzm', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(decrypted, 'Blueberry pancakes');

decrypted = new Blind({ encryptAlgorithm: 'blowfish' })
  .decrypt('ARCwwlkXGORgv46zgh4sX8DzqpcWf8pi', 'PZ3oXv2v6Pq5HAPFI9NFbQ==')
assert.equal(decrypted, 'Blueberry pancakes');
```

### hash(data, salt, callback)

Hashes plain text data using an optional binary-encoded salt value.
Returns the hashed value as a binary-encoded string.
For asynchronous use (recommended), provide a callback function that takes two arguments, an error
object and the hashed value.
Wraps [crypto.Hash](http://nodejs.org/api/crypto.html#crypto_class_hash).

``` js
// synchronous
hash = new Blind().hash('Banana nut muffin', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(hash, '+evxR+9+Gr0gktw1AIS7Uzyw0w+iM6sIWdNEdF1WF44=');

hash = new Blind({ hashAlgorithm: 'sha512' }).hash('Banana nut muffin', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(hash, '1zLMsFAaziPTQMSSp6RI6vj7veMabm5EXJOo5Z4QPhnb3XH4lOsoCqwTk0PBfK6sYb8ANcer67B9K1HP8NtYhA==');

// asynchronous
new Blind().hash('Banana nut muffin', 'PZ3oXv2v6Pq5HAPFI9NFbQ==', function (err, hash) {
  assert.equal(hash, '+evxR+9+Gr0gktw1AIS7Uzyw0w+iM6sIWdNEdF1WF44=');
})
```
[npm-badge]: https://nodei.co/npm/blind.svg?downloads=true&stars=true
[npm-badge-url]: https://nodei.co/npm/blind/
