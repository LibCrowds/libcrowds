import tld from 'tldjs'

if (process.env.NODE_ENV === 'development') {
  tld.validHosts = ['localhost']
}

/**
 * Return site key according to the current subdomain.
 */
export default function () {
  return tld.getSubdomain(window.location.host)
}
