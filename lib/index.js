const _ = require('lodash')
const Promise = require('bluebird')
const {
  writeFileAsync,
  readFileAsync,
  accessAsync,
  unlinkAsync
} = Promise.promisifyAll(require('fs'))
const { execAsync } = Promise.promisifyAll(require('child_process'))
const { join } = require('path')
const YAML = require('js-yaml')
const parseGithubURL = require('parse-github-url')
const configOverrides = require('./repo-type-mappings')
const remapTypes = require('./remap.js')
let LOG_LEVEL = 'verbose'

const log = (l) => {
  if (LOG_LEVEL !== 'silent') {
    console.error(l)
  }
}

const normaliseConfigType = (type) => {
  return type.replace(/\s/g, '-')
}

const extractUpstreamInfo = (upstream) => {
  if (_.isArray(upstream)) {
    return _.flatMap(upstream, extractUpstreamInfo)
  }
  if (!upstream.url) {
    throw new Error('Upstream must specify an url')
  }
  const parseResult = parseGithubURL(upstream.url)
  return [{
    pattern: upstream.repo,
    owner: parseResult.owner,
    repo: parseResult.name,
    ref: parseResult.branch
  }]
}


const installConfigDependencies = (path) => {
  return accessAsync(join(path, 'versionist.conf.js'))
  .then(() => {
    log('Installing dev dependencies')
    return execAsync(`npm install --only=dev`, { cwd: path })
    .return(false)
  }).catch((err) => {
    // If no configuration file is found nothing needs to be done
    return false
  })
}

const injectConfig = (path) => {
  return readFileAsync(join(path, 'repo.yml'), 'utf8')
  .then((configFile) => {
    const config = YAML.safeLoad(configFile)
    if (!config.type) {
      // Throw error here, will be caught and proceed with installConfigDependencies
      throw new Error('No repo.type')
    }
    const normalisedType = remapTypes(normaliseConfigType(config.type))
    log(`Versioning for type: ${normalisedType}`)
    if (configOverrides[normalisedType]) {
      if (config.upstream) {
        config.upstream = extractUpstreamInfo(config.upstream)
      }
      return Promise.resolve(configOverrides[normalisedType].getConfig(config, path))
      .tap((result) => {
        log('Installing injected dependencies')
        log(result.dependencies)
        if (_.isArray(result.dependencies) && !_.isEmpty(result.dependencies)) {
          const dependencies = _.reduce(result.dependencies, (soFar, dep) => {
            soFar += `${dep.name} `
            return soFar
          }, '')
          return execAsync(`npm install --no-save ${dependencies}`, { cwd: path })
        }
      }).then((result) => {
        log('Writing temp configuration')
        return writeFileAsync(join(path, 'versionist.tmp.js'), result.configuration)
      }).then(() => {
        return true
      })
    }
    log('repo.yml: type does not match a declared preset')
    return false
  })
}

module.exports.runBalenaVersionist = (path, options = {}) => {
  if (options.silent) {
    LOG_LEVEL = 'silent'
  }
  log('Checking configuration')
  return accessAsync(join(path, 'repo.yml'))
  .then(() => {
    return injectConfig(path)
  })
  .catch((err) => {
    if (err.code === 'ENOENT' || err.message === 'No repo.type') {
      log('No override available')
      return installConfigDependencies(path)
    }
    log(err)
    throw err
  }).then((injectedConfig) => {
    const extraOpts = buildVersionistOptions(options)
    let config = ''
    if (injectedConfig) {
      config += '--config=versionist.tmp.js'
    }
    log('Versioning')
    return execAsync(`versionist ${config} ${extraOpts}`, { cwd: path })
    .then((stdout, stderr) => {
      logInDebug(`stdout: ${stdout}`)
      logInDebug(`stderr: ${stderr}`)
      return execAsync(`versionist ${config} get version`, { cwd: path })
      .then((stdout, stderr) => {
        log('Built version', stdout)
        return stdout.trim()
      })
    }).finally(() => {
      if (injectedConfig) {
        log('Deleting temp configuration')
        return unlinkAsync(join(path, 'versionist.tmp.js'))
      }
    })
  })
}

const buildVersionistOptions = (options) => {
  let config = ''
  if (options.version) {
    config += `set ${options.version}`
  }
  if (options.title) {
    config += `-t ${options.title}`
  }
  return config
}

const logInDebug = (message) => {
  if (process.env.DEBUG) {
    console.log(message)
  }
}
