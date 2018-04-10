/**
 * Fetch all instances of a domain obejct from the PYBOSSA API.
 * @param {Object} axios
 *   The application's axios instance.
 * @param {String} domainObject
 *   The domain object to fetch.
 * @param {Object} params
 *   Any HTTP parameters.
 */
export const fetchAll = async function (axios, domainObject, params = {}) {
  const endpoint = `/api/${domainObject}`
  let lastFetched = null
  let objects = []

  while (objectsNotExhausted(lastFetched)) {
    const queryParams = JSON.parse(JSON.stringify(params))
    queryParams.limit = 100

    if (lastFetched && lastFetched.length) {
      queryParams.last_id = lastFetched[lastFetched.length - 1].id
    }

    const data = await axios.$get(endpoint, {
      params: queryParams
    })

    lastFetched = data
    objects = objects.concat(data)
  }
  return objects
}

function objectsNotExhausted (lastFetched) {
  return (
    !lastFetched ||
    (
      lastFetched.length !== 0 &&
      lastFetched.length === 100
    )
  )
}
