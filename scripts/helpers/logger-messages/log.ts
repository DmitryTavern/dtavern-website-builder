export default {
	// Dir
	LOG_CREATE_DIR: {
		message: 'Dir "${dir}" was created',
		payload: { dir: '' },
	},
	LOG_REMOVE_DIR: {
		message: 'Dir "${dir}" was removed',
		payload: { dir: '' },
	},
	LOG_COPY_DIR: {
		message: 'Dir "${formDir}" was copied to "${toDir}"',
		payload: { formDir: '', toDir: '' },
	},

	// Pages
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

	// Namespace
	LOG_SUCCESS_NAMESPACE_REINJECTED: {
		message: 'Components of "${namespace}" namespace success reinjected',
		payload: { namespace: '' },
	},
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

	// Components
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
	LOG_SUCCESS_COMPONENT_RENAMED: {
		message: 'Component "${oldName}" success renamed to "${newName}"',
		payload: { oldName: '', newName: '' },
	},

	// Components config
	LOG_COMPONENTS_CONFIG_INTEGRITY:
		'Components config integrity check found components without namesapce. They are added to "none" namespace',
}
