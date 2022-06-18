export default {
	ERROR: 'Something went wrong',

	// Page file (pug/scss/js)
	ERROR_PAGE_FILE_EXISTS: {
		message: '${file} file already exitst. Use -f for force creating',
		payload: { file: '' },
	},
	ERROR_INVALID_NAME: 'This name is invalid. Use other',

	// Components
	ERROR_COMPONENT_EXISTS: {
		message:
			'Component "${component}" in "${category}" already exitst. Use -f for force creating',
		payload: { component: '', category: '' },
	},
	ERROR_COMPONENT_IS_NOT_CORRECT: {
		message:
			'Component is not correct: "${component}". Need: "{category}/{name}"',
		payload: { component: '' },
	},
	ERROR_COMPONENT_CONFIG_NOT_FOUND: {
		message: 'Component "${component}" have not config file',
		payload: { component: '' },
	},
	ERROR_COMPONENT_CONFIG_HAVE_NOT_PARAM: {
		message: 'Component "${component}" have not "${param}" in config file',
		payload: { component: '', param: '' },
	},

	ERROR_NAME_TAKEN: {
		message: 'New name "${name}" is already taken. Please, use other name',
		payload: { name: '' },
	},
	ERROR_TEMPLATE_NOT_FOUND: {
		message: 'Template "${name}" in template loader not found',
		payload: { name: '' },
	},

	// Store
	ERROR_STORE_NOT_EXISTS: 'Store not exists',
}
