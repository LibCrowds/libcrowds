# Development

{{ brand }} is fundamentally a Vue.js Server-Side Rendered (SSR) UI that communicates with a [PYBOSSA](https://github.com/Scifabric/pybossa) backend.

## Installation

Install [Node.js >=5.0.0](https://nodejs.org/en/), then:

``` bash
# install dependencies
npm install
```

You will also need to install and run a PYBOSSA server, according to the [documentation](http://docs.pybossa.com/en/latest/).

## Configuration

To run the server with default settings you can make a copy of the template settings file:

```bash
cp local.config.js.tmpl local.config.js
```

Now, see the [Configuration](configuration.md) section for full details of how to use this file to configure the site.

You will also need to change a few things in your PYBOSSA settings file:

``` python
# To allow requests from {{ brand }} (modify origins according to your environment)
CORS_RESOURCES = {
  r"/*": {
    "origins": [
      "http://127.0.0.1:8080"
    ],
    "allow_headers": [
      'Content-Type',
      'Authorization',
      'X-CSRFToken'
    ],
    "supports_credentials": True
  }
}

# Additional domain object info fields
CATEGORY_INFO_PUBLIC_FIELDS = ['collection', 'location']
CATEGORY_INFO_PUBLIC_FIELDS = ['announcements']

# Avoid 404 errors when accessing URLs with or without a trailing slash
STRICT_SLASHES = False

# Specify an SPA frontend
SPA_SERVER_NAME = 'http://127.0.0.1:8080'

# Allow projects to be published with no traditional presenter
DISABLE_TASK_PRESENTER = True
```

{% hint style='warning' %}
The settings above are all required for the application to run correctly.
{% endhint %}

## Building

To build locally:

``` bash
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# serve with hot reload at 127.0.0.1:8080
npm run dev
```

{% hint style='warning' %}
Note that for cookies to be read properly you must access the website at http://127.0.0.1:8080, rather than http://localhost:8080.
{% endhint %}

## Testing

To run tests:

``` bash
# run lint
npm lint

# run unit tests
npm unit

# run all tests
npm test
```

{% hint style='info' %}
Unit tests are run using Jest and the **npm unit** command accepts any of the [Jest CLI options](https://facebook.github.io/jest/docs/en/cli.html#options) by prefixing them with an extra **--** (e.g. npm run unit -- --coverage)
{% endhint %}
