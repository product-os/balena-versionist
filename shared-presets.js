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

module.exports = {
  // If a 'changelog-entry' tag is found, use this as the subject rather than the
  // first line of the commit.
  transformTemplateDataAsync: {
    preset: 'upstreams',
    upstream: [
      {{#upstream}}
      {
        pattern: '{{pattern}}',
        repo: '{{repo}}',
        ref: '{{ref}}'
        owner: '{{owner}}',
      },
      {{/upstream}}
    ]
  },
  {{=<% %>=}}
  template: 'nested-changelogs'
};
