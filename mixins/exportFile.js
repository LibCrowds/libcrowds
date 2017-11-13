import FileSaver from 'file-saver'

export const exportFile = {
  methods: {
    /**
     * Export data as a zip file.
     * @param {data} data
     *   The data.
     * @param {String} prefix
     *   The filename prefix.
     * @param {String} format
     *   The data format.
     */
    exportFile (data, prefix, format) {
      const types = {
        'zip': 'application/zip',
        'csv': 'text/csv',
        'json': 'application/json'
      }
      const blob = new Blob([data], { type: types[format] })
      const fn = `${prefix}.${format}`
      return FileSaver.saveAs(blob, fn)
    }
  }
}
