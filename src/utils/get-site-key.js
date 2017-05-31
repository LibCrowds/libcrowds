import tld from 'tldjs'

/**
 * Return site key according to the current subdomain.
 */
export default function () {
  return process.env.NODE_ENV === 'development'
           ? 'dev'
           : tld.getSubdomain(window.location.host)
}
