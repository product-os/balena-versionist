'use strict';

const fs = require('fs')
const path = require('path')
const semver = require('semver')
const yaml = require('js-yaml')


module.exports = {

  getChangelogDocumentedVersions: {
    preset: 'changelog-headers',
    clean: /^v/
  },

  incrementVersion: (currentVersion, incrementLevel) => {
    if (!semver.valid(currentVersion)) {
      throw new Error(`Invalid version: ${currentVersion}`);
    }
    const incrementedVersion = semver.inc(currentVersion, incrementLevel);
    if (!incrementedVersion) {
      throw new Error(`Invalid increment level: ${incrementLevel}`);
    }
    try {
      const contractVersion = yaml.load(fs.readFileSync('contract.yaml', 'utf8')).version
      console.error(contractVersion)
      console.error(incrementedVersion)
      return semver.gt(incrementedVersion, contractVersion) ? incrementedVersion : contractVersion
    } catch (e) {
      console.log('No contract version found. Defaulting to incremented Version')
      console.error(e)
      return incrementedVersion
    }
  },
  updateVersion: 'update-version-file',

  transformTemplateDataAsync: {
    preset: 'nested-changelogs',
    upstream: [
      {{#upstream}}
      {
        pattern: '{{{pattern}}}',
        repo: '{{repo}}',
        owner: '{{owner}}',
        ref: '{{ref}}'
      },
      {{/upstream}}
    ]
  },

  template: 'default'
}
