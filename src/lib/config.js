import {access, mkdir, readFile, writeFile} from 'node:fs/promises'

/**
 * Save, load and manage JSON config for govuk-notify-cli
 */
export default class Config {
  #path
  #services = new Map()

  /**
   * @throws {TypeError} if path is not a string
   * @throws {Error} if path does not end with .json
   */
  constructor(path) {
    if (typeof path !== 'string') {
      throw new TypeError('config file path must be a string')
    }
    if (!path.endsWith('.json')) {
      throw new Error('config file path must end in .json')
    }

    this.#path = path
  }

  /**
   * Load the data from the JSON config file into the config
   */
  async load() {
    let existingConfig
    let data

    try {
      data = await readFile(this.#path, {encoding: 'utf8'})
      existingConfig = true
    } catch {
      existingConfig = false
    }

    if (existingConfig) {
      const config = JSON.parse(data)

      for (const [name, apiKey] of Object.entries(config.services)) {
        this.setService(name, apiKey)
      }
    }
  }

  /**
   * Save the current config data to disk
   */
  async save() {
    const folder = this.#path.substring(0, this.#path.lastIndexOf('/'))

    try {
      await access(folder)
    } catch {
      await mkdir(folder, {recursive: true})
    }

    const config = {
      services: {},
    }

    for (const [name, apiKey] of this.getServices()) {
      config.services[name] = apiKey
    }

    await writeFile(this.#path, JSON.stringify(config, null, '  '), 'utf8')
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
   * Validate that the given service exists in the config
   * @param {string} name The name of the service
   * @returns {string} The valid input name
   * @throws {TypeError} if the service name is not a string
   * @throws {Error} if there are no services configured
   * @throws {Error} if the service name does not match any services in the config
   */
  #assertServiceName(name) {
    if (typeof name !== 'string') {
      throw new TypeError('service name must be a string')
    }

    const services = this.getServiceNames()

    if (services.length === 0) {
      throw new Error(`No Notify services configured, see:\n$ notifycli service add --help`)
    }

    if (!services.includes(name)) {
      throw new Error(
        `Unkown service, expected ${name} to be one of: ${services.join(', ')}\nSee more help with --help`,
      )
    }

    return name
  }

  /**
   * Get an API key for a given service
   * @param {string} name The name of the service
   * @returns {string} The API key for the given service name
   */
  getService(name) {
    this.#assertServiceName(name)
    return this.#services.get(name)
  }

  /**
   * Add a new service to the config
   * @param {string} name The name of the service
   * @param {string} apiKey The service's API key
   * @throws {TypeError} if the service name is not a string
   * @throws {TypeError} if the service apiKey is not a string
   * @example config.setService('myService', 'apiKey)
   * await config.save()
   */
  setService(name, apiKey) {
    if (typeof name !== 'string') {
      throw new TypeError('service name must be a string')
    }
    if (typeof apiKey !== 'string') {
      throw new TypeError('service api key must be a string')
    }

    this.#services.set(name, apiKey)
  }

  /**
   * Remove a service from the config
   * @param {string} name The name of the service
   * @example config.removeService('myService')
   * await config.save()
   */
  removeService(name) {
    this.#assertServiceName(name)
    this.#services.delete(name)
  }
}
