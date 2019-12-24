// Shared page view tracking logic.
export class PageViewTracker {
	constructor(client) {
		this._client = client
	}

	page({ payload: { properties, options }}) {
		let eventType = 'Page View'
		if (options && options.eventType) {
			eventType = options.eventType
		}
		this._client.logEvent(eventType, properties)
	}
}
