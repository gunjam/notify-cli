import {writeFile} from 'node:fs/promises'
import {Args, Command, Flags} from '@oclif/core'
import {NotifyClient} from 'notifications-node-client'
import ora from 'ora'
import {errorTable} from '../../utils.js'

export default class PDF extends Command {
  static description = 'Get PDF for a letter notifcation'
  static examples = [`<%= config.bin %> <%= command.id %> pdf serviceName notificationId`]

  static args = {
    serviceName: Args.string({
      description: 'The name of the Notify service',
      required: true,
    }),
    notificationId: Args.string({
      description: 'The ID of the notification',
      required: true,
    }),
  }

  static flags = {
    file: Flags.string({
      description: 'Set the output filename, default: $notificationId.pdf',
      char: 'f',
    }),
  }

  async run() {
    const {args, flags} = await this.parse(PDF)

    const spinner = ora('Fetching PDF').start()
    const filename = flags.file || `./${args.notificationId}.pdf`
    const apiKey = this.config.store.getService(args.serviceName)

    try {
      const notifyClient = new NotifyClient(apiKey)
      const pdf = await notifyClient.getPdfForLetterNotification(args.notificationId)
      await writeFile(`./${filename}`, pdf)
      spinner.succeed(`Written to file ${filename}`)
    } catch (error) {
      if (error.response) {
        spinner.fail('Failed to get PDF!')
        const table = errorTable(error)
        this.log(table)
      } else {
        spinner.fail('Failed to write PDF!')
        this.log(error)
      }
    }
  }
}
