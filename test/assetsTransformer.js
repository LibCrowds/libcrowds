module.exports = {
  process (src, fn, config, options) {
    console.info('Assets transformer processing')
    return `module.exports = JSON.stringify(require('path').basename(fn));`
  }
}
