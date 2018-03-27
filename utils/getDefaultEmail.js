/**
 * Validate an email address and return a default if invalid.
 *
 * Primarily used for cases where users signed up to PYBOSSA with SSO, yet
 * we need a valid email address to create their account in Flarum. So, we
 * just generate a fake one at example.com for now. We can revisit if Flarum
 * later turns of the requirement of a valid email address.
 * @param {String} email
 *   The email address.
 */
export const getDefaultEmail = function (email) {
  const re = new RegExp(/[^@]+@[^@]+\.[^@]+/)
  if (re.test(email)) {
    return email
  }
  return email + '@example.com'
}
