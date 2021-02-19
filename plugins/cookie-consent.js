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
<<<<<<< HEAD
          background: '#06547c'}
=======
          background: '#2589bd'
        }
>>>>>>> 9f419f31ec46b2d018153edea9080d73508a060d
      }
    })
  }
}