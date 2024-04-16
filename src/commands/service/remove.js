import {Args, Command} from '@oclif/core'
import config from '../../lib/config.js'

export default class Remove extends Command {
  static description = 'Remove a Notify service'
  static examples = [`<%= config.bin %> <%= command.id %> myServiceName`]

  static args = {
    serviceName: Args.string({description: 'The name of the Notify service to remove', required: true}),
  }

  async run() {
    const {args} = await this.parse(Remove)
    config.removeService(args.serviceName)
    await config.save()
  }
}
