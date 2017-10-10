import FileSaver from 'file-saver'

/**
 * Export data as a zip file.
 * @param {data} data
 *   The data.
 * @param {String} prefix
 *   The filename prefix.
 * @param {String} format
 *   The data format.
 */
export default function (data, prefix, format) {
  const types = {
    'zip': 'application/zip',
    'csv': 'text/csv',
    'json': 'application/json'
  }
  const blob = new Blob([data], { type: types[format] })
  const fn = `${prefix}.${format}`
  console.log(blob, fn)
  return FileSaver.saveAs(blob, fn)
}
