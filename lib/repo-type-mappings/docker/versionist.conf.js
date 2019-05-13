'use strict';

module.exports = {
  updateVersion: 'mixed',
  template: 'nested-changelogs',
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
  }
};
