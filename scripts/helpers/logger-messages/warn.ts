export default {
	// Autoimport
	WARN_AUTOIMPORT_TURN_OFF: 'Autoimport turn off in .env',
	WARN_REINJECT_NONE:
		'Please, don\'t use "none" namespace in reinject function',

	// Compilers
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

	// Page renaming
	WARN_PAGE_RENAME_OVERWRITE: {
		message: 'Rename function overwrite existing file "${file}"',
		payload: { file: '' },
	},
	WARN_PAGE_RENAME_MERGE: {
		message:
			'Rename function marge existing directory: "${pageDir}" with "${dir}"',
		payload: { pageDir: '', dir: '' },
	},
}
