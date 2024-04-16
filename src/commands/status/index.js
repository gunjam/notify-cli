import {NotifyClient} from 'notifications-node-client'
import {Args, Command, Flags} from '@oclif/core'
import Table from 'tty-table'
import config from '../../lib/config.js'
import {formatTimeStamp, errorTable, formatJSON} from '../../utils.js'

export default class Status extends Command {
  static description = 'Get the status of a notification'
  static examples = [`<%= config.bin %> <%= command.id %> status serviceName notificationId`]

  static args = {
    serviceName: Args.string({
      description: 'The name of the Notify service',
      parse: (input) => config.validateServiceName(input),
      required: true,
    }),
    notificationId: Args.string({
      description: 'The ID of the notification',
      required: true,
    }),
  }

  static flags = {
    json: Flags.boolean({
      description: 'Output API JSON body instead of table of data',
      char: 'j',
    }),
  }

  async run() {
    const {args, flags} = await this.parse(Status)
    const apiKey = config.getService(args.serviceName)
    const notifyClient = new NotifyClient(apiKey)

    try {
      const {data} = await notifyClient.getNotificationById(args.notificationId)

      if (flags.json) {
        this.log(formatJSON(data))
        return
      }

      const rows = [
        ['id', data.id],
        ['template_id', data.template.id],
        ['status', data.status],
        ['type', data.type],
        ['created_at', formatTimeStamp(data.created_at)],
      ]

      if (data.completed_at) {
        rows.push(['completed_at', formatTimeStamp(data.completed_at)])
      }

      if (data.sent_at) {
        rows.push(['sent_at', formatTimeStamp(data.sent_at)])
      }

      if (data.estimated_delivery) {
        rows.push(['estimated_delivery', formatTimeStamp(data.estimated_delivery)])
      }

      let address = ''
      for (const line of ['line_1', 'line_2', 'line_3', 'line_4', 'line_5', 'line_6', 'line_7', 'postcode']) {
        address += data[line] ? `\n${data[line]}` : ''
      }

      address = address.trim()

      if (address) {
        rows.push(['address', address])
      }

      if (data.email_address) {
        rows.push(['email_address', data.email_address])
      }

      if (data.phone_number) {
        rows.push(['phone_number', data.phone_number])
      }

      rows.push(['subject', data.subject], ['body', data.body])

      const table = new Table([{color: 'cyan'}, {width: 80}], rows, {
        align: 'left',
        showHeader: false,
        borderColor: 'gray',
      })

      this.log(table.render())
    } catch (error) {
      if (error.response?.data && flags.json) {
        this.log(formatJSON(error.response.data))
        return
      }

      const table = errorTable(error)
      this.log(table)
    }
  }
}
