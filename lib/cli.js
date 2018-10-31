#!/usr/bin/env node

const balenaVersionist = require('./index.js')

let path = '.'

if (process.argv[2]) {
  path = process.argv[2]
  console.log(`Supplied path ${path}`)
}

balenaVersionist.runBalenaVersionist(path)