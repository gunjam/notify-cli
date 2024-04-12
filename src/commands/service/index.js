import {Command, Flags} from '@oclif/core'
import config from '../../lib/config.js'

export default class Service extends Command {
  static description = 'Show registered Notify services'
  static examples = [
    `<%= config.bin %> <%= command.id %>\nmyservice`,
    `<%= config.bin %> <%= command.id %> -v\nmyservice api-key`,
  ]

  static flags = {
    verbose: Flags.boolean({
      char: 'v',
      description: 'Show service names and API keys',
    }),
  }

  async run() {
    const {flags} = await this.parse(Service)
    let output = ''

    for (const [name, key] of config.getServices()) {
      output += flags.verbose ? `${name}  ${key}\n` : `${name}\n`
    }

    this.log(output.trim())
  }
}
