#!/usr/bin/env node

const capitano = require('capitano')
const balenaVersionist = require('../lib/index.js')

capitano.command({
  signature: '[path]',
  description: 'Run versionist in path',
  options: [],
  action: (params, options) => {
    const path = params.path || '.'
    balenaVersionist.runBalenaVersionist(path, options)
  }
})

capitano.command({
  signature: 'set <version> [path]',
  description: 'Run versionist in path with set versions',
  options: [],
  action: (params, options) => {
    const path = params.path || '.'
    balenaVersionist.runBalenaVersionist(path, {
      version: params.version
    })
  }
})

capitano.run(process.argv, err => {
  if (err != null) {
    throw err
  }
})
