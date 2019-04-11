'use strict';

module.exports = {

  updateVersion: 'update-version-file',

  getIncrementLevelFromCommit: (commit) => {
    return 'patch'
  },

  template: 'nested-changelogs'
};
