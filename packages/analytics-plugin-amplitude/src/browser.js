import amplitudeLib from 'amplitude-js';
import {PageViewTracker} from "./page-view";

/**
 * Amplitude plugin
 * @link https://getanalytics.io/plugins/amplitude/
 * @link https://amplitude.com/
 * @link https://developers.amplitude.com
 * @param {object} pluginConfig - Plugin settings
 * @param {string} pluginConfig.apiKey - Amplitude project API key
 * @param {string} pluginConfig.projectName - project name (if it's necessary to report to multiple projects)
 * @param {object} pluginConfig.options - Amplitude SDK options
 * @return {*}
 * @example
 *
 * amplitude({
 *   apiKey: 'token'
 * })
 */
export default function amplitude(pluginConfig = {}) {
  // Amplitude client instance.
  let client = null
	// Flag is set to true after amplitude client instance is initialized.
	let amplitudeInitCompleted = false
	// Page view tracker.
	let pageViewTracker = null

  return {
    name: 'amplitude',
    config: pluginConfig,

		// An escape hatch that allows accessing Amplitude APIs directly.
		amplitude: amplitudeLib,

    initialize: ({ config, instance }) => {
      const { apiKey, projectName, options } = config
      if (!apiKey) {
        throw new Error('Amplitude project API key is not defined')
      }
      if (options && typeof options !== 'object') {
        throw new Error('Amplitude SDK options must be an object')
      }
      client = amplitudeLib.getInstance(projectName)
      client.init(apiKey, null, options, () => amplitudeInitCompleted = true)
			client.setDeviceId(instance.user('anonymousId'))
			pageViewTracker = new PageViewTracker(client)
    },

    page: (data) => pageViewTracker.page(data),

    track: ({ payload: { event, properties } }) => {
      client.logEvent(event, properties)
    },

    identify: ({ payload: { userId, traits } }) => {
      client.setUserId(userId)
      client.setUserProperties(traits)
    },

    loaded: () => amplitudeInitCompleted
  }
}
