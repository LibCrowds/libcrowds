const path = require('path')

// Javascript client for the Explicates Web Annotation server
// https://github.com/alexandermendes/explicates

module.exports = function nuxtExplicates (_moduleOptions) {
  // Combine options
  const moduleOptions = Object.assign({}, this.options.explicates,
                                      _moduleOptions)

  // Apply defaults (currently no defaults)
  const options = Object.assign({
    baseURL: '',
    accept: 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
  }, moduleOptions)

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.template.js'),
    fileName: 'explicates.js',
    options: {}
  })
}
