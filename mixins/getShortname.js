export const getShortname = {
  methods: {
    /**
     * Create a shortname by removing certain characters from a string.
     * @param {String} text
     *   The text to convert.
     */
    getShortname (text) {
      if (!text) {
        return ''
      }
      const badchars = /([$#%·:,.~!¡?"¿'=)(!&/|]+)/g
      const whitespace = /\s+/g
      return text.replace(badchars, '')
        .toLowerCase()
        .trim()
        .replace(whitespace, '_')
    }
  }
}
