# Configuration

## Configuring PYBOSSA

You will need to change a few things in your PYBOSSA settings file for the frontend to work correctly:

``` python
# To allow requests from the frontend (modify origins according to your environment)
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

# Additional category fields
CATEGORY_INFO_PUBLIC_FIELDS = [
  'tagline',
  'forum',
  'presenter',
  'license',
  'published',
  'content',
  'terminology',
  'background'
]

# Additional user fields
USER_INFO_PUBLIC_FIELDS = [
  'announcements'
]

# Avoid 404 errors when accessing URLs with or without a trailing slash
STRICT_SLASHES = False

# Specify an SPA frontend
SPA_SERVER_NAME = 'http://127.0.0.1:8080'

# Allow projects to be published with no traditional task presenter
DISABLE_TASK_PRESENTER = True
```

{% hint style='danger' %}
The settings above are all required for the application to run correctly.
{% endhint %}

## Configuring LibCrowds

The configuration settings below are applied to the core interface.

```bash
# Copy the template
cp local.config.js.tmpl local.config.js
```

### analytics

[Google Analytics](https://analytics.google.com) can be added to the site via the `analytics` property.

```js
config.analytics = {
  ua: 'UA-XXX-X'
}
```

### brand

The `brand` will appear throughout your site.

```js
config.brand: 'My Brand'
```

### company

The `company` responsible for the site.

```js
config.company: 'My Company'
```

### contact

The `contact` information will appear in the site footer.

```js
config.contact = {
  email: 'me@example.com',
  twitter: 'mytwitterhandle'
}
```

### description

The `description` will appear on the site homepage and form its meta description.

```js
config.description: 'My SEO optimised meta description'
```

### githubUrl

The `githubUrl` will appear in the site footer.

```js
config.githubUrl = 'https://github.com/github'
```

### logo

An absolute path to the `logo`, which should be an SVG file and will be displayed on each microsite homepage.

```js
const path = require('path')
config.logo = path.resolve(`./company-logo.svg`)
```

### mapbox

[Mapbox](https://www.mapbox.com/) is used to present any maps present on the site and can be configured via the `mapbox` property.

```js
config.mapbox = {
  id: 'mapbox.streets',
  publicApiToken: 'token'
}
```

### pybossa

The `host` and `timeout` used for all PYBOSSA API calls.

```js
config.pybossa = {
  host: 'https://pybossa.backend.com',
  timeout: 10000
}
```

### sentry

[Sentry](https://sentry.io/) error tracking can be enabled via the `sentry` property.

```js
config.sentry = {
  public_key: '',
  private_key: '',
  project_id: ''
}
```

{% hint style='info' %}
The LibCrowds release and commit running on the server when the error was thrown will be appended automatically.
{% endhint %}

### tagline

The `tagline` will appear on the site homepage.

```js
config.tagline: 'My inspiring tagline'
```
