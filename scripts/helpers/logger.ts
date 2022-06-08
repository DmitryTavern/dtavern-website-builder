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
		payload: { type: '', namespace: '' },
	},

	TASK_COMPILER_COMPONENT: {
		message: "[${name}/${type}]: compiling '${namespace}' page",
		payload: { name: '', type: '', namespace: '' },
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

	ERROR: 'Something went wrong',
	ERROR_PAGE_FILE_EXISTS: {
		message: '${file} file already exitst. Use -f for force creating',
		payload: { file: '' },
	},
	ERROR_COMPONENT_EXISTS: {
		message:
			'Component "${component}" in "${category}" already exitst. Use -f for force creating',
		payload: { component: '', category: '' },
	},
	ERROR_NAME_TAKEN: {
		message: 'New name "${name}" is already taken. Please, use other name',
		payload: { name: '' },
	},
	ERROR_COMPONENT_IS_NOT_CORRECT: {
		message:
			'Component is not correct: "${component}". Need: "{category}/{name}"',
		payload: { component: '' },
	},
	ERROR_TEMPLATE_NOT_FOUND: {
		message: 'Template "${name}" in template loader not found',
		payload: { name: '' },
	},

	WARN_COMPILER_PAGEDIR: {
		message:
			'[viewsWatcher]: You created "${dirname}" dir in "${dir}", but file for this dir not found. Watcher will be ignore it.',
		payload: { dirname: '', dir: '' },
	},
	WARN_COMPILER_COMPONENTDIR: {
		message:
			'[componentWatcher]: Not found file with "${ext}" ext or component have not path to page',
		payload: { ext: '' },
	},
	WARN_AUTOIMPORT_TURN_OFF: 'Autoimport turn off in .env',
	WARN_REINJECT_NONE:
		'Please, don\'t use "none" namespace in reinject function',
	WARN_PAGE_RENAME_OVERWRITE: {
		message: 'Rename function overwrite existing file "${file}"',
		payload: { file: '' },
	},
	WARN_PAGE_RENAME_MERGE: {
		message:
			'Rename function marge existing directory: "${pageDir}" with "${dir}"',
		payload: { pageDir: '', dir: '' },
	},

	LOG_CREATE_DIR: {
		message: 'Dir "${dir}" was created',
		payload: { dir: '' },
	},
	LOG_REMOVE_DIR: {
		message: 'Dir "${dir}" was removed',
		payload: { dir: '' },
	},
	LOG_SUCCESS_PAGE_ADDED: {
		message: 'Page "${name}" success added',
		payload: { name: '' },
	},
	LOG_SUCCESS_PAGE_INCLUDES: {
		message: 'Page ${type} was success included in "${name}" page',
		payload: { type: '', name: '' },
	},
	LOG_SUCCESS_PAGE_RENAMED: {
		message: 'Page "${oldName}" success renamed to "${newName}"',
		payload: { oldName: '', newName: '' },
	},
	LOG_SUCCESS_COMPONENT_ADDED: {
		message: 'Component "${name}" success added',
		payload: { name: '' },
	},
	LOG_SUCCESS_COMPONENT_REGISTRED: {
		message:
			'Component "${component}" success registred to "${namespace}" namespace',
		payload: { component: '', namespace: '' },
	},
	LOG_SUCCESS_COMPONENT_UNREGISTRED: {
		message: 'Component "${component}" success unregistred',
		payload: { component: '' },
	},
	LOG_SUCCESS_NAMESPACE_REINJECTED: {
		message: 'Components of "${namespace}" namespace success reinjected',
		payload: { namespace: '' },
	},
	LOG_SUCCESS_COMPONENT_RENAMED: {
		message: 'Component "${oldName}" success renamed to "${newName}"',
		payload: { oldName: '', newName: '' },
	},
	LOG_COMPONENTS_CONFIG_INTEGRITY:
		'Components config integrity check found components without namesapce. They are added to "none" namespace',
	LOG_NAMESPACE_FILES_CREATED_PAGE: {
		message: 'Was created "${namespace}" page for component',
		payload: { namespace: '' },
	},
	LOG_NAMESPACE_FILES_CREATED_STYLE: {
		message: 'Was created style for "${namespace}" page for component',
		payload: { namespace: '' },
	},
	LOG_NAMESPACE_FILES_CREATED_SCRIPT: {
		message: 'Was created script for "${namespace}" page for component',
		payload: { namespace: '' },
	},
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
