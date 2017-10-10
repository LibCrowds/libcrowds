const nodeExternals = require('webpack-node-externals')
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
  build: {
    /*
    ** Add to the global vendor bundle.
    */
    vendor: [
      'axios',
      'vue-awesome'
    ],
    extend (config, ctx) {

      if (ctx.isClient) {
        // Run eslint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (ctx.isServer) {
        // Whitelist vue-awesome
        config.externals = [
          nodeExternals({
            whitelist: [/\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/]
          })
        ]
      }
    }
  },
  /*
  ** Plugins.
  */
  plugins: [
    { src: '~/plugins/pybossa.js' },
    { src: '~/plugins/vue-awesome.js' }
  ]
}
