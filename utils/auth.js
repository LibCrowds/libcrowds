/**
 * Return true if the PYBOSSA session is not for the user, false otherwise.
 * @param {Object} user
 *   The user.
 * @param {String} cookieStr
 *   The document cookie string.
 */
export const updateSession = (user, cookieStr) => {
  const allCookies = cookieStr.split(';')
  let hasSession = false
  let sessionName = null

  // Get the username of the current session, if any
  for (let cookie of allCookies) {
    if (cookie.indexOf('remember_token=') > -1) {
      hasSession = true
      sessionName = cookie.split('|')[0].split('=')[1]
    }
  }

  // Return true if the user doesn't match the current session
  return (
    ((user === null || user === undefined) === hasSession) ||
    (hasSession && user.name !== sessionName)
  )
}
