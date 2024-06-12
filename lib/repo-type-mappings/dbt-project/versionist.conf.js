/*
 * Copyright 2024 Balena Ltd.
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

// Update version info in `dbt_project.yml` by
// replacing the first `version: "..."` occurrence in the file
const updateDbtProjectVersion = (cwd, version, callback) => {
  const dbtProjectYml = path.join(cwd, 'dbt_project.yml');
  return exec(`sed -i '/^version:/ s/version: .*/version: "${version}"/' ${dbtProjectYml}`,
  {
    encoding: 'utf8',
  }, callback);
};

module.exports = {
  updateVersion: updateDbtProjectVersion,

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
