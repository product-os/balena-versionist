/*
 * Copyright 2022 Balena Ltd.
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
const exec = require('child_process').exec;
const path = require('path');

// Update verison info in `pyproject.toml` by
// replacing the first `version = "..."` occurrence immediately after `[tool.poetry]`
const pypoetry = (cwd, version, callback) => {
  const pyprojectToml = path.join(cwd, 'pyproject.toml');
  return exec(`sed -i '/\[tool\.poetry\]/,/^version = ".*"/  s/^version = ".*"/version = "${version}"/g' ${pyprojectToml}`,
  {
    encoding: 'utf8',
  }, callback);
};

module.exports = {
  updateVersion: pypoetry,

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
};
