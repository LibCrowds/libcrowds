# Development

{{ book.brand }} is fundamentally a Vue.js Server-Side Rendered (SSR) UI that communicates with a [PYBOSSA](https://github.com/Scifabric/pybossa) backend.

## Installation

Install [Node.js >=8.0.0](https://nodejs.org/en/), then:

``` bash
# install dependencies
npm install
```

You will also need to install an instance of [PYBOSSA](http://docs.pybossa.com/).

## Configuration

To run {{ book.brand }} with default settings:

``` bash
cp local.config.js.tmpl local.config.js
```

See the [Configuration](configuration.md) section for full details of how to edit this file.

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
For cookies to be read properly you must access the website at http://127.0.0.1:8080, rather than http://localhost:8080.
{% endhint %}

## Testing

``` bash
# run lint
npm lint

# run unit tests
npm unit

# run all tests
npm test
```

## Documenting

To build and serve this documentation locally:

``` bash
# install dependencies
gitbook install

# serve at 127.0.0.1:4000
gitbook serve
```