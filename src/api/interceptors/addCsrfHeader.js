/**
 * Add any CSRF token to the header.
 * @param {Object} r
 *   The request.
 */
export default function (r) {
  if (r.data.hasOwnProperty('csrf')) {
    r.headers['X-CSRFToken'] = r.data.csrf
  }
  return r
}
