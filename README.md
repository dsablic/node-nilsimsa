# node-nilsimsa &nbsp; [![Build Status](https://travis-ci.org/dsablic/node-nilsimsa.svg?branch=master)](https://travis-ci.org/dsablic/node-nilsimsa)
A NodeJS implementation of the [Nilsimsa](https://en.wikipedia.org/wiki/Nilsimsa_Hash) hash,
based on [jwilkins/nilsimsa](https://github.com/jwilkins/nilsimsa).

## Example
```js
const { Nilsimsa } = require('nilsimsa'),
  nilsimsa = new Nilsimsa()

nilsimsa.update('something')
nilsimsa.digest('hex') // 0008004000490a680001200400002008408074004100c00e02180a0810a44210

new Nilsimsa('somethingelse').digest('hex') // 40088440005b8aec4081206c8a002808c8807401c188e20e02180a0814a44250
```

## License
MIT
