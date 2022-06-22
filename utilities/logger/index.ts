import task from './msg-task'
import error from './msg-error'
import warn from './msg-warn'
import log from './msg-log'
export { log, warn, error } from './logger'

interface MessageObject {
	message: string
	payload: {
		[key: string]: any
	}
}

type MessageKey = keyof typeof messages
type MessagePayload<T extends MessageKey> =
	typeof messages[T] extends MessageObject
		? typeof messages[T]['payload']
		: never

const messages = { ...task, ...error, ...warn, ...log }

export function __<T extends MessageKey>(
	messageKey: T,
	payload?: MessagePayload<T>
): string {
	const object = messages[messageKey]

	if (typeof object === 'string') {
		return object
	}

	let message = object.message

	for (const key in payload) {
		message = message.replace(`\${${key}}`, payload[key])
	}

	return message
}
