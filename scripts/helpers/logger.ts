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

const messages = {
	TASK_COMPILER_PAGE: {
		message: "[page/${type}]: compiling '${namespace}' page",
		payload: {
			type: '',
			namespace: '',
		},
	},

	TASK_COMPILER_COMPONENT: {
		message: "[${name}/${type}]: compiling '${namespace}' page",
		payload: {
			name: '',
			type: '',
			namespace: '',
		},
	},

	TASK_HTML: '[task]: run html service',
	TASK_STYLE: '[task]: run style service',
	TASK_SCRIPT: '[task]: run script service',
	TASK_IMAGES: '[task]: run image service',
	TASK_SPRITE: '[task]: run sprite service',
	TASK_SERVER: '[task]: run server service',
	TASK_CLEAN: '[task]: run clean service',
	TASK_FONTS: '[task]: run font service',

	TASK_COMPILER_STYLE_PAGES: '[global/style]: compiling pages',
	TASK_COMPILER_STYLE_GLOBAL: '[global/style]: compiling files',

	TASK_COMPILER_SCRIPT_PAGES: '[global/js]: compiling all pages',
	TASK_COMPILER_SCRIPT_GLOBAL: '[global/js]: compiling all files',
	TASK_COMPILER_SCRIPT_VENDOR: '[global/js/vendor]: compiling all vendor files',

	TASK_COMPILER_IMAGES: '[global/images]: compiling all images',
	TASK_COMPILER_IMAGES_WEBP: '[global/images/webp]: compiling all images',
	TASK_COMPILER_IMAGES_FAVICON: '[global/images/favicon]: compiling all images',

	TASK_COMPILER_FONT: '[font]: move all files',

	TASK_COMPILER_SPRITE: '[global/sprite]: compiling sprite',

	WARN_COMPILER_PAGEDIR: {
		message:
			'[viewsWatcher]: You created "${dirname}" dir in "${dir}", but file for this dir not found. Watcher will be ignore it.',
		payload: {
			dirname: '',
			dir: '',
		},
	},

	WARN_COMPILER_COMPONENTDIR: {
		message:
			'[componentWatcher]: Not found file with "${ext}" ext or component have not path to page',
		payload: {
			ext: '',
		},
	},

	LOG_CREATE_DIR: {
		message: 'dir "${dir}" was created',
		payload: {
			dir: ''
		}
	},

	LOG_REMOVE_DIR: {
		message: 'dir "${dir}" was removed',
		payload: {
			dir: ''
		}
	}
}

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

export function error(...args: any[]) {
	console.error('\x1b[91m[error]:\x1b[0m', ...args)
}

export function log(...args: any[]) {
	console.log('\x1b[96m[log]:\x1b[0m', ...args)
}

export function warn(...args: any[]) {
	console.log('\x1b[93m[warn]:\x1b[0m', ...args)
}
