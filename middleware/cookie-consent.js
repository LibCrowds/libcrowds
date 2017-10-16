/**
 * Show cookie consent on the client.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ isClient }) {
  if (isClient) {
    require('cookieconsent')

    const cookiesPolicyPath = '/help/cookies'
    const url = window.location.origin + cookiesPolicyPath
    window.cookieconsent.initialise({
      content: {
        message: 'This website uses cookies to ensure you get the best ' +
                  'experience (mmm...cookies).',
        href: url
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
