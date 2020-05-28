/*
 * Copyright 2020 balena.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

module.exports = {
  updateVersion: 'update-version-file',

  getChangelogDocumentedVersions: {
    preset: 'changelog-headers',
    clean: /v/
  },

  getIncrementLevelFromCommit: (commit) => {
    return 'patch'
  },
  incrementVersion: (version, incrementLevel) => {
    const v = version
      .replace(/^v/, '')
      .split('.');
    if (v.length !== 3) {
      throw new Error(`invalid version: ${version}`);
    }
    v[2] = Number(v[2]) + 1;
    return v.join('.');
  },

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
};
