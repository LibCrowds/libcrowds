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
  discourseUrl: 'http://community.libcrowds.com',
  githubUrl: 'https://github.com/LibCrowds',
  sites: [
    {
      shortname: 'playbills',
      name: 'Playbills',
      host: isDev ? 'http://localhost:5000' : 'http://138.68.135.24:5000',
      bgImg: require('@/assets/img/playbills.jpg'),
      background: require('@/assets/markdown/playbills.md'),
      team: [

      ]
    }
  ]
}
