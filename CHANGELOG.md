# Changelog

## v3.0.2 2019-10-08

- Use `mocha-steps` and `cross-env` for testing.

## v3.0.2 2019-07-10

- Updated depencencies.

## v3.0.1 2019-06-04

- Minor tweaks in README.
- Added source map to the package.

## v3.0.0 2019-05-08

- Typings compatible with Node v12.
- This module now exports default `DgramAsPromised` class whith `createSocket`
  as a static method.
- `address` method returns `AddressInfo | string`.
- `send` method accepts `Uint8Array`.

## v2.0.0 2018-09-09

- Rewritten in Typescript.
- Requires Node >= 6.
- Additional `dgram` option for `createSocket`.

## v1.0.6 2018-07-15

- jsdoc

## v1.0.5 2018-07-15

- npm audit clean

## v1.0.4 2018-05-09

- Adapt Typescript typings to Node 10.

## v1.0.3 2018-04-03

- Use `mock-require` and mocked `dgram` module for tests.

## v1.0.2 2018-03-19

- Tweak README file.

## v1.0.1 2018-03-19

- Bugfix for `bind` method.

## v1.0.0 2017-10-23

- Do not use `any-promise`.
- `bind` method accepts address and port options and resolves to address info.
- `send` method resolves to number of sent bytes.
- The rest of `dgram` methods have been implemented.
- For Node < 6 `--harmony` flag is required.
- Typescript typings.

## v0.1.2 2017-06-22

- Upgrade: chai@4.0.2, standard@10.0.2, tap@10.5.1, tap-given@0.4.1
- Use snazzy and chai-as-promised for tests.

## v0.1.1 2017-02-19

- Upgraded tap-given

## v0.1.0 2017-02-18

- ES6
- BDD tests
- Relicensed to MIT

## v0.0.2 2016-07-31

- Corrected README and LICENSE

## v0.0.1 2016-07-31

- Initial release
