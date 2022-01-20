'use strict';

module.exports = {

  updateVersion: 'update-version-file',

  getIncrementLevelFromCommit: (commit) => {
    return 'patch'
  },

  template: 'default',
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
  }
};
