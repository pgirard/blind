# blind

simple string encryption and hashing

<img src="blind.jpg" />

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
 * __hashRounds__ - 10000, number of hashing iterations to make it computationally expensive
 * __maxDataLength__ - 4096, maximum length in characters of data to be encrypted or hashed
 * __maxRandomLength__ - 120, maximum length in bytes of random values (before encoding)
 * __skipChecks__ - false, skip property and argument checks on function calls; improves performance,
    returns cryptic error messages when it fails

## functions

### random(length)

Generates a random value of the specified length in bytes.
Returns a Promise which returns the random value as a binary-encoded string.
Use this to generate keys and salt for the functions below.
Wraps [crypto.randomBytes](http://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback).

``` js
var random = new Blind().random(16);
// example: 'PZ3oXv2v6Pq5HAPFI9NFbQ=='

var random = new Blind({ binaryEncoding: 'hex' }).random(16)
// example: '5dfc4556a70e95a9cfda08975187b165'
```

### encrypt(data, key)

Encrypts plain text data using the binary-encoded key (optional if _encryptKey_ is set).
Returns the encrypted value as a binary-encoded string.
Wraps [crypto.Cipher](http://nodejs.org/api/crypto.html#crypto_class_cipher).  

``` js
var encrypted = new Blind().encrypt('Blueberry pancakes', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(e, 'IXH46BLKBXwZcC2QyNHB+EmJ');

var encrypted = new Blind({ encryptAlgorithm: 'blowfish' })
  .encrypt('Blueberry pancakes', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(e, '1Uv7F3uWgc8g9uW3HlGFdWigBGQq4Hku');
```

### decrypt(encrypted, key)

Decrypts the string of encrypted data using the binary-encoded key (optional if _encryptKey_ is set).
Returns the plain text value.
Wraps [crypto.Decipher](http://nodejs.org/api/crypto.html#crypto_class_decipher).

``` js
var decrypted = new Blind().decrypt('IXH46BLKBXwZcC2QyNHB+EmJ', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(decrypted, 'Blueberry pancakes');

var decrypted = new Blind({ encryptAlgorithm: 'blowfish' })
  .decrypt('1Uv7F3uWgc8g9uW3HlGFdWigBGQq4Hku', 'PZ3oXv2v6Pq5HAPFI9NFbQ==')
assert.equal(decrypted, 'Blueberry pancakes');
```

### hash(data, salt)

Hashes plain text data using an optional binary-encoded salt value.
Returns the hashed value as a binary-encoded string.
Wraps [crypto.Hash](http://nodejs.org/api/crypto.html#crypto_class_hash).
This is synchronous and will occupy Node will it iterates through _blind.hashRounds_ calls to crypto.Hash.

``` js
var hash = new Blind().hash('Banana nut muffin', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(hash, '+evxR+9+Gr0gktw1AIS7Uzyw0w+iM6sIWdNEdF1WF44=');

var hash = new Blind({ hashAlgorithm: 'sha512' }).hash('Banana nut muffin', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
assert.equal(hash, '1zLMsFAaziPTQMSSp6RI6vj7veMabm5EXJOo5Z4QPhnb3XH4lOsoCqwTk0PBfK6sYb8ANcer67B9K1HP8NtYhA==');
```
