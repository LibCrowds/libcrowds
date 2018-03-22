const path = require('path')

// Flarum module that just adds the plugin
module.exports = function nuxtFlarum (moduleOptions) {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.template.js'),
    options: moduleOptions
  })
}
