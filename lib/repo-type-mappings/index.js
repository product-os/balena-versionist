const {
  lstatSync,
  readdirSync,
  readFileSync
} = require('fs')
const { join, basename } = require('path')
const _ = require('lodash')
const YAML = require('js-yaml')
const mustache = require('mustache')

const CONF_FILENAME = 'versionist.conf.js'

const isDirectory = (source) => lstatSync(source).isDirectory()
const getDirectories = (source) => {
  return _(readdirSync(source))
  .map(name => join(source, name))
  .filter(isDirectory)
  .value()
}

const mappings = getDirectories(__dirname)

const exportedMappings = _.reduce(mappings, (exportedMappings, dirName) => {
  const type = basename(dirName)
  exportedMappings[type] = {}
  exportedMappings[type].getConfig = (options, path) => {

    let configuration = '';
    let dependencies;
    try {
      configuration = readFileSync(join(path, CONF_FILENAME), 'utf8');
      dependencies = YAML.load(readFileSync(join(path, 'dependencies.yml'), 'utf8'))
    } catch(err) {
      const defaultConf = readFileSync(join(dirName, CONF_FILENAME), 'utf8')
      configuration = mustache.render(defaultConf, options)
      dependencies = YAML.load(readFileSync(join(dirName, 'dependencies.yml'), 'utf8'))
    }

    return {
      configuration,
      dependencies,
    }
  }
  return exportedMappings
}, {})

module.exports = exportedMappings
