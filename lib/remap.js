const _ = require('lodash')
const mappings = {
  'rust-module': [ 'rust-public-crate', 'rust-public-crate-wasm'],
  'generic': ['product', 'environment', 'balena-engine']
}
const invertedMappings = {}

Object.keys(mappings).forEach(k => {
  return mappings[k].forEach(a => invertedMappings[a] = k)
})

const remapType = (type) => {
  if (invertedMappings[type]) return invertedMappings[type]
  return type
}

module.exports = remapType
