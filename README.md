# rets.js

[![npm](https://img.shields.io/npm/l/rets.js.svg)](LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/retsr/rets.js.svg)](https://github.com/retsr/rets.js/network)
[![GitHub stars](https://img.shields.io/github/stars/retsr/rets.js.svg)](https://github.com/retsr/rets.js/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/retsr/rets.js.svg)](https://github.com/retsr/rets.js/issues)
[![Travis](https://img.shields.io/travis/retsr/rets.js.svg)](https://travis-ci.org/retsr/rets.js)
[![Coverage Status](https://coveralls.io/repos/retsr/rets.js/badge.svg?branch=master)](https://coveralls.io/r/retsr/rets.js?branch=master)

Simplified RETS Node Client

## Motivation


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
