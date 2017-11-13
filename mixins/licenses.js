/**
 * A mixin for the available licenses for data reuse, and their URLs.
 */
export const licenses = {
  data () {
    const baseUrl = 'https://creativecommons.org/licenses'
    const version = '4.0'
    return {
      dataLicenses: {
        CC0: {
          id: 'CC0',
          name: 'CC0',
          url: 'https://creativecommons.org/publicdomain/zero/1.0/'
        },
        CC_BY: {
          name: 'CC0',
          url: `${baseUrl}/by/${version}/`
        },
        CC_BY_SA: {
          name: 'CC BY-SA',
          url: `${baseUrl}/by-sa/${version}/`
        },
        CC_BY_ND: {
          name: 'CC BY-ND',
          url: `${baseUrl}/by-nd/${version}/`
        },
        CC_BY_NC: {
          name: 'CC BY-NC',
          url: `${baseUrl}/by-nc/${version}/`
        },

        CC_BY_NC_SA: {
          name: 'CC BY-NC-SA',
          url: `${baseUrl}/by-nc-sa/${version}/`
        },
        CC_BY_NC_ND: {
          name: 'CC_BY-NC-ND',
          url: `${baseUrl}/by-nc-nd/${version}/`
        }
      }
    }
  }
}
