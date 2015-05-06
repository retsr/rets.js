# rets.js [![Travis](https://img.shields.io/travis/retsr/rets.js.svg)](https://travis-ci.org/retsr/rets.js) [![Coverage Status](https://coveralls.io/repos/retsr/rets.js/badge.svg?branch=master)](https://coveralls.io/r/retsr/rets.js?branch=master)

> Simplified RETS Node Client

This package aims to simplify interacting with Real Estate Transaction Standard (RETS) compliant servers using Node.js and some
features we've come to expect from Node libraries like events and streaming while trying to rely as little as possible on none-js
dependencies. A secondary but still important goal is to keep the code as simple to read as possible to help developers understand
the RETS Specification and the library itself.

## Motivation

Rets.js is an effort to bring a properly functioning and performant libRETS implementation to the Node.js community.
This library is _not_ a libRETS wrapper, but seeks to provide a similar API interface while offering additional feature support
that Node.js developers have come to rely on.

## Install

    npm install --save rets.js

## Testing

    npm run test-watch

### Test targets

By default, testing using nock to intercept and simulate known RETS server responses. However, it is nice to also
test against your own live RETS servers. To enable additional tests against your server, rename ./test/servers.json.dist to ./test/servers.json
and add your own server path and credentials.

## Examples

You can find a number of examples in the [examples](examples) directory

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details on submitting patches and the contribution workflow.

## License

See [LICENSE](LICENSE)
