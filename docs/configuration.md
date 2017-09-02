# Configuration

This section describes how to configure an instance of vue-pybossa-frontend.
There are two main parts to the configuration; the
[Site Configuration](configuration.md#site-configuration), which
contains general options applied to whole of the frontend,
and the [Collection Configuration](configuration.md#collection-configuration),
which contains more specific options for each project collection.

Note that individual projects and categories are configured via the
[Admin Interface](admin.md).

## Directory structure

Apart from the location of the `siteConfig.js` file, vue-pybossa-frontend
does not enforce a particular directory structure. Rather, all additional
configuration files can be placed in the `custom` directory and linked to via
`siteConfig.js`.

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

The site configuration is required for vue-pybossa-frontend to run. To run the
frontend with default settings:

```bash
cp src/siteConfig.js.tmpl src/siteConfig.js
```

This file can now be edited as required.

### analytics

[Google Analytics](https://analytics.google.com) can be added to the site via
the `analytics` property.

```js
siteConfig.analytics = 'UA-XXX-X'
```

### brand

The `brand` will appear throughout your site.

```js
siteConfig.brand: 'My Brand'
```

### collections

The `collections` property is used to establish the two-way binding between
the site configuration and each collection configuration. Each key must be the
same as the [`key`](configuration.md#key) that appears in the linked collection
configuration.

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

The `dataLicense` specifies the rights information for all data collected via
the site.

```js
siteConfig.dataLicense: {
  name: 'CC0',
  url: 'https://creativecommons.org/publicdomain/zero/1.0/'
}
```

### description

The `description` will appear on the site homepage and form its meta description.

```js
siteConfig.description: 'My SEO optimised meta description.'
```

### githubUrl

The `githubUrl` will appear in the site footer.

```js
siteConfig.githubUrl = 'https://github.com/MyOrganisation'
```

### mapbox

The [Mapbox](https://www.mapbox.com/) configuration is set using the `mapbox`
property and is used to setup any maps displayed on the site.

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

The `sentryPublicDsn` property is used to configure
[Sentry](https://sentry.io/) error tracking.

config.sentryPublicDsn = 'https://******@sentry.io/<project>'

### tagline

The `tagline` will appear on the site homepage.

```js
siteConfig.tagline: 'My inspiring tagline'
```

## Collection Configuration

The collection configuration is used to define the appearance and behaviour of
each set of collection pages.

### about

The `about` property can be used to provide a series of Markdown files used
to configure the about page.

```js
config.about = {
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

The `bgImg` will be used to provide a consistent theme for the collection pages.

```js
collectionConfig.bgImg: require(`./background.jpg`)
```

### description

The `description` will appear on the collection homepage and form its meta description.

```js
collectionConfig.description: 'My SEO optimised meta description.'
```

### forumUrl

The `forumUrl` will be linked to from the collection navbar.

```js
collectionConfig.forumUrl: 'http://community.example.com/t/my_collection'
```

### key

The `key` is used to establish the two-way binding between the site and collection
configuration files. This key must also appear in the site configuration's
[`collections`](configuration.md#collections) property where its value must link
to this collection configuration file.

```js
collectionConfig.key = 'my_collection'
```

### name

A `name` for the project collection.

```js
collectionConfig.name = 'My Amazing Name'
```

### tagline

The `tagline` will appear on the collection homepage.

```js
collectionConfig.tagline = 'My inspiring tagline'
```

### terminology

The collection's `terminology` for categories, projects, tasks and task runs.

```js
collectionConfig.terminology = {
  category: 'category',
  project: 'project',
  task: 'task',
  taskRun: 'task run'
}
```
