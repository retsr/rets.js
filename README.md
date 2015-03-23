# rets.js [![Travis](https://img.shields.io/travis/retsr/rets.js.svg)](https://travis-ci.org/retsr/rets.js) [![Coverage Status](https://coveralls.io/repos/retsr/rets.js/badge.svg?branch=master)](https://coveralls.io/r/retsr/rets.js?branch=master)

Simplified RETS Node Client

## Motivation

Rets.js is an effort to bring a properly functioning and performant libRETS implementation to the Node.js community.
This library is _not_ a libRETS wrapper, but seeks to provide a similar API interface while offering additional feature support
that Node.js developers have come to rely on.

### Node.js features

	* Event driven
	* Non-blocking
	* Stream support

## Install

    npm install --save rets.js

## Contributing

Feel free to fork and send Pull Requests.

## Testing

    npm run test-watch

### Test targets

By default, testing using nock to intercept and simulate known RETS server responses. However, it is nice to also
test against your own live RETS servers. To enable additional tests against your server, rename ./test/servers.json.dist to ./test/servers.json
and add your own server path and credentials.

## License

See [LICENSE](LICENSE)
