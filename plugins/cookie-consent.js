/**
 * Dispatch the nuxt client init event.
 *
 * This is used to that we can asynchronously perform actions that are only
 * available on the client, before rendering.
 */
export default ({ isClient, app }) => {
  if (isClient) {
    require('cookieconsent')
    const cookiesPolicy = app.router.resolve({ name: 'help-cookies' }).href
    window.cookieconsent.initialise({
      content: {
        message: 'This website uses cookies to ensure you get the best ' +
                  'experience (mmm...cookies).',
        href: window.location.origin + cookiesPolicy
      },
      palette: {
        popup: {
          background: '#000'
        },
        button: {
          background: '#BA0000'
        }
      }
    })
  }
}
