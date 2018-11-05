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
```

Each folder in `repo-type-mappings` corresponds to a valid type; each folder contains the configuration that will be injected and a list of the node dependencies needed by the custom config.

The list of upstreams is interpolated in the versionist configuration file and used to populate nested changelogs, the field can be omitted if there is no upstream that supports nested changelogs.

An example of a valid configuration is:

```
type: generic
upstream:
  - repo: balena-versionist
    url: https://github.com/balena-io/balena-versionist
```