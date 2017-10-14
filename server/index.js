import express from 'express'
import { Nuxt, Builder } from 'nuxt'

const app = express()
const isProd = (process.env.NODE_ENV === 'production')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// We instantiate nuxt.js with the options
const config = require('../nuxt.config.js')
config.dev = !isProd
const nuxt = new Nuxt(config)

// Render every route with nuxt.js
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

function listen() {
  // Listen the server
  app.listen(port, '0.0.0.0')
  console.log('Server listening on localhost:' + port)
}
