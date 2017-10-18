# Configuration

The [Site Configuration](configuration.md#site-configuration) contains general options applied to the core interface.

To run the application with default settings:

```bash
cp local.config.js.tmpl local.config.js
```

This file can now be edited as required.

### analytics

[Google Analytics](https://analytics.google.com) can be added to the site via the `analytics` property.

```js
localConfig.analytics = 'UA-XXX-X'
```

### brand

The `brand` will appear throughout your site.

```js
localConfig.brand: 'My Brand'
```

### company

The `company` responsible for the site.

```js
localConfig.company: 'My Company'
```

### contact

The `contact` information will appear in the site footer.

```js
localConfig.contact = {
  email: 'me@example.com',
  twitter: 'mytwitterhandle'
}
```

### description

The `description` will appear on the site homepage and form its meta description.

```js
localConfig.description: 'My SEO optimised meta description'
```

### githubUrl

The `githubUrl` will appear in the site footer.

```js
localConfig.githubUrl = 'https://github.com/github'
```

### logo

An absolute path to the `logo`, which should be an SVG file and will be displayed on each microsite homepage.

```js
const path = require('path')
localConfig.logo = path.resolve(`./company-logo.svg`)
```

### mapbox

[Mapbox](https://www.mapbox.com/) is used to present any maps present on the site and can be configured via the `mapbox` property.

```js
localConfig.mapbox = {
  id: 'mapbox.streets',
  publicApiToken: 'token'
}
```

### pybossa

The `host` and `timeout` used for all PYBOSSA API calls.

```js
localConfig.pybossa = {
  host: 'https://pybossa.backend.com',
  timeout: 10000
}
```

### sentryPublicDsn

The `sentryPublicDsn` property is used to configure [Sentry](https://sentry.io/) error tracking.

```js
localConfig.sentryPublicDsn = 'https://******@sentry.io/<project>'
```

### tagline

The `tagline` will appear on the site homepage.

```js
localConfig.tagline: 'My inspiring tagline'
```
