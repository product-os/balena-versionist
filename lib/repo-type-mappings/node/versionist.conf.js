'use strict';

module.exports = {
  template: 'oneline',
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
