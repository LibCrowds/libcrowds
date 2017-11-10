module.exports = function mailchimp (options) {
  if (!this.options.mailchimp) {
    return
  }

  console.log('registering')

  // Base64 encode string
  function b64EncodeUnicode (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes (match, p1) {
        return String.fromCharCode('0x' + p1)
      }))
  }

  const dataCenter = options.apiKey.match(/-(.*)$/)[1]
  const apiKey = options.apiKey
  const listId = options.listId
  const credentials = b64EncodeUnicode(`anystring:${apiKey}`)

  // Middleware
  const Mailchimp = ('/mailchimp', function (req, res) {
    req.pipe(request(url)).pipe(res)
    const url = `${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members`

    const xhr = new XMLHttpRequest()
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Content-Length', Buffer.byteLength('req'))
    xhr.setRequestHeader('Authorization', `Basic ${credentials}`)
    xhr.open('POST', url)

    // Handle response
    xhr.onload = () => {
      if (xhr.status !== 200) {
        console.log('Request failed.  Returned status of ' + xhr.status)
      }
      console.log(xhr.status)
    }

    xhr.send(encodeURI('name='))
  })

  // Register middleware
  this.options.serverMiddleware.push(Mailchimp)
}
