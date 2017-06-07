const isDev = process.env.NODE_ENV === 'development'

export default {
  brand: 'LibCrowds',
  title: 'Crowdsourcing projects from the British Library',
  description: 'LibCrowds is a platform for hosting experimental ' +
               'crowdsourcing projects aimed at improving access to the ' +
               'diverse collections held at the British Library.',
  copyright: 'The British Library, 2017',
  contact: {
    twitter: 'LibCrowds',
    email: 'crowdsourcing@bl.uk'
  },
  dataLicense: {
    name: 'CC0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/'
  },
  discourseUrl: 'http://community.libcrowds.com',
  githubUrl: 'https://github.com/LibCrowds',
  pybossaHost: isDev ? 'http://localhost:5000' : 'http://138.68.135.24:5000',
  sites: [
    {
      shortname: 'playbills',
      name: 'Playbills',
      bgImg: require('@/assets/img/playbills.jpg'),
      background: require('@/assets/markdown/playbills.md'),
      team: [

      ],
      categories: [
        'thinking'
      ]
    }
  ]
}
