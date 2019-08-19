# node-nilsimsa &nbsp; [![Build Status](https://travis-ci.org/dsablic/node-nilsimsa.svg?branch=master)](https://travis-ci.org/dsablic/node-nilsimsa) [![npm version](https://badge.fury.io/js/nilsimsa.svg)](https://badge.fury.io/js/nilsimsa)
A NodeJS implementation of the [Nilsimsa](https://en.wikipedia.org/wiki/Nilsimsa_Hash) hash,
based on [jwilkins/nilsimsa](https://github.com/jwilkins/nilsimsa).

## Examples

### Computing digests
```js
const { Nilsimsa } = require('nilsimsa'),
  nilsimsa = new Nilsimsa()

nilsimsa.update('something')
nilsimsa.digest('hex') // 0008004000490a680001200400002008408074004100c00e02180a0810a44210

new Nilsimsa('somethingelse').digest('hex') // 40088440005b8aec4081206c8a002808c8807401c188e20e02180a0814a44250
```

### Comparing digests
```js
const { Nilsimsa } = require('nilsimsa')

const d1 = new Nilsimsa('The quick brown fox').digest('hex'); // 0a31b4be01a0808a29e0ec60e9a258545dc0526770022348380a2128708f2fdb
const d2 = new Nilsimsa('The quicker brown fox').digest('hex'); // 1a31bc3e02a080a28b642864ea224857ddd0526f78022b48380e2269329d3fdb

Nilsimsa.compare(d1, d2) // 91
````

## License
MIT
