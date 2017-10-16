import chalk from 'chalk'
import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import errorhandler from 'errorhandler'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080

// Init express
const app = express()
app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build().then(listen)
} else {
  listen()
}

// Development error handler
if (config.dev) {
  app.use(errorhandler())
}

// Listen to the server
function listen () {
  app.listen(port, host).on('error', function(err) {
    console.log(chalk.red(err))
  })
  console.log(chalk.green('Server listening on ' + host + ':' + port))
}
