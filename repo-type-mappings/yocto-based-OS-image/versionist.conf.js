'use strict';

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const semver = require('semver')
const shell = require('shelljs')

const compareExtendedSemver = (a, b) => {
  const semverCompare = semver.compare(a, b)
  if (semverCompare !== 0) {
    return semverCompare
  }
  return a.localeCompare(b)
}

const getMetaResinFromSubmodule = (documentedVersions, history, callback) => {
  shell.exec('git submodule status layers/meta-resin', (code, stdout, stderr) => {
    if (code != 0) {
      return callback(new Error('Could not find meta-resin submodule'))
    }
    const match = /.{40} .* \(v(.+)\)/.exec(stdout)

    if (!match) {
      return callback(new Error(`Could not determine meta-resin version from version ${stdout}`))
    }

    const metaVersion = `${match[1]}+rev0`
    const latestDocumented = _.trim(_.last(documentedVersions.sort(compareExtendedSemver)))

    // semver.gt will ignore the revision numbers but still compare the version
    // If metaVersion <= latestDocumented then the latestDocumented version is a revision of the current metaVersion
    const latestVersion = semver.gt(metaVersion, latestDocumented) ? metaVersion : latestDocumented

    return callback(null, latestVersion)
  })
}

const updateVersionFile = (cwd, version, callback) => {
  const versionFile = path.join(cwd, 'VERSION')

  fs.writeFile(versionFile, version, callback)
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
    const revision = Number(currentVersion[currentVersion.length - 1])
    if (!_.isFinite(revision)) {
      throw new Error(`Could not extract revision number from ${currentVersion}`)
    }
    return currentVersion.slice(0, currentVersion.length - 1) + (revision + 1)
  },
  getCurrentBaseVersion: getMetaResinFromSubmodule,
  updateVersion: updateVersionFile,

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

  template: 'nested-changelogs'
}