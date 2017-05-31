const isDev = process.env.NODE_ENV === 'development'

export default {
  playbills: {
    host: isDev ? 'http://localhost:5000' : 'http://138.68.135.24:5000',
    title: 'Playbills',
    bgImg: require('@/assets/img/playbills.jpg'),
    about: require('@/assets/markdown/playbills.md'),
    team: [

    ]
  }
}
