## Configurating LibCrowds

After [configuring PYBOSSA](configuration/pybossa.md), you can get LibCrowds up
and running by making a copy of the settings template:

```bash
cp local.config.js.tmpl local.config.js
```

All of the available settings are described below.

### Required Settings

The following are required for the application to run correctly.

| Setting       | Description                                                  |
|---------------|--------------------------------------------------------------|
| company       | The company responsible for the platform.                    |
| brand         | The name of the platform.                                    |
| tagline       | An inspiring tagline.                                        |
| description   | An SEO optimised description of the platform.                |
| pybossaHost   | The host for all PYBOSSA API calls.                          |
| libcrowdsHost | The host where this application will be deployed             |

### Optional Settings

The following can be added to enable additional functionality.

### analytics

Add [Google Analytics](https://analytics.google.com) to the platform by
providing your tracking ID.

```js
config.analytics = {
  ua: 'UA-XXX-X'
}
```

This will enable
[event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
for the following events:

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
a given time.

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

### email

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

### twitter

Adds a twitter link to the main footer and enhances the platforms Twitter cards
with `twitter:site` meta tag.

```js
config.twitter = 'mytwitterhandle'
```
