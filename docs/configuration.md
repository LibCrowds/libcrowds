# Configuration

There are two main parts to the vue-pybossa-frontend configuration; the [Site Configuration](configuration.md#core-configuration), which contains general options applied to whole of the frontend, and the [Microsite Configuration](configuration.md#microsite-configuration), which contains more specific options for each microsite.

Note that the configuration settings found here relate to the overall structure and appearance of the site. Anything to do with modifying individual projects or categories is probably handled via the [Admin Interface](admin.md).

## Directory Structure

Apart from the location of the `siteConfig.js` file, vue-pybossa-frontend does not enforce a particular directory structure. Rather, any additional configuration files can be placed in the `custom` directory and linked to via `siteConfig.js`.

Below is an example directory structure.

```
├── src
    ├── siteConfig.js               # Main site configuration
    └── custom
        └── collections
            └── my_collection
                ├── config.js       # The collection config
                ├── background.jpg  # Some additional asset
                └── about
                    └── ...         # Markdown for the about page
            └── ...
```

## Site Configuration

The site configuration is required for vue-pybossa-frontend to run.

To run the frontend with default settings:

```bash
cp src/siteConfig.js.tmpl src/siteConfig.js
```

This file can now be edited as required.

### analytics

[Google Analytics](https://analytics.google.com) can be added to the site via the `analytics` property.

```js
siteConfig.analytics = 'UA-XXX-X'
```

### brand

The `brand` will appear throughout your site.

```js
siteConfig.brand: 'My Brand'
```

### collections

The `collections` property is used to establish the two-way binding between the site configuration and each microsite configuration. Each key must be the same as the [`key`](configuration.md#key) that appears in the linked microsite configuration.

```js
siteConfig.collections = {
  my_collection: require(`./custom/collections/my_collection/config.js`)
}
```

### company

The `company` responsible for the site.

```js
siteConfig.company: 'My Company'
```

### contact

The `contact` information will appear in the site footer.

```js
siteConfig.contact = {
  email: 'me@example.com',
  twitter: 'mytwitterhandle'
}
```

### dataLicense

The `dataLicense` specifies the rights information for all data collected via the site.

```js
siteConfig.dataLicense: {
  name: 'CC0',
  url: 'https://creativecommons.org/publicdomain/zero/1.0/'
}
```

### description

The `description` will appear on the site homepage and form its meta description.

```js
siteConfig.description: 'My SEO optimised meta description'
```

### githubUrl

The `githubUrl` will appear in the site footer.

```js
siteConfig.githubUrl = 'https://github.com/github'
```

### logo

The `logo`, which should be an SVG file, will be displayed on each microsite homepage.

```js
siteConfig.logo = require(`./company-logo.svg`)
```

### mapbox

[Mapbox](https://www.mapbox.com/) is used to present any maps present on the site and can be configured via the `mapbox` property.

```js
siteConfig.mapbox = {
  id: 'mapbox.streets',
  publicApiToken: 'token'
}
```

### pybossaHost

The `pybossaHost` is used for all PYBOSSA API calls.

```js
siteConfig.pybossaHost = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:5000'
  : 'https://pybossa.backend.com',
```

### sentryPublicDsn

The `sentryPublicDsn` property is used to configure [Sentry](https://sentry.io/) error tracking.

```js
config.sentryPublicDsn = 'https://******@sentry.io/<project>'
```

### tagline

The `tagline` will appear on the site homepage.

```js
siteConfig.tagline: 'My inspiring tagline'
```

## Microsite Configuration

Each microsite configuration is used to define the appearance and behaviour of a microsite.

### about

The `about` property is used to provide a series of Markdown files that form the content for the about page.

```js
micrositeConfig.about = {
  intro: require(`./about/intro.md`),
  subsections: [
    {
      id: 'contact',
      title: 'Contact',
      markdown: require(`./about/contact.md`)
    }
}
```

### bgImg

The `bgImg` is the main background image used across the microsite.

```js
micrositeConfig.bgImg: require(`./background.jpg`)
```

### description

The `description` appears on the microsite homepage, as well as in its [meta description](https://moz.com/learn/seo/meta-description).

```js
micrositeConfig.description: 'My SEO optimised meta description'
```

### forumUrl

The `forumUrl` will be linked to from the microsite's navbar.

```js
micrositeConfig.forumUrl: 'http://community.example.com/t/my_collection'
```

### key

The `key` is used to establish the two-way binding between the core and the microsite configuration files. This key must also appear in the core site configuration's [`collections`](configuration.md#collections) property where its value must link to this microsite configuration file.

```js
micrositeConfig.key = 'my_collection'
```

### name

A `name` for the microsite.

```js
micrositeConfig.name = 'My Amazing Name'
```

### tagline

The `tagline` will appear on the microsite homepage.

```js
micrositeConfig.tagline = 'My inspiring tagline'
```

### terminology

The microsite's `terminology` for categories, projects, tasks and task runs.

```js
micrositeConfig.terminology = {
  category: 'category',
  project: 'project',
  task: 'task',
  taskRun: 'task run'
}
```
