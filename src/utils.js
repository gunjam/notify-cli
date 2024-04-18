import cj from 'color-json'
import Table from 'tty-table'

const date = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short',
  timeStyle: 'long',
  timeZone: 'Europe/London',
})

/**
 * Convert a NotifyClient response error into a table to be rendered to a TTY terminal
 * @param {import('axios').AxiosError} error The error thrown by the Notify Client
 * @returns {string} A table of error data
 */
export function errorTable(error) {
  const errors = error.response.data.errors.map((error, i) => [`error_message_${i}`, error.message])

  const rows = [['status_code', error.response.data.status_code], ...errors]

  const table = new Table([{color: 'red'}, {width: 80}], rows, {
    align: 'left',
    showHeader: false,
    borderColor: 'gray',
  })

  return table.render()
}

/**
 * Reformat an input ISO date-time string as a UK GOV standard locale string
 * @param {string} timestamp ISO format date-time string
 * @returns {string} UK GOV formatted locale string
 */
export function formatTimeStamp(timestamp) {
  return date.format(new Date(timestamp))
}

/**
 * Format JSON object as string and colour if stdout is TTY
 * @param {obj} input JSON object
 * @returns {string} formatted JSON string
 */
export function formatJSON(obj) {
  return process.stdout.isTTY ? cj(obj) : JSON.stringify(obj, null, '  ')
}

/**
 * Format empty values in tty-table as red 'null' terminal text.
 * tty-table seems to convert `null` values to an empty string before passing
 * to the formatter.
 * @param {value} input value for cell
 * @returns {string} formatted text
 */
export function formatReference(value) {
  return value || this.style('null', 'red')
}
