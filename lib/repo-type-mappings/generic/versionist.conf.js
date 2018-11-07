'use strict';

const path = require('path')
const fs = require('fs')

const updateVersionFile = (cwd, version, callback) => {
  const versionFile = path.join(cwd, 'VERSION')

  fs.writeFile(versionFile, version, callback)
}

module.exports = {

  updateVersion: 'update-version-file',

  template: 'nested-changelogs'
};