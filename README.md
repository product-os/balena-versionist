# balena-versionist

Balena versionist is an utility built around versionist to inject a custom configuration based
on the project type.

It exports a function `runBalenaVersionst(path: string)` which will check for a `repo.yml` at
the specified path, if one is found and it contains a valid `type`, a custom versionist.conf.js file will be generated and injected before calling `versionist`. If no `repo.yml` is found, it will call `versionist` with no config argument.

The module can also be used as a CLI tool by calling `balena-versionist [path]` (defaults to `cwd`)

Note that `versionist` is not included as a dependency in `balena-versionist` (yet) and must be installed separately to work.

## repo.yml

The `repo.yml` accepts the following options:

```
type: string
upstream:
  - repo: string
    url: string
publishMetadata: bool
release: 'github' | 'none'
sentry:
  org: string
  team: string
  type: string
triggerNotification:
  version: string
  stagingPercentage: number
```

### type (required)
Each folder in `repo-type-mappings` corresponds to a valid type; each folder contains the configuration that will be injected and a list of the node dependencies needed by the custom config.

### upstream (optional)
The list of upstreams is interpolated in the versionist configuration file and used to populate nested changelogs, the field can be omitted if there is no upstream that supports nested changelogs.

### release (optional)
Enum of possible release targets, currently only supports `github`. If set, a github draft release will be built for each PR (generated artefacts depend on the project type); on merge the release will be published.

### publishMetadata (optional)
If set to true, a file called `scrutinizer.json` will be published on the `gh-pages` branch of the repo on merge, this file contains information about the state of the repo that can be consumed by other tools

### sentry (optional)
If this entry is set, each PR will create a corresponding sentry project and expose the DSN token to the build.

### triggerNotification (optional)
This field is electron specific. If set in a meta-PR it will update the latest.yml files for the release matching the specified version with the stagingPercentage value (defaults to 100).

An example of a valid configuration is:

```
type: generic
upstream:
  - repo: balena-versionist
    url: https://github.com/balena-io/balena-versionist
publishMetadata: true
```
