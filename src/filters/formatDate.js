import moment from 'moment'

/**
 * Format a date.
 * @param {String} date
 *   The date.
 * @param {String} format
 *   The format.
 */
export default function (date, format = 'DD MMM YYYY') {
  if (date) {
    return moment(String(date)).format(format)
  }
}
