#!/usr/bin/env node

import { createReadStream } from 'fs'
import { Nilsimsa } from '../index.js'

const path = process.argv[2]
const nilsimsa = new Nilsimsa()

const stream = path ? createReadStream(path) : process.stdin
stream.on('data', data => nilsimsa.update(data))
stream.on('end', () => console.log(nilsimsa.digest('hex')))
