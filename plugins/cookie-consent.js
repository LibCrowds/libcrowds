/**
 * Show cookie consent on the client only.
 */
export default ({ app }) => {
  if (process.client) {
    require('cookieconsent')
    const cookiesPolicy = app.router.resolve({ name: 'help-cookies' }).href
    window.cookieconsent.initialise({
      content: {
        message: 'This website uses cookies to ensure you get the best ' + 'experience (mmm...cookies).',
        href: window.location.origin + cookiesPolicy},
      palette: {
        popup: {
          background: 'rgba(0,0,0,0.8)'},
        button: {
          background: '#0552b1'
        }
      }
    })
  }
}
