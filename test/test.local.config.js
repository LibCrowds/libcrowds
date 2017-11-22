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
    host: 'http://example.com'
  },
  license: 'CC0',
  githubUrl: 'https://github.com/Organization/repo'
}

config.docs = 'http://docs.example.com'

config.footer = {
  title: 'Newsletter',
  items: [
    { text: 'Sign up', url: 'http://mailchimp.signup.url' }
  ]
}

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
