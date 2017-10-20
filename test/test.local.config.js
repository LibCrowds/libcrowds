const config = {
  company: 'My Company',
  brand: 'My Brand',
  tagline: 'My inspiring tagline',
  description: 'My SEO optimised meta description',
  contact: {
    twitter: 'mytwitterhandle',
    email: 'me@example.com'
  },
  pybossa: {
    host: 'http://example.com',
    timeout: 10000
  },
  license: {
    name: 'CC0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/'
  },
  githubUrl: 'https://github.com/Organization/repo'
}

// Company logo
// config.logo = require(`./company-logo.svg`)

// List of collection configurations
// config.collections = {
//   'default': {
//     name: 'My Amazing Project',
//     tagline: 'This project is amazing.',
//     description: 'Help enhance research.'
//   }
// }

// Mapbox configuration for location stats
// config.mapbox = {
//   id: 'mapbox.streets',
//   publicApiToken: 'token'
// }

// Sentry public DSN
// config.sentryPublicDsn = 'https://******@sentry.io/<project>'

// Google analytics tracking ID
// config.analytics = 'UA-XXX-X'

module.exports = config
