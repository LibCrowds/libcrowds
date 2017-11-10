# Configuration

This section describes the core configuration settings required to run an instance of {{ book.brand }}.

## Configuring PYBOSSA

You will need to change a few things in your PYBOSSA settings file:

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

# Additional project fields
PROJECT_INFO_PUBLIC_FIELDS = [
  'tags'
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

To use the settings template:

```bash
# Copy the template
cp local.config.js.tmpl local.config.js
```

### analytics

Add [Google Analytics](https://analytics.google.com).

```js
config.analytics = {
  ua: 'UA-XXX-X'
}
```

### brand

Establish the brand.

```js
config.brand: 'My Brand'
```

### company

Specify the company responsible for the site.

```js
config.company: 'My Company'
```

### contact

Specify contact information.

```js
config.contact = {
  email: 'me@example.com',
  twitter: 'mytwitterhandle'
}
```

### description

Describe the overall purpose of the site.

```js
config.description: 'My SEO optimised meta description'
```

### docs

A URL to the platform's documentation.

```js
config.docs: 'http://docs.example.com'
```

### footer

Add an additional list menu to the main footer.

```js
config.footer = {
  title: 'Newsletter',
  items: [
    { text: 'Sign up', url: 'http://mailchimp.signup.url' }
  ]
}
```

### githubUrl

Provide a GitHub link that relates to the site.

```js
config.githubUrl = 'https://github.com/github'
```

### mapbox

Use [Mapbox](https://www.mapbox.com/) to present any maps present on the site.
```js
config.mapbox = {
  id: 'mapbox.streets',
  publicApiToken: 'token'
}
```

### pybossa

Set the connection details for all PYBOSSA API calls.

```js
config.pybossa = {
  host: 'https://pybossa.backend.com'
}
```

### sentry

Enable [Sentry](https://sentry.io/) error tracking.

```js
config.sentry = {
  public_key: '',
  private_key: '',
  project_id: ''
}
```

### tagline

Add an inspiring tagline.

```js
config.tagline: 'My inspiring tagline'
```
