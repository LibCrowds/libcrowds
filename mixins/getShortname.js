export const getShortname = {
  methods: {
    /**
     * Create a shortname by removing certain characters from a string.
     * @param {String} text
     *   The text to convert.
     */
    getShortname (text) {
      const badchars = /([$#%·:,.~!¡?"¿'=)(!&/|]+)/g
      const whitespace = /\s+/g
      return name.replace(badchars, '')
        .toLowerCase()
        .trim()
        .replace(whitespace, '_')
    }
  }
}
