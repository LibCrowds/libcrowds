const nodeExternals = require('webpack-node-externals')
const localConfig = process.env.NODE_ENV === 'testing'
  ? require('./test/test.local.config')
  : require('./local.config')

module.exports = {
  mode: 'universal',
  head: {
    titleTemplate: ` %s - ${localConfig.brand}`,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: localConfig.description
      }
    ]
  },
  css: ['~assets/style/main.scss'],
  build: {
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
          exclude: /(node_modules)/,
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        })
      }

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      })

      config.module.rules.push({
        test: /\.md$/,
        use: [
          'html-loader',
          'markdown-loader'
        ]
      })

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
  plugins: [
    { src: '~/plugins/bootstrap-vue' },
    { src: '~/plugins/filters' },
    { src: '~/plugins/vue-awesome' },
    { src: '~/plugins/vue-chartist', ssr: false },
    { src: '~/plugins/vue-clickaway', ssr: false },
    { src: '~/plugins/vue-form-generator' },
    { src: '~/plugins/vue-gravatar' },
    { src: '~/plugins/vue-scrollto', ssr: false },
    { src: '~/plugins/vue-sweetalert', ssr: false },
    { src: '~/plugins/vue-toggle-button', ssr: false }
  ],
  modules: [
    '@nuxtjs/pwa'
  ],
  manifest: {
    name: localConfig.brand,
    description: localConfig.description,
    theme_color: '#ba0000'
  },
  loading: {
    color: '#bffaf3',
    duration: localConfig.pybossa.timeout || 5000
  }
}
