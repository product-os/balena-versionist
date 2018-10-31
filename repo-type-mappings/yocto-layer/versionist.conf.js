/*
 * Copyright 2018 resin.io
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

// Update verison info in `meta-resin-common/conf/distro/include/balena-os.inc`
const metaUpdate = (cwd, version, callback) => {
  return exec(`sed -i 's/^DISTRO_VERSION = ".*"/DISTRO_VERSION = "${version}"/g' meta-resin-common/conf/distro/include/balena-os.inc`, {
    encoding: 'utf8',
  }, callback);
};

module.exports = {
  updateVersion: metaUpdate,
  
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

  // Always add the entry to the top of the Changelog, below the header.
  addEntryToChangelog: {
    preset: 'prepend',
    fromLine: 2
  },

  template: 'nested-changelogs'

};
