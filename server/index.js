import express from 'express'
import { Nuxt, Builder } from 'nuxt'

const host = process.env.HOST || '0.0.0.0'
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

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
  .then(listen)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
else {
  listen()
}

// Development error handler
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// Production error handler
app.use((err, req, res) => {
  console.log(err)
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

// Listen to the server
function listen () {
  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port)
}
