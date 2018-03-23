const git = require('git-rev-sync')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const localConfig = process.env.NODE_ENV === 'testing'
  ? require('./test/test.local.config')
  : require('./local.config')

const config = {
  mode: 'universal',
  head: {
    titleTemplate: `%s | ${localConfig.brand}`,
    meta: [] // Options pushed below depending on configuration
  },
  css: [
    '~/assets/style/main.scss',
    'chartist-plugin-tooltips/dist/chartist-plugin-tooltip.css',
    'cookieconsent/build/cookieconsent.min.css',
    'izitoast/dist/css/iziToast.css',
    'vue-multiselect/dist/vue-multiselect.min.css',
    'simplemde/dist/simplemde.min.css',
    'libcrowds-viewer/dist/scss/main.scss'
  ],
  build: {
    vendor: [
      'bootstrap-vue',
      'progressbar.js',
      'vue-awesome',
      'vue-chartist',
      'vue-clickaway',
      'vue-form-generator',
      'vue-gravatar',
      'vue-infinite-loading',
      'vue-moment',
      'vue-multiselect',
      'vue-notifications',
      'vue-scrollto',
      'vue-simplemde',
      'vue-sweetalert',
      'vue-js-toggle-button'
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

      if (ctx.isServer) {
        // Whitelist vue-awesome
        config.externals = [
          nodeExternals({
            whitelist: [/\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/]
          })
        ]
      }

      // Image optimisation
      config.module.rules.push({
        test: /\.(webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      })

      // Modernizr
      config.module.rules = config.module.rules.concat(
        [
          {
            test: /\.modernizrrc.js$/,
            use: [ 'modernizr-loader' ]
          },
          {
            test: /\.modernizrrc(\.json)?$/,
            use: [ 'modernizr-loader', 'json-loader' ]
          }
        ]
      )
      config.resolve.alias['modernizr$'] = path.resolve(__dirname, '.modernizrrc')

      config.module.rules.push({
        test: /\.md$/,
        use: [
          'html-loader',
          'markdown-loader'
        ]
      })
    }
  },
  plugins: [
    { src: '~/plugins/axios' },
    { src: '~/plugins/cookies' },
    { src: '~/plugins/cookie-consent', ssr: false },
    { src: '~/plugins/dark-mode' },
    { src: '~/plugins/filters' },
    { src: '~/plugins/libcrowds-viewer', ssr: false },
    { src: '~/plugins/modernizr', ssr: false },
    { src: '~/plugins/notifications', ssr: false },
    { src: '~/plugins/velocity', ssr: false },
    { src: '~/plugins/vue-awesome' },
    { src: '~/plugins/vue-chartist', ssr: false },
    { src: '~/plugins/vue-clickaway', ssr: false },
    { src: '~/plugins/vue-confetti', ssr: false },
    { src: '~/plugins/vue-form-generator' },
    { src: '~/plugins/vue-gravatar' },
    { src: '~/plugins/vue-infinite-loading', ssr: false },
    { src: '~/plugins/vue-moment' },
    { src: '~/plugins/vue-multiselect' },
    { src: '~/plugins/vue-prevent-parent-scroll' },
    { src: '~/plugins/vue-scrollto', ssr: false },
    { src: '~/plugins/vue-simplemde', ssr: false },
    { src: '~/plugins/vue-sweetalert', ssr: false },
    { src: '~/plugins/vue-toggle-button', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    ['bootstrap-vue/nuxt', { css: false }]
  ],
  axios: {
    baseURL: localConfig.pybossaHost,
    credentials: true,
    retry: true,
    proxy: true
  },
  proxy: {
    '/api/': localConfig.pybossaHost,
    '/z3950/': localConfig.pybossaHost,
    '/lc/': localConfig.pybossaHost
  },
  manifest: {
    name: localConfig.brand,
    description: localConfig.description,
    theme_color: '#ba0000',
    lang: 'en-GB',
    display: 'standalone',
    start_url: '.'
  },
  meta: {
    // Open Graph info is set from each page instead
    ogType: false,
    ogTitle: false,
    ogDescription: false
  },
  loading: {
    color: '#2589BD',
    duration: 10000
  },
  router: {
    middleware: [
      'session'
    ],
    scrollBehavior: () => {
      return { x: 0, y: 0 }
    }
  }
}

// Configure Google Analytics
if (localConfig.hasOwnProperty('analytics')) {
  config.modules.push([ '@nuxtjs/google-analytics', localConfig.analytics ])
}

// Configure Facebook meta tags
if (localConfig.hasOwnProperty('facebook')) {
  config.head.meta.push({
    property: 'fb:app_id',
    content: localConfig.facebook.appId
  })
}

// Configure Sentry
if (localConfig.hasOwnProperty('sentry')) {
  config.modules.push([ '@nuxtjs/sentry', localConfig.sentry ])
}

// Configure Flarum integration
if (
  localConfig.hasOwnProperty('flarum') &&
  localConfig.flarum.hasOwnProperty('apiKey') &&
  localConfig.flarum.hasOwnProperty('url') &&
  localConfig.flarum.hasOwnProperty('salt')
) {
  config.modules.push([ '~/modules/flarum/module', localConfig.flarum ])
}

module.exports = config
