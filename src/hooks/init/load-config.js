import config from '../../lib/config.js'

/** @type {import('@oclif/core').Hook<'init'>} */
export async function hook() {
  await config.load()
}
