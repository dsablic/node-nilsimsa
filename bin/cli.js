#!/usr/bin/env node

const { createReadStream } = require('fs'),
  { Nilsimsa } = require('../index'),
  path = process.argv[2],
  nilsimsa = new Nilsimsa()

const stream = path ? createReadStream(path) : process.stdin
stream.on('data', data => nilsimsa.update(data))
stream.on('end', () => console.log(nilsimsa.digest('hex')))
