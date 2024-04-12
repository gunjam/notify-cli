import {join} from 'node:path'
import {readFile, writeFile} from 'node:fs/promises'

/**
 * notify-cli config
 */
class Config {
  #path
  #services = new Map()

  /** @param {string} path The file path of the config JSON file */
  constructor(path) {
    this.#path = path
  }

  /**
   * Load the data from the JSON config file into the config
   */
  async load() {
    try {
      const data = await readFile(this.#path)
      const config = JSON.parse(data)

      for (const [name, apiKey] of Object.entries(config.services)) {
        this.setService(name, apiKey)
      }
    } catch {}
  }

  /**
   * Save the current config data to disk
   */
  async save() {
    const config = {
      services: {},
    }

    for (const [name, apiKey] of this.getServices()) {
      config.services[name] = apiKey
    }

    try {
      await writeFile(this.#path, JSON.stringify(config, null, '  '), 'utf8')
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Get a list of registered services and their API keys
   * @returns {Array<Array<String>} List of services
   * @example config.getServices()
   * [['service_1', 'key_1'], ['service_2', 'key_2']]
   */
  getServices() {
    return [...this.#services.entries()]
  }

  /**
   * Get a list of registered service names
   * @returns {Array<String>} List of service names
   * @example config.getServices()
   * ['service_1', 'service_2']
   */
  getServiceNames() {
    return [...this.#services.keys()]
  }

  /**
   * Get an API key for a given service
   * @param {string} name The name of the service
   * @returns {string} The API key for the given service name
   */
  getService(name) {
    return this.#services.get(name)
  }

  /**
   * Add a new service to the config
   * @param {string} name The name of the service
   * @param {string} apiKey The service's API key
   * @example config.setService('myService', 'apiKey)
   * await config.save()
   */
  setService(name, apiKey) {
    this.#services.set(name, apiKey)
  }

  /**
   * Remove a service from the config
   * @param {string} name The name of the service
   * @param {string} apiKey The service's API key
   * @example config.removeService('myService')
   * await config.save()
   */
  removeService(name) {
    this.#services.delete(name)
  }

  /**
   * Validate that the given service exists in the config
   * @param {string} name The name of the service
   * @returns {string} The valid input name
   * @throws {Error}
   */
  validateServiceName(name) {
    const services = this.getServiceNames()
    if (!services.includes(name)) {
      throw new Error(
        `Unkown service, expected ${name} to be one of: ${services.join(', ')}\nSee more help with --help`,
      )
    }

    return name
  }
}

const configPath = join(import.meta.dirname, '../../', '.config.json')
const config = new Config(configPath)
await config.load()

export default config
