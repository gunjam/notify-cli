import {NotifyClient} from 'notifications-node-client'
import {Command, Args} from '@oclif/core'
import Table from 'tty-table'
import config from '../../lib/config.js'
import {formatTimeStamp, errorTable} from '../../utils.js'

export default class List extends Command {
  static description = 'List recent notifcations for a Notify service'
  static examples = [`<%= config.bin %> <%= command.id %> serviceName`]

  static args = {
    serviceName: Args.string({
      description: 'The name of the Notify service',
      parse: (input) => config.validateServiceName(input),
      required: true,
    }),
  }

  async run() {
    const {args} = await this.parse(List)

    try {
      const apiKey = config.getService(args.serviceName)
      const notifyClient = new NotifyClient(apiKey)
      const {data} = await notifyClient.getNotifications()

      if (data.notifications.length === 0) {
        this.log('No notifcations found')
        return
      }

      const headers = [{value: 'id'}, {value: 'created_at'}, {value: 'type'}, {value: 'status'}]

      const notifications = data.notifications.map((notifcation) => ({
        id: notifcation.id,
        /* eslint-disable-next-line camelcase */
        created_at: formatTimeStamp(notifcation.created_at),
        status: notifcation.status,
        type: notifcation.type,
      }))

      const table = new Table(headers, notifications, {
        headerColor: 'cyan',
        borderColor: 'gray',
      })

      this.log(table.render())
    } catch (error) {
      this.log(error.response?.data ? errorTable(error) : error)
    }
  }
}
