import {join} from 'node:path'
import Config from '../../lib/Config.js'

/**
 * A hook to load the saved user config from the config directory
 * before running any commands.
 * @type {import('@oclif/core').Hook<'init'>}
 */
export async function hook() {
  const configFilePath = join(this.config.configDir, 'config.json')
  const config = new Config(configFilePath)
  await config.load()

  this.config.store = config
}
