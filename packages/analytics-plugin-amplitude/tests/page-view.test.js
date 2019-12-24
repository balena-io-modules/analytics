import test from 'ava'
import { PageViewTracker } from '../src/page-view'

test('PageViewTracker: page', (t) => {
	let lastData = null

	const client = {
		logEvent: (eventType, props) => {
			lastData = { eventType, props }
	  }
	}

	const tracker = new PageViewTracker(client)

	tracker.page({ payload: { properties: { p1: 'v1' } } })
	t.deepEqual(lastData, { eventType: 'Page View', props: { p1: 'v1' } })

	tracker.page({ payload: { properties: { p2: 'v2' }, options: { eventType: 'T1' } } })
	t.deepEqual(lastData, { eventType: 'T1', props: { p2: 'v2' } })
})
