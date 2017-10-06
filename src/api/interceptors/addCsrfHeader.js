export default function (r) {
  if ('csrf' in r.data) {
    r.headers['X-CSRFToken'] = r.data.csrf
  }
  return r
}
