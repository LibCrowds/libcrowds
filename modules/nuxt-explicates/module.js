const path = require('path')

// Javascript client for the Explicates Web Annotation server
// https://github.com/alexandermendes/explicates

module.exports = function nuxtExplicates (_modOptions) {
  // Combine options
  const modOptions = Object.assign({}, this.options.explicates, _modOptions)

  // Apply defaults (currently no defaults)
  const options = Object.assign({
    accept: 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
  }, modOptions)

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.template.js'),
    fileName: 'explicates.js',
    options: options
  })
}
