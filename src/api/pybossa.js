import config from '@/config'
import axios from 'axios'

let apis = {}

// Configure an axios instance for site
for (let site of config.sites) {
  apis[site.shortname] = axios.create({
    baseUrl: site.host,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default apis
