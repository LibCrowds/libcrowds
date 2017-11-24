# Configuration

This section describes the core configuration settings required to run an instance of {{ this.brand }}.

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

### Required Settings

The following settings are defined at the top of the template and are all
required for the application to run correctly.

| Setting     | Description                                                    |
|-------------|----------------------------------------------------------------|
| company     | The company responsible for the platform.                      |
| brand       | The name of the platform.                                      |
| tagline     | An inspiring tagline.                                          |
| description | An SEO optimised description of the platform.                  |
| pybossaHost | The host for all PYBOSSA API calls.                            |

### Optional Settings

The following settings, which are commented out in the template, can be added
to enable additional functionality on the platform.

### analytics

Add [Google Analytics](https://analytics.google.com) to the platform by
providing your tracking ID.

```js
config.analytics = {
  ua: 'UA-XXX-X'
}
```

[Event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
will be enabled for the following:

| Category      | Action          | Label           | Description                 |
|---------------|-----------------|-----------------|-----------------------------|
| Downloads     | {type}_{format} | Project name    | Data file is downloaded     |
| Statistics    | view            | Project name    | Project statistics viewed   |
| Contributions | {project name}  | Collection name | Answer submitted            |
| Sorts         | {sort value}    | Collection name | Main projects list sorted   |
| Filters       | {filter value}  | Collection name | Main projects list filtered |

Tracking these events can help to determine the content that your users are most
interested in. For example, monitoring the filters most used for a microsite can
help determine the types of project that should be prioritised for release at
any given time.

[Social interactions](https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions)
will be tracked using the social media 'Share' buttons present on the site.
However, note that this reports button clicks and does not guarantee that the
user actually then went ahead and shared the page.

User IDs are used to track all registered and authenticated users.

### docs

Provide a URL to the platform's documentation that will be linked to from the
main footer and all admin dashboard pages.

```js
config.docs: 'http://docs.example.com'
```

# email

Add a contact email address to the main footer.

```js
config.email = 'me@example.com'
```

### facebook

Add a [Facebook app ID](https://developers.facebook.com/docs/apps/register) to
enable [Open Graph](https://developers.facebook.com/docs/sharing/opengraph)
integration.

```js
config.facebook = {
  appId: '1234567890'
}
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

### github

Add a GitHub link to the main footer.

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

### sentry

Enable [Sentry](https://sentry.io/) error tracking.

```js
config.sentry = {
  public_key: '',
  private_key: '',
  project_id: ''
}
```

# twitter

Adds a twitter link to the main footer and enhances the platforms Twitter cards
with `twitter:site` meta tag.

```js
config.twitter = 'mytwitterhandle'
```
