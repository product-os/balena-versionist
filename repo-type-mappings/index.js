const {
  lstatSync,
  readdirSync,
  readFileSync
} = require('fs')
const { join, basename } = require('path')
const _ = require('lodash')
const YAML = require('js-yaml')
const mustache = require('mustache')

const isDirectory = (source) => lstatSync(source).isDirectory()
const getDirectories = (source) => {
  return _(readdirSync(source))
  .map(name => join(source, name))
  .filter(isDirectory)
  .value()
}

const mappings = getDirectories(__dirname)

const exportedMappings = _.reduce(mappings, (exportedMappings, dirName) => {
  const configFile = readFileSync(join(dirName, 'versionist.conf.js'), 'utf8')
  const dependencies = YAML.safeLoad(readFileSync(join(dirName, 'dependencies.yml'), 'utf8'))

  const type = basename(dirName)
  exportedMappings[type] = {}
  exportedMappings[type].getConfig = (options) => {
    return {
      configuration: mustache.render(configFile, options),
      dependencies: dependencies
    }
  }
  return exportedMappings
}, {})

module.exports = exportedMappings