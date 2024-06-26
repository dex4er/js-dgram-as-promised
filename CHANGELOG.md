# Changelog

## v6.0.0 2024-06-22

- Converted to ESM module.
- Requires Node >= 16.
- `addMembership`, `setBroadcast`, `setTTL`, `setMulticastTTL`,
  `setMulticastInterface`, `setMulticastLoopback`, `dropMembership`,
  `setRecvBufferSize`, `setSendBufferSize` and `destroy` return `this`.
- `address` method doesn't return `string` anymore; closes:
  dex4er/js-dgram-as-promised#51
- `setTimeout` method sets timeout for `recv` method; closes:
  dex4er/js-dgram-as-promised#55

## v5.0.1 2020-10-16

- Library works without enabled `"esModuleInterop"` options. Fixes #38.

## v5.0.0 2020-10-16

- `recv` returns `undefined` when socket is closed.
- New `iterate` method returns asynchrounous iterator.
- New `destroy` method cleans internal listeners.

## v4.0.0 2020-10-15

- `bind` method rejects on error. Fixes #42.
- `recv` method resolves on `message` event. Fixes #39.
- Requires Node >= 10.
- Uses eslint instead of tslint.

## v3.0.3 2019-10-08

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
