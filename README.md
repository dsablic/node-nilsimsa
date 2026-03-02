# node-nilsimsa &nbsp; [![CI](https://github.com/dsablic/node-nilsimsa/actions/workflows/ci.yml/badge.svg)](https://github.com/dsablic/node-nilsimsa/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/nilsimsa)](https://www.npmjs.com/package/nilsimsa) [![node](https://img.shields.io/node/v/nilsimsa)](https://nodejs.org) [![license](https://img.shields.io/npm/l/nilsimsa)](./LICENSE)
A Node.js implementation of the [Nilsimsa](https://en.wikipedia.org/wiki/Nilsimsa_Hash) locality-sensitive hash,
based on [jwilkins/nilsimsa](https://github.com/jwilkins/nilsimsa).

Requires Node.js >= 22. No dependencies.

## Examples

### Computing digests
```js
import { Nilsimsa } from 'nilsimsa'

const nilsimsa = new Nilsimsa()
nilsimsa.update('something')
nilsimsa.digest('hex') // 0008004000490a680001200400002008408074004100c00e02180a0810a44210

new Nilsimsa('somethingelse').digest('hex') // 40088440005b8aec4081206c8a002808c8807401c188e20e02180a0814a44250
```

### Comparing digests
```js
import { Nilsimsa } from 'nilsimsa'

const d1 = new Nilsimsa('The quick brown fox').digest('hex')
const d2 = new Nilsimsa('The quicker brown fox').digest('hex')

Nilsimsa.compare(d1, d2) // 91
```

## License
MIT
