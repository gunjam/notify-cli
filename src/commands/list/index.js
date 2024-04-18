import {Args, Command, Flags} from '@oclif/core'
import {NotifyClient} from 'notifications-node-client'
import Table from 'tty-table'
import {errorTable, formatJSON, formatReference, formatTimeStamp} from '../../utils.js'

export default class List extends Command {
  static description = 'List recent notifcations for a Notify service'
  static examples = [`<%= config.bin %> <%= command.id %> serviceName`]

  static args = {
    serviceName: Args.string({
      description: 'The name of the Notify service',
      required: true,
    }),
  }

  static flags = {
    type: Flags.string({
      description: 'Filter notifications by type',
      char: 't',
      options: ['email', 'sms', 'letter'],
    }),
    reference: Flags.string({
      description: 'Filter notifications by reference',
      char: 'r',
    }),
    json: Flags.boolean({
      description: 'Output API JSON body instead of table of results',
      char: 'j',
    }),
  }

  async run() {
    const {args, flags} = await this.parse(List)
    const apiKey = this.config.store.getService(args.serviceName)

    try {
      const notifyClient = new NotifyClient(apiKey)
      const {data} = await notifyClient.getNotifications(flags.type, undefined, flags.reference)

      if (flags.json) {
        this.log(formatJSON(data))
        return
      }

      if (data.notifications.length === 0) {
        this.log('No notifcations found')
        return
      }

      const headers = [
        {value: 'id'},
        {value: 'created_at', formatter: formatTimeStamp},
        {value: 'type'},
        {value: 'status'},
      ]

      if (data.notifications.some((n) => n.reference)) {
        headers.push({value: 'reference', formatter: formatReference})
      }

      const table = new Table(headers, data.notifications, {
        headerColor: 'cyan',
        borderColor: 'gray',
      })

      this.log(table.render())
    } catch (error) {
      this.log(error.response?.data ? errorTable(error) : error)
    }
  }
}
