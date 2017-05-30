export default {
  sites: {
    playbills: {
      pybossaHost: process.env.NODE_ENV === 'development'
                     ? 'http://127.0.0.1:5000'
                     : 'http://138.68.135.24:5000',
      backgroundImage: require('@/assets/img/playbills.jpg'),
      about: require('@/assets/markdown/playbills.md')
    }
  }
}
