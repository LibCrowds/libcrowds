const path = require('path')

module.exports = function nuxtFlarum (_moduleOptions) {
  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.template.js'),
    fileName: 'flarum.js',
    _moduleOptions
  })
}
