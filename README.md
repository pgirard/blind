# blind

simple string encryption and hashing

<img src="blind.jpg" />

## features
 * for hiding small text strings
 * all functions return Promises (server friendly)
 * helpful error messages
 * Node only, wraps [crypto](http://nodejs.org/api/crypto.html) functions
 * web application (coming soon)

## constructor

``` js
var Blind = require('blind');
var blind = new Blind(options);
// or
var blind = Blind.create(options);
```

## options / properties and defaults
 * __binaryEncoding__ - 'base64' or 'hex', encoding of random values, keys, salt, encrypted values and hashes
 * __encryptionAlgorithm__ - 'aes-256-cfb', algorithm used in encrypt() and decrypt(); see
    [crypto.getCiphers()](http://nodejs.org/api/crypto.html#crypto_crypto_getciphers) for a list of valid values
 * __hashLength__ - 60, length in bytes of hashed values (before encoding)
 * __hashRounds__ - 10000, number of hashing iterations
 * __maxDataLength__ - 4096, maximum length in characters of data to be encrypted or hashed
 * __maxRandomLength__ - 120, maximum length in bytes of random values (before encoding)
 * __skipChecks__ - false, skip property and argument checks on function calls; improves performance,
    returns cryptic error messages when it fails

## functions

### random(length)

Generates a random value of the specified length in bytes.
Returns a Promise which returns the random values as a binary-encoded string.
Use this to generate keys and salt for the functions below.
Wraps [crypto.randomBytes](http://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback).

``` js
Blind.create()
  .random(16)
  .then(function (value) {
    // example: 'PZ3oXv2v6Pq5HAPFI9NFbQ=='
  });

Blind.create({ binaryEncoding: 'hex' })
  .random(16)
  .then(function (value) {
    // example: '5dfc4556a70e95a9cfda08975187b165'
  });
```

### encrypt(data, key)

Encrypts plain text data using the binary-encoded key.
Returns a Promise which returns the encrypted value as a binary-encoded string.
Wraps [crypto.Cipher](http://nodejs.org/api/crypto.html#crypto_class_cipher).  

``` js
Blind.create()
  .encrypt('Blueberry pancakes', 'PZ3oXv2v6Pq5HAPFI9NFbQ==')
  .then(function (value) {
    assert.equal(value, 'IXH46BLKBXwZcC2QyNHB+EmJ');
  });

Blind.create({ encryptAlgorithm: 'blowfish' })
  .encrypt('Blueberry pancakes', 'PZ3oXv2v6Pq5HAPFI9NFbQ==')
  .then(function (value) {
    assert.equal(value, '1Uv7F3uWgc8g9uW3HlGFdWigBGQq4Hku');
  });
```

### decrypt(encrypted, key)

Decrypts the string of encrypted data using the binary-encoded key.
Returns a Promise which returns the plain text value.
Wraps [crypto.Decipher](http://nodejs.org/api/crypto.html#crypto_class_decipher).

``` js
Blind.create()
  .decrypt('IXH46BLKBXwZcC2QyNHB+EmJ', 'PZ3oXv2v6Pq5HAPFI9NFbQ==')
  .then(function (value) {
    assert.equal(value, 'Blueberry pancakes');
  });

Blind.create({ encryptAlgorithm: 'blowfish' })
  .decrypt('1Uv7F3uWgc8g9uW3HlGFdWigBGQq4Hku', 'PZ3oXv2v6Pq5HAPFI9NFbQ==')
  .then(function (value) {
    assert.equal(value, 'Blueberry pancakes');
  });
```
### hash(data, salt)

Hashes plain text data using an optional binary-encoded salt value.
Returns a Promise which returns the hashed value as a binary-encoded string.
Wraps [crypto.pbkdf2](http://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_callback).

``` js
Blind.create()
  .hash('Banana nut muffin', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
  .then(function (value) {
    assert.equal(value, 'lxl9UhUNyNYTPG6IJkILWu3ibNZQxTl5m+qE906UFi0WaR6SQoxMBqxop3H9t1HwuDo2Lyl9YNJJ1gUZ');
  });

Blind.create({ hashLength: 30 })
  .hash('Banana nut muffin', 'PZ3oXv2v6Pq5HAPFI9NFbQ==');
  .then(function (value) {
    assert.equal(value, 'lxl9UhUNyNYTPG6IJkILWu3ibNZQxTl5m+qE906U');
  });
```
