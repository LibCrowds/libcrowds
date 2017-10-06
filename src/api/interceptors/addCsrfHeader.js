/**
 * Add any CSRF token to the header.
 * @param {Object} r
 *   The request.
 */
export default function (r) {
  if ('csrf' in r.data) {
    r.headers['X-CSRFToken'] = r.data.csrf
  }
  return r
}
