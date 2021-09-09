'use strict';

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const semver = require('balena-semver')
const shell = require('shelljs')

const getMetaResinFromSubmodule = (documentedVersions, history, callback) => {
  // This is a hack because git does not update all the relevant files when moving a
  // submodule. Because of this, older repos will still have references to meta-resin
  // and new ones will refer to meta-balena
  const metaName = fs.existsSync('.git/modules/layers/meta-resin', fs.constants.R_OK)
    ? 'meta-resin'
    : 'meta-balena'
  shell.exec(`git --git-dir .git/modules/layers/${metaName} describe --tags --exact-match`, (code, stdout, stderr) => {
    if (code != 0) {
      return callback(new Error(`Could not find ${metaName} submodule`))
    }
    const match = stdout.replace(/\s/g,'').replace(/^v/g, '')

    if (!match) {
      return callback(new Error(`Could not determine ${metaName} version from version ${stdout}`))
    }

    const metaVersion = `${match}+rev0`
    const latestDocumented = _.trim(_.last(documentedVersions.sort(semver.compare)))

    // semver.gt will ignore the revision numbers but still compare the version
    // If metaVersion <= latestDocumented then the latestDocumented version is a revision of the current metaVersion
    const latestVersion = semver.gt(metaVersion, latestDocumented) ? metaVersion : latestDocumented

    return callback(null, latestVersion)
  })
}

module.exports = {
  addEntryToChangelog: {
    preset: 'prepend',
    fromLine: 3
  },
  getChangelogDocumentedVersions: {
    preset: 'changelog-headers',
    clean: /^v/
  },

  includeCommitWhen: 'has-changelog-entry',
  getIncrementLevelFromCommit: (commit) => {
    return 'patch'
  },
  incrementVersion: (currentVersion, incrementLevel) => {
    const revision = Number(currentVersion.split('+rev')[1])
    if (!_.isFinite(revision)) {
      throw new Error(`Could not extract revision number from ${currentVersion}`)
    }
    return currentVersion.slice(0, currentVersion.length - 1) + (revision + 1)
  },
  getCurrentBaseVersion: getMetaResinFromSubmodule,
  updateVersion: 'update-version-file',

  transformTemplateDataAsync: {
    preset: 'nested-changelogs',
    upstream: [
      {{#upstream}}
      {
        pattern: '{{pattern}}',
        repo: '{{repo}}',
        owner: '{{owner}}',
        ref: '{{ref}}'
      },
      {{/upstream}}
    ]
  },

  template: 'default'
}
