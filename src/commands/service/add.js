import {Args, Command} from '@oclif/core'

export default class Add extends Command {
  static description = 'Add a Notify service'
  static examples = [`<%= config.bin %> <%= command.id %> myServiceName myApiKey`]

  static args = {
    serviceName: Args.string({description: 'What to call the Notify service', required: true}),
    apiKey: Args.string({description: 'The API key of the Notify service', required: true}),
  }

  async run() {
    const {args} = await this.parse(Add)
    this.config.store.setService(args.serviceName, args.apiKey)
    await this.config.store.save()
  }
}
