const config = {
  company: 'My Company',
  brand: 'My Brand',
  tagline: 'My inspiring tagline',
  description: 'My SEO optimised meta description',
  pybossaHost: 'http://example.com'
}

// Twitter
config.twitter = 'mytwitterhandle'

// Contact email address
config.email = 'me@example.com'

// GitHub account
config.github = 'https://github.com/LibCrowds/libcrowds'

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
