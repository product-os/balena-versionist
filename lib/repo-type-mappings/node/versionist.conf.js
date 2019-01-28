'use strict';

module.exports = {
  template: [
    '{{=<% %>=}}',
    '{{#*inline "commits"}}',
    '{{nesting}} {{version}} - {{moment date "Y-MM-DD"}}',
    '',
    '{{#each commits}}',
      '{{#if this.author}}',
        '* {{this.subject}} [{{this.author}}]',
      '{{else}}',
        '* {{this.subject}}',
      '{{/if}}',
      '{{> nested nesting=../nesting}}',
    '{{/each}}',
    '{{/inline}}',

    '{{#*inline "nested"}}',
      '{{#if this.nested}}',
        '',
        '<details>',
          '<summary> View details </summary>',
          '{{#each this.nested}}',
            '',
            '{{> commits nesting=(append ../nesting "#")}}',
          '{{/each}}',
        '</details>',
        '',
      '{{/if}}',
    '{{/inline}}',

    '{{> commits nesting="##"}}',
    '<%={{ }}=%>'
  ].join('\n'),
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
