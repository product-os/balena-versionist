'use strict';

const path = require('path')
const fs = require('fs')

const updateVersionFile = (cwd, version, callback) => {
  const versionFile = path.join(cwd, 'VERSION')

  fs.writeFile(versionFile, version, callback)
}

module.exports = {

  updateVersion: 'update-version-file',

  // Always add the entry to the top of the Changelog, below the header.
  addEntryToChangelog: {
    preset: 'prepend',
    fromLine: 3
  },

  template: 'nested-changelogs'
};