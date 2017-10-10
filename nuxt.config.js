const localConfig = process.env.NODE_ENV === 'testing'
  ? require('./test/test.local.config.js')
  : require('./local.config.js')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: ` %s - ${localConfig}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: localConfig.description
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~/assets/css/main.css'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
  ** Plugins.
  */
  plugins: [
    { src: '~/plugins/pybossa.js' }
  ]
}
