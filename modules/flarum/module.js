const path = require('path')

module.exports = function nuxtFlarum (_moduleOptions) {
  // Combine options
  const moduleOptions = Object.assign({}, this.options.flarum, _moduleOptions)

  // Apply defaults
  const options = Object.assign({
    salt: '',
    debug: false,
    secure: true
  }, moduleOptions)

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.template.js'),
    fileName: 'flarum.js',
    options: options
  })
}
