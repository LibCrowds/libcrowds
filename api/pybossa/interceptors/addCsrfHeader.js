/**
 * Add any CSRF token to the header.
 * @param {Object} r
 *   The request.
 */
export default function (req) {
  if (req.data.hasOwnProperty('csrf')) {
    req.headers['X-CSRFToken'] = req.data.csrf
  }
  return req
}
