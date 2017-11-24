# Development

LibCrowds is fundamentally a Vue.js Server-Side Rendered (SSR) UI that
communicates with a [PYBOSSA](https://github.com/Scifabric/pybossa) backend.

## Installation

Install [Node.js >=8.0.0](https://nodejs.org/en/), then:

``` bash
# install dependencies
npm install
```

You will also need to install an instance of
[PYBOSSA](http://docs.pybossa.com/).

## Configuration

See the [Configuration](configuration/README.md) section for full details of how
to setup LibCrowds and PYBOSSA.

## Building

``` bash
# build for production with minification
npm run build

# run in production
npm start

# serve for development with hot reload at 127.0.0.1:8080
npm run dev
```

{% hint style='danger' %}
For cookies to be read properly you must access the website at
http://127.0.0.1:8080, rather than http://localhost:8080.
{% endhint %}

## Testing

``` bash
# build (required for testing with nuxt components)
npm run build

# run lint
npm lint

# run unit tests
npm unit

# run all tests
npm test
```

## Deployment

It is important that the PYBOSSA instance is served from the same domain as
the LibCrowds instance. This is because the PYBOSSA session cookie needs to
be shared with LibCrowds and this will only work if both applications are
served from the same domain.

Subdomains are fine too, so you can still run your applications on different
servers, for example, at http://pybossa.myapp.com and http://libcrowds.myapp.com.

If you don't do this, the application will still run but as it will not be
possible to fully render certain pages on the server, so you will see some
strange behaviour to do with users appearing to not be signed in when the
application first loads.
