const git = require('git-rev-sync')
const nodeExternals = require('webpack-node-externals')
const localConfig = process.env.NODE_ENV === 'testing'
  ? require('./test/test.local.config')
  : require('./local.config')

const config = {
  mode: 'universal',
  head: {
    titleTemplate: `%s | ${localConfig.brand}`,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: localConfig.description
      }
    ]
  },
  css: [
    '~/assets/style/main.scss',
    'cookieconsent/build/cookieconsent.min.css',
    'izitoast/dist/css/iziToast.min.css',
    'vue-multiselect/dist/vue-multiselect.min.css',
    'simplemde/dist/simplemde.min.css'
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
      'vue-js-toggle-button',
      'vue-notifications',
      'vue-scrollto',
      'vue-sweetalert'
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
    { src: '~/plugins/bootstrap-vue' },
    { src: '~/plugins/filters' },
    { src: '~/plugins/libcrowds-viewer', ssr: false },
    { src: '~/plugins/notifications', ssr: false },
    { src: '~/plugins/vue-awesome' },
    { src: '~/plugins/vue-chartist', ssr: false },
    { src: '~/plugins/vue-clickaway', ssr: false },
    { src: '~/plugins/vue-form-generator' },
    { src: '~/plugins/vue-gravatar' },
    { src: '~/plugins/vue-infinite-loading', ssr: false },
    { src: '~/plugins/vue-moment' },
    { src: '~/plugins/vue-multiselect' },
    { src: '~/plugins/vue-scrollto', ssr: false },
    { src: '~/plugins/vue-simplemde', ssr: false },
    { src: '~/plugins/vue-sweetalert', ssr: false },
    { src: '~/plugins/vue-toggle-button', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy'
  ],
  axios: {
    baseURL: localConfig.pybossa.host,
    requestInterceptor: (config) => {
      config.headers['Content-Type'] = 'application/json'
      config.timeout = 10000

      // Use form data to set CSRF token header
      if (config.data && config.data.hasOwnProperty('csrf')) {
        config.headers['X-CSRFToken'] = config.data.csrf
      }

      // Ensure some data otherwise axois can delete Content-Type
      if (config.data === undefined) {
        config.data = {}
      }
      return config
    }
  },
  proxy: {
    '/api': localConfig.pybossa.host
  },
  manifest: {
    name: localConfig.brand,
    description: localConfig.description,
    theme_color: '#ba0000',
    lang: 'en-GB',
    display: 'standalone',
    start_url: '.'
  },
  loading: {
    color: '#2589BD',
    duration: localConfig.pybossa.timeout || 5000
  },
  router: {
    middleware: [
      'auth',
      'announcements',
      'cookie-consent'
    ]
  }
}

if (localConfig.hasOwnProperty('analytics')) {
  config.modules.push([ '@nuxtjs/google-analytics', localConfig.analytics ])
}

if (localConfig.hasOwnProperty('sentry')) {
  localConfig.sentry.release = git.tag()
  localConfig.sentry.tags = {
    git_commit: git.short()
  }
  config.modules.push([ '~/modules/sentry/sentry', localConfig.sentry ])
}

module.exports = config
