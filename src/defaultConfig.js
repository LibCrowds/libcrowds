const isDev = process.env.NODE_ENV === 'development'

export default configs = {
  // Default site config
  site: {
    company: 'My Company',
    brand: 'My Brand',
    tagline: 'My inspiring tagline',
    description: 'My SEO optimised meta description',
    contact: {
      twitter: 'mytwitterhandle',
      email: 'me@example.com'
    },
    pybossaHost: process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:5000'
      : 'http://xxxx.com',
    dataLicense: {
      name: 'CC0',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/'
    }
  },

  // Default collection config
  collection: {
    terminology: {
      category: 'category',
      project: 'project',
      task: 'task',
      taskRun: 'task run'
    }
  }
}
