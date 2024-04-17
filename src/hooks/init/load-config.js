import { join } from 'node:path'
import config from '../../lib/config.js'

/** @type {import('@oclif/core').Hook<'init'>} */
export async function hook() {
  config.init(join(this.config.configDir, 'config.json'))
  await config.load()
}
