# Change Log

All notable changes to this project is documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

## [3.0.3]

This is a maintenance release that fixes security vulnerabilities in [lodash](https://www.npmjs.com/advisories/1065), [set-value](https://www.npmjs.com/advisories/1012) and [mixin-deep](https://www.npmjs.com/advisories/1013) developer dependencies.

## [3.0.2]

This is a maintenance release to update all third party development dependencies to the latest version. The functionality of the module is not affected by this change.

## [3.0.1]

This is a maintenance release to fix security vulnerabilities [CVE-2018-16487](https://nvd.nist.gov/vuln/detail/CVE-2018-16487) and [CVE-2018-16492](https://nvd.nist.gov/vuln/detail/CVE-2018-16492) in the `lodash` and `extend` dependencies. These packages are used only to build this module, so the functionality of this module should not be affected by this change at all.

## [3.0.0]

- BREAKING CHANGE: The `mocha` dependency is updated to `^6.0.1`, also the related `nyc` and `ts-node` packages are updated to their latest version. Due to a [bug](https://github.com/mochajs/mocha/issues/3763) in mocha the `mocha.opts` files are needed to be moved to the new `yml` format.

## [2.0.0]

- BREAKING CHANGE: Dropping support for NodeJS v6, CI pipelines are running on the current LTS version (now 10.15.0) and the latest version available on the CI platform. This change enables keeping third-party dependencies up-to-date.

## [1.0.2]

- The `aws-sdk` dependency is updated to `^2.312.0`.

## [1.0.1]

- Meeting CII Best Practices ["Passing" level](https://github.com/coreinfrastructure/best-practices-badge/blob/master/doc/criteria.md) criteria.

## [1.0.0]

First public release.
